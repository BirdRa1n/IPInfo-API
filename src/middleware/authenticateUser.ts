import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Session from '../database/models/sessions';
import User from '../database/models/user';

interface AuthenticatedRequest extends Request {
    user?: User;
}

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const session = await Session.findOne({
            where: { token: token }
        });

        if (!session) {
            return res.status(401).json({ message: 'Invalid or expired session.' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user; // Anexar o usuário à requisição
        next();
    } catch (error: any) {
        console.error('User authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized: ' + error.message });
    }
};

export default authenticateUser;

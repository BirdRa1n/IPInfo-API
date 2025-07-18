import { Request, Response } from 'express';
import User from '../../database/models/user';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import Session from '../../database/models/sessions';

interface Props {
    req: Request;
    res: Response;
}

const Auth = async ({ req, res }: Props) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: 'Email and password are required' });

    try {
        const result = await User.findOne({
            where: {
                email: email
            }
        });

        if (!result) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, result.auth_hash);

        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            throw new Error('JWT_SECRET não está definido');
        }

        const token = jwt.sign({ user: result.id }, process.env.JWT_SECRET, { expiresIn: '1d' }); res.cookie('token', token, { httpOnly: true });

        Session.create({
            user_id: result.id,
            token: token
        });

        res.status(200).send({ message: 'Authentication successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export default Auth;
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bcrypt from "bcrypt";
import User from '../../database/models/user';
dotenv.config();

interface Props {
    req: Request;
    res: Response;
}

const getUser = async ({ req, res }: Props) => {
    const token = req.cookies?.token;
    if (!token) {
        console.error('Token not found');
        console.log(req.cookies)
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            throw new Error('JWT_SECRET não está definido');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = Object(decoded);

        if (!result) return res.status(404).send({ message: 'User not found' });

        const user = await User.findOne({
            where: {
                id: result.user
            },
            attributes: ['id', 'name', 'email', 'createdAt']
        });

        if (!user) return res.status(404).send({ message: 'User not found' });

        return res.status(200).send(user);
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

export default getUser
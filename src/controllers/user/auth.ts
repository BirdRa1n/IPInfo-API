import { Request, Response } from 'express';
import User from '../../database/models/user';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const bcrypt = require('bcrypt');

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

        return res.status(200).send(result);

        if (!result) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.comparePassword(password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não está definido');
        }

        //const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, { expiresIn: '1d' }); res.cookie('token', token, { httpOnly: true });

        res.status(200).send({ message: 'Authentication successful' });
    } catch (error) {
        res.status(500).send('Error retrieving location information');
    }
}

export default Auth;
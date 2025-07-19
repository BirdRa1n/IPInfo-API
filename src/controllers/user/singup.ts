import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../database/models/user';

interface Props {
    req: Request;
    res: Response;
}

const singup = async ({ req, res }: Props) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create user with Free plan (ID 1)
        const user = await User.create({
            name,
            email,
            auth_hash: hash,
            planId: 1 // Free plan
        });

        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default singup;

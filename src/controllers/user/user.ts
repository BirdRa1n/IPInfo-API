import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';
import ApiKey from '../../database/models/api_key';
import Plan from '../../database/models/plan';


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
            attributes: ['id', 'name', 'email', 'createdAt'],
            include: [
                {
                    model: ApiKey,
                    attributes: ['key', 'status']
                },
                {
                    model: Plan
                }
            ]
        });

        if (!user?.plan) {
            //se for admin, cria um plano unlimited.
            if (user?.email === process.env.ADMIN_EMAIL) {
                const [plan] = await Plan.findOrCreate({
                    where: {
                        name: 'Unlimited'
                    },
                    defaults: {
                        name: 'Unlimited',
                        price: 0,
                        maxRequests: 0,
                        maxRequestsPerDay: 0,
                        maxRequestsPerMonth: 0,
                        maxRequestsPerYear: 0
                    }
                });

                await User.update({
                    planId: plan?.dataValues.id
                }, {
                    where: {
                        id: user?.id
                    }
                });
            }
            else {
                const result = await Plan.findOne({
                    where: {
                        name: 'Free'
                    }
                });

                await User.update({
                    planId: result?.dataValues.id
                }, {
                    where: {
                        id: user?.id
                    }
                });
            }
        }

        if (!user) return res.status(404).send({ message: 'User not found' });

        return res.status(200).send(user);
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

export default getUser
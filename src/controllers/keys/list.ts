// FileName: /src/controllers/api_key/list.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ApiKey from '../../database/models/api_key';
import RequestLog from '../../database/models/request_log';
import User from '../../database/models/user';

const ListAPIKeys = async (req: Request, res: Response) => {
    try {
        // Obter o usuário autenticado (anexado pelo middleware authenticateUser)
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Encontrar todas as API Keys do usuário
        const apiKeys = await ApiKey.findAll({
            where: { userId: user.id },
            attributes: ['key', 'createdAt'], // Apenas campos necessários
        });

        if (apiKeys.length === 0) {
            return res.status(200).json({ message: 'No API Keys found for this user', apiKeys: [] });
        }

        // Obter o plano do usuário para os limites máximos
        const userWithPlan = await User.findByPk(user.id, {
            include: ['plan'], // Assumindo que há uma associação User.belongsTo(Plan)
        });

        if (!userWithPlan || !userWithPlan.plan) {
            return res.status(500).json({ message: 'User plan not found' });
        }

        const plan = userWithPlan.plan;
        const maxLimits = {
            total: plan.maxRequests,
            perDay: plan.maxRequestsPerDay,
            perMonth: plan.maxRequestsPerMonth,
            perYear: plan.maxRequestsPerYear,
        };

        // Calcular uso atual para cada key
        const currentDate = new Date();
        const apiKeysWithLimits = await Promise.all(
            apiKeys.map(async (apiKey) => {
                const keyId = apiKey.key; // Assumindo que 'key' é o ID único (string)

                // Contar requisições totais (todas bem-sucedidas)
                const totalRequests = await RequestLog.count({
                    where: {
                        apiKeyId: keyId,
                        success: true,
                    },
                });

                // Requisições diárias (últimas 24h)
                const oneDayAgo = new Date(currentDate);
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                const dailyRequests = await RequestLog.count({
                    where: {
                        apiKeyId: keyId,
                        success: true,
                        createdAt: { [Op.gte]: oneDayAgo },
                    },
                });

                // Requisições mensais (últimos 30 dias)
                const oneMonthAgo = new Date(currentDate);
                oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
                const monthlyRequests = await RequestLog.count({
                    where: {
                        apiKeyId: keyId,
                        success: true,
                        createdAt: { [Op.gte]: oneMonthAgo },
                    },
                });

                // Requisições anuais (últimos 365 dias)
                const oneYearAgo = new Date(currentDate);
                oneYearAgo.setDate(oneYearAgo.getDate() - 365);
                const yearlyRequests = await RequestLog.count({
                    where: {
                        apiKeyId: keyId,
                        success: true,
                        createdAt: { [Op.gte]: oneYearAgo },
                    },
                });

                return {
                    key: apiKey.key,
                    createdAt: apiKey.createdAt,
                    limits: {
                        total: { current: totalRequests, max: maxLimits.total },
                        perDay: { current: dailyRequests, max: maxLimits.perDay },
                        perMonth: { current: monthlyRequests, max: maxLimits.perMonth },
                        perYear: { current: yearlyRequests, max: maxLimits.perYear },
                    },
                };
            })
        );

        return res.status(200).json(apiKeysWithLimits);

    } catch (error: any) {
        console.error('Error listing API Keys:', error);
        return res.status(500).json({
            message: 'Failed to list API Keys',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

export default ListAPIKeys;
import { Request, Response, NextFunction } from 'express';
import ApiKey from '../database/models/api_key';
import RequestLog from '../database/models/request_log';
import User from '../database/models/user';
import Plan from '../database/models/plan';
import { Op } from 'sequelize';

interface AuthenticatedRequest extends Request {
    apiKey?: ApiKey;
    user?: User;
    requestLogId?: number;
}

const authenticateApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'API Key is required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Malformed authorization header. Expected format: Bearer {API_KEY}' });
    }

    try {
        // Buscar a API Key no banco de dados com associações
        const foundApiKey = await ApiKey.findOne({
            where: { key: token, status: 'active' },
            include: [
                {
                    model: User,
                    as: 'user', // Changed from 'User ' to 'user'
                    include: [
                        {
                            model: Plan,
                            as: 'plan'
                        }
                    ]
                }
            ]
        });


        if (!foundApiKey) {
            return res.status(401).json({ message: 'Invalid or revoked API Key' });
        }

        // Verificar se a API Key expirou (se expiresAt estiver definido)
        if (foundApiKey.expiresAt && new Date() > foundApiKey.expiresAt) {
            return res.status(401).json({ message: 'API Key has expired' });
        }

        // Verificar limites de requisição do plano do usuário
        const userPlan = foundApiKey.User?.planId ? await Plan.findByPk(foundApiKey.User.planId) : null;
        if (userPlan) {
            const now = new Date();

            // Verificar requisições no dia atual
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const requestsToday = await RequestLog.count({
                where: {
                    apiKeyId: foundApiKey.key,
                    timestamp: {
                        [Op.gte]: todayStart,
                        [Op.lt]: new Date(todayStart.getTime() + 86400000) // +1 dia
                    },
                    success: true
                }
            });

            if (requestsToday >= userPlan.maxRequestsPerDay) {
                return res.status(429).json({
                    message: 'Daily request limit exceeded',
                    limit: userPlan.maxRequestsPerDay,
                    remaining: 0
                });
            }

            // Verificar requisições no mês atual
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const requestsThisMonth = await RequestLog.count({
                where: {
                    apiKeyId: foundApiKey.key,
                    timestamp: {
                        [Op.gte]: monthStart,
                        [Op.lt]: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
                    },
                    success: true
                }
            });

            if (requestsThisMonth >= userPlan.maxRequestsPerMonth) {
                return res.status(429).json({
                    message: 'Monthly request limit exceeded',
                    limit: userPlan.maxRequestsPerMonth,
                    remaining: 0
                });
            }
        }

        // Registrar a requisição no log
        const loggedRequest = await RequestLog.create({
            apiKeyId: foundApiKey.key,
            userId: foundApiKey.User?.id || null,
            ipAddress: req.ip,
            endpoint: req.originalUrl,
            success: true
        });

        // Anexar informações à requisição
        req.apiKey = foundApiKey;
        req.user = foundApiKey.User || undefined;
        req.requestLogId = loggedRequest.id;

        next();
    } catch (error: any) {
        console.error('API Key authentication error:', error);

        // Registrar falha no log
        try {
            await RequestLog.create({
                apiKeyId: token,
                userId: null,
                ipAddress: req.ip,
                endpoint: req.originalUrl,
                success: false,
                errorMessage: error.message
            });
        } catch (logError) {
            console.error('Failed to log failed API request:', logError);
        }

        return res.status(500).json({
            message: 'Internal server error during authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default authenticateApiKey;

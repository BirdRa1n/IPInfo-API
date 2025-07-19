import { Request, Response } from 'express';
import ApiKey from '../../database/models/api_key';
import User from '../../database/models/user';
import { v4 as uuidv4 } from 'uuid';
import RequestLog from '../../database/models/request_log';

const CreateAPIKey = async ({ req, res }: { req: Request; res: Response }) => {
    try {
        // Validate required fields from request body
        const { name, expiresInDays } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({
                message: 'API Key name is required and must be a string',
                field: 'name'
            });
        }

        // Get authenticated user from request (attached by authenticateUser middleware)
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Check if user has reached API key limit
        const existingKeysCount = await ApiKey.count({
            where: { userId: user.id, status: 'active' }
        });

        const userPlan = await user.getPlan();
        if (userPlan && existingKeysCount >= userPlan.maxApiKeys) {
            return res.status(403).json({
                message: `Maximum API keys limit reached (${userPlan.maxApiKeys})`,
                limit: userPlan.maxApiKeys,
                current: existingKeysCount
            });
        }

        // Calculate expiration date (if provided)
        let expiresAt: Date | null = null;
        if (expiresInDays && typeof expiresInDays === 'number' && expiresInDays > 0) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + expiresInDays);
            expiresAt = expirationDate;
        }

        // Generate API key
        const apiKey = uuidv4().replace(/-/g, ''); // Remove hyphens from UUID

        // Create the API key record
        const createdKey = await ApiKey.create({
            key: apiKey,
            userId: user.id,
            name,
            expiresAt,
            status: 'active'
        });

        // Log the API key creation
        await RequestLog.create({
            apiKeyId: apiKey,
            userId: user.id,
            ipAddress: req.ip,
            endpoint: req.originalUrl,
            success: true,
            errorMessage: null
        });

        // Return response without exposing full key in production
        const responseKey = process.env.NODE_ENV === 'development'
            ? apiKey
            : `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;

        return res.status(201).json({
            message: 'API Key created successfully',
            apiKey: {
                id: createdKey.key,
                name: createdKey?.name,
                createdAt: createdKey.createdAt,
                expiresAt: createdKey.expiresAt,
                preview: responseKey,
                fullKey: process.env.NODE_ENV === 'development' ? apiKey : undefined
            },
            limits: {
                total: userPlan?.maxApiKeys || 'unlimited',
                remaining: userPlan ? userPlan.maxApiKeys - existingKeysCount - 1 : 'unlimited'
            }
        });

    } catch (error: any) {
        console.error('API Key creation error:', error);

        // Log the failed attempt
        try {
            await RequestLog.create({
                userId: (req as any).user?.id || null,
                ipAddress: req.ip,
                endpoint: req.originalUrl,
                success: false,
                errorMessage: error.message
            });
        } catch (logError) {
            console.error('Failed to log API key creation error:', logError);
        }

        return res.status(500).json({
            message: 'Failed to create API Key',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default CreateAPIKey;

// FileName: /src/controllers/api_key/delete.ts
import { Request, Response } from 'express';
import ApiKey from '../../database/models/api_key';
import RequestLog from '../../database/models/request_log';

const DeleteAPIKey = async ({ req, res }: { req: Request; res: Response }) => {
    try {
        const { key } = req.params; // A chave da API a ser deletada virá como parâmetro na URL

        // Obter o usuário autenticado da requisição (anexado pelo middleware authenticateUser)
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Encontrar a API Key no banco de dados
        const apiKeyToDelete = await ApiKey.findOne({
            where: { key: key, userId: user.id } // Garantir que o usuário só pode deletar suas próprias chaves
        });

        if (!apiKeyToDelete) {
            return res.status(404).json({ message: 'API Key not found or does not belong to the authenticated user.' });
        }

        // Deletar a API Key
        await apiKeyToDelete.destroy();

        // Registrar a ação no log
        await RequestLog.create({
            apiKeyId: key, // A chave da API que foi deletada
            userId: user.id,
            ipAddress: req.ip,
            endpoint: req.originalUrl,
            success: true,
            errorMessage: null
        });

        return res.status(200).json({ message: 'API Key deleted successfully.' });

    } catch (error: any) {
        console.error('API Key deletion error:', error);

        // Registrar a falha no log
        try {
            await RequestLog.create({
                apiKeyId: req.params.key || 'unknown', // Tentar registrar a chave mesmo em caso de erro
                userId: (req as any).user?.id || null,
                ipAddress: req.ip,
                endpoint: req.originalUrl,
                success: false,
                errorMessage: error.message
            });
        } catch (logError) {
            console.error('Failed to log API key deletion error:', logError);
        }

        return res.status(500).json({
            message: 'Failed to delete API Key',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default DeleteAPIKey;

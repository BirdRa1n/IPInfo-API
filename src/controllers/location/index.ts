import { Request, Response } from 'express';
import fetchLocationByIp from '../../utils/getLocationByIp';
import RequestLog from '../../database/models/request_log';

interface AuthenticatedRequest extends Request {
    apiKey?: any;
    user?: any;
    requestLogId?: number; // Agora o ID do log é passado
}

const Location = async ({ req, res }: { req: AuthenticatedRequest, res: Response }) => {
    const ipAddress = req.params.ip;
    let success = false;
    let errorMessage: string | undefined;

    try {
        const locationData = await fetchLocationByIp(ipAddress);
        success = true;
        res.json(locationData);
    } catch (error: any) {
        console.error('Error retrieving location information:', error);
        errorMessage = error.message || 'Error retrieving location information';
        res.status(500).send({ message: errorMessage });
    } finally {
        // Atualiza o log de requisição com o resultado final
        if (req.requestLogId) {
            await RequestLog.update(
                {
                    success: success,
                    errorMessage: errorMessage
                },
                {
                    where: { id: req.requestLogId }
                }
            );
        } else {
            // Fallback: se por algum motivo o requestLogId não foi anexado (o que não deveria acontecer com o middleware ajustado)
            console.warn('requestLogId not found on request, creating new log entry for final status.');
            if (req.apiKey && req.user) {
                await RequestLog.create({
                    apiKeyId: req.apiKey.key,
                    userId: req.user.id,
                    ipAddress: ipAddress,
                    endpoint: req.originalUrl,
                    success: success,
                    errorMessage: errorMessage
                });
            }
        }
    }
}

export default Location;

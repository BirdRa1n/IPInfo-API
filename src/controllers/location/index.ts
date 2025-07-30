import { Request, Response } from 'express';
import fetchLocationByIp from '../../utils/getLocationByIp';
import RequestLog from '../../database/models/request_log';

interface AuthenticatedRequest extends Request {
    apiKey?: any;
    user?: any;
    requestLogId?: number;
}

function translateLocationInfo(info: any, lang: string): any {
    const translateField = (field: any) => {
        if (field?.names && field.names[lang]) {
            return {
                ...field,
                name: field.names[lang],
                names: undefined // remove o objeto 'names' se não quiser ele completo na resposta
            };
        }
        return field;
    };

    return {
        ...info,
        city: translateField(info.city),
        continent: translateField(info.continent),
        country: translateField(info.country),
        registered_country: translateField(info.registered_country),
        subdivisions: Array.isArray(info.subdivisions)
            ? info.subdivisions.map(translateField)
            : info.subdivisions
    };
}

const Location = async ({ req, res }: { req: AuthenticatedRequest, res: Response }) => {
    let ipAddress = req.query.ip as string;
    const lang = (req.query.lang as string)?.trim() || 'en'; // padrão: inglês
    let success = false;
    let errorMessage: string | undefined;

    if (!ipAddress && req.ip) {
        ipAddress = req.ip;

        if (ipAddress === '::1') {
            return res.status(400).send({ message: 'Invalid IP address' });
        }
    }

    try {
        const locationData = await fetchLocationByIp(ipAddress);
        const translatedData = translateLocationInfo(locationData, lang);
        success = true;
        res.json({
            ip: ipAddress,
            info: translatedData
        });
    } catch (error: any) {
        console.error('Error retrieving location information:', error);
        errorMessage = error.message || 'Error retrieving location information';
        res.status(500).send({ message: errorMessage });
    } finally {
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
};

export default Location;
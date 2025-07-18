import { Request, Response } from 'express';
import fetchLocationByIp from '../../utils/getLocationByIp';
interface Props {
    req: Request;
    res: Response;
}

const Location = async ({ req, res }: Props) => {
    const ipAddress = req.params.ip;
    try {
        const locationData = await fetchLocationByIp(ipAddress);
        res.json(locationData);
    } catch (error) {
        res.status(500).send('Error retrieving location information');
    }
}

export default Location;
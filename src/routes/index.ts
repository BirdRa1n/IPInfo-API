import express, { Request, Response } from 'express';
import fetchLocationByIp from '../utils/getLocationByIp';

const router = express.Router();

// Route to get location information by IP
router.get('/location/:ip', async (req: Request, res: Response) => {
    const ipAddress = req.params.ip;
    try {
        const locationData = await fetchLocationByIp(ipAddress);
        res.json(locationData);
    } catch (error) {
        res.status(500).send('Error retrieving location information');
    }
});

export default router;

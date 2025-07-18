import express, { Request, Response } from 'express';
import Location from '../controllers/location';
const router = express.Router();

router.get('/location/:ip', (req: Request, res: Response) => {
    Location({ req, res });
});

export default router;
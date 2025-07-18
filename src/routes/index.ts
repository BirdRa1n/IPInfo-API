import express, { Request, Response } from 'express';
import Location from '../controllers/location';
import Auth from '../controllers/user/auth';
const router = express.Router();

router.get('/location/:ip', (req: Request, res: Response) => {
    Location({ req, res });
});

//Auth
router.post('/auth', (req: Request, res: Response) => {
    Auth({ req, res });
});

export default router;
import express, { Request, Response } from 'express';
import Location from '../controllers/location';
import Auth from '../controllers/user/auth';
import getUser from '../controllers/user/user';
const router = express.Router();

router.get('/location/:ip', (req: Request, res: Response) => {
    Location({ req, res });
});

//User
router.post('/user/auth', (req: Request, res: Response) => {
    Auth({ req, res });
});
router.get('/user', (req: Request, res: Response) => {
    getUser({ req, res });
});

export default router;
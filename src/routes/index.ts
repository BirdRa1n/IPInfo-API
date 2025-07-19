import express, { Request, Response } from 'express';
import Location from '../controllers/location';
import Auth from '../controllers/user/auth';
import getUser from '../controllers/user/user';
import authenticateApiKey from '../middleware/authenticateApiKey';
import singup from '../controllers/user/singup';
import authenticateUser from '../middleware/authenticateUser';
import CreateAPIKey from '../controllers/keys/create';
import DeleteAPIKey from '../controllers/keys/delete';
import ListAPIKeys from '../controllers/keys/list';

const router = express.Router();

// Rota de localização protegida por API Key (Bearer Token)
router.get('/location/:ip', authenticateApiKey, (req: Request, res: Response) => {
    Location({ req, res });
});

//User
router.post('/user/auth', (req: Request, res: Response) => {
    Auth({ req, res });
});
router.post('/user/singup', (req: Request, res: Response) => {
    singup({ req, res });
})
router.get('/user', (req: Request, res: Response) => {
    getUser({ req, res });
});

//keys
router.post('/keys', authenticateUser, (req, res) => {
    CreateAPIKey({ req, res });
});
router.delete('/keys/:key', authenticateUser, (req, res) => {
    DeleteAPIKey({ req, res });
});
router.get('/keys', authenticateUser, (req, res) => {
    ListAPIKeys(req, res);
});

export default router;

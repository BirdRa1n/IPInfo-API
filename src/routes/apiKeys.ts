// FileName: /src/routes/apiKeys.ts
import express from 'express';
import CreateAPIKey from '../controllers/api_key/create';
import DeleteAPIKey from '../controllers/api_key/delete';
import ListAPIKeys from '../controllers/api_key/list'; // Importar o novo controller
import authenticateUser from '../middleware/authenticateUser';

const apiKeysRouter = express.Router();

// Rota para criar API Keys
apiKeysRouter.post('/', authenticateUser, (req, res) => {
    CreateAPIKey({ req, res });
});

// Rota para deletar API Keys
apiKeysRouter.delete('/:key', authenticateUser, (req, res) => {
    DeleteAPIKey({ req, res });
});

// Nova rota para listar todas as API Keys e limites
apiKeysRouter.get('/', authenticateUser, (req, res) => {
    ListAPIKeys(req, res);
});

export default apiKeysRouter;
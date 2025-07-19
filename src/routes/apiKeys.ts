// FileName: /src/routes/apiKeys.ts
import express from 'express';
import CreateAPIKey from '../controllers/api_key/create';
import DeleteAPIKey from '../controllers/api_key/delete'; // Importar o novo controller
import authenticateUser from '../middleware/authenticateUser';

const apiKeysRouter = express.Router();

// Rota protegida para criar API Keys
apiKeysRouter.post('/', authenticateUser, (req, res) => {
    CreateAPIKey({ req, res });
});

// Nova rota protegida para deletar API Keys
apiKeysRouter.delete('/:key', authenticateUser, (req, res) => { // Usar ':key' para capturar a chave da API na URL
    DeleteAPIKey({ req, res });
});

export default apiKeysRouter;

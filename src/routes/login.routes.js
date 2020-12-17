// Controlador con la lógica
import * as loginController from '../controllers/login.controller'
// Inicializa router
import { Router } from 'express';
const router = Router();

// Se realiza una petición POST para verificar que el usuario exista
router.post('/login', loginController.login);

export default router;
// Controlador con la lógica
import * as rolController from '../controllers/rol.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

// Realizamos la petición GET para OBTENER TODOS los role de [Usuario.Rol]
router.get('/roles', [verificaToken], rolController.obtenerTodos);

export default router;
// Controlador con la lógica
import * as propietarioController from '../controllers/propietario.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

// Realizamos la petición GET para OBTENER TODOS los propietarios de [Activo.Propietario]
router.get('/propietarios', [verificaToken], propietarioController.obtenerTodos);

export default router;
// Controlador con la lógica
import * as propietarioController from '../controllers/propietario.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER TODOS los propietarios
router.get('/propietarios', [verificaToken], propietarioController.obtenerTodos);

export default router;
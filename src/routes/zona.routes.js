// Controlador con la lógica
import * as zonaController from '../controllers/zona.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER TODAS las zonas
router.get('/zonas', [verificaToken], zonaController.obtenerTodos);

// Realizamos la petición GET para OBTENER las zonas por comuna
router.get('/zonas/comuna/:id', [verificaToken], zonaController.obtenerPorComuna);

export default router;
// Controlador con la lógica
import * as costoController from '../controllers/costo.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Se realiza una petición POST para INGRESAR un nuevo costo a un tipo de gas
router.post('/costo', [verificaToken, verificaAdminRole], costoController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR costo de un tipo de gas
router.put('/costo', [verificaToken, verificaAdminRole], costoController.actualizar);

export default router;
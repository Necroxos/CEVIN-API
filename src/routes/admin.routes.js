// Controlador con la lógica
import * as adminController from '../controllers/admin.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

/**
 * Ingresa el primer administrador
 * Si no existe ingresa el rol administrador
 */
router.get('/primer-admin', adminController.primerAdmin);

// Revisa si un usuario es admin
router.get('/es-admin/:id', [verificaToken, verificaAdminRole], adminController.esAdmin);

export default router;
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

// Realizamos la petición GET para OBTENER TODAS las zonas
router.get('/zonas/activas', [verificaToken], zonaController.obtenerActivos);

// Realizamos la petición GET para OBTENER las zonas por comuna
router.get('/zonas/comuna/:id', [verificaToken], zonaController.obtenerPorComuna);

// Se realiza una petición POST para INGRESAR una nueva zona
router.post('/zona', [verificaToken, verificaAdminRole], zonaController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR una zona
router.put('/zona', [verificaToken], zonaController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR una zona
router.put('/cambio-estado/zona', [verificaToken, verificaAdminRole], zonaController.cambiarEstado);

export default router;
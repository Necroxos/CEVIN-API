// Controlador con la lógica
import * as comunaController from '../controllers/comuna.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER TODAS las comunas
router.get('/comunas', [verificaToken], comunaController.obtenerTodos);

// Realizamos la petición GET para OBTENER las comunas ACTIVAS
router.get('/comunas/activas', [verificaToken], comunaController.obtenerActivos);

// Se realiza una petición POST para INGRESAR una nueva comuna
router.post('/comuna', [verificaToken, verificaAdminRole], comunaController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR una comuna
router.put('/comuna', [verificaToken], comunaController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR una comuna
router.put('/cambio-estado/comuna', [verificaToken, verificaAdminRole], comunaController.cambiarEstado);

export default router;
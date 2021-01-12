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

// Realizamos la petición GET para OBTENER ACTIVOS los propietarios
router.get('/propietarios/activos', [verificaToken], propietarioController.obtenerActivos);

// Se realiza una petición POST para INGRESAR un nuevo propietario
router.post('/propietario', [verificaToken, verificaAdminRole], propietarioController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR un propietario
router.put('/propietario', [verificaToken], propietarioController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR un propietario
router.put('/cambio-estado/propietario', [verificaToken, verificaAdminRole], propietarioController.cambiarEstado);

export default router;
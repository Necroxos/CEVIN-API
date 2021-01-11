// Controlador con la lógica
import * as tipoController from '../controllers/tipo.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER TODOS los tipo de gases
router.get('/gases', [verificaToken], tipoController.obtenerTodos);

// Se realiza una petición POST para INGRESAR un nuevo tipo de gas
router.post('/gas', [verificaToken, verificaAdminRole], tipoController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR un tipo de gas
router.put('/gas', [verificaToken], tipoController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR un tipo de gas
router.put('/cambio-estado/gas', [verificaToken, verificaAdminRole], tipoController.cambiarEstado);

export default router;
// Controlador con la lógica
import * as usuarioController from '../controllers/usuario.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER UN usuario en base a su [rut]
router.get('/usuario/:rut', [verificaToken], usuarioController.obtenerUno);

// Realizamos la petición GET para OBTENER TODOS los usuarios
router.get('/usuarios', [verificaToken], usuarioController.obtenerTodos);

// Se realiza una petición POST para INGRESAR un nuevo usuario
router.post('/usuario', [verificaToken, verificaAdminRole], usuarioController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR un usuario
router.put('/usuario', [verificaToken, verificaAdminRole], usuarioController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR un usuario de la base de datos
router.put('/cambio-estado/usuario', [verificaToken, verificaAdminRole], usuarioController.cambiarEstado);

export default router;
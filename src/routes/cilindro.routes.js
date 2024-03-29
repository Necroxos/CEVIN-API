// Controlador con la lógica
import * as cilindroController from '../controllers/cilindro.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER UN [Activo.Cilindro] en base a su [codigo_activo]
router.get('/cilindro/:code', [verificaToken], cilindroController.obtenerUno);

// Se realiza la petición GET para OBTENER TODOS los cilindros en la base de datos
router.get('/cilindros', [verificaToken], cilindroController.obtenerTodos);

// Se realiza una petición POST para INGRESAR un nuevo cilindro
router.post('/cilindro', [verificaToken], cilindroController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR un cilindro
router.put('/cilindro', [verificaToken], cilindroController.actualizar);

// Se realiza una petición DELETE para DESACTIVAR o ACTIVAR un cilindro de la base de datos
router.put('/cambio-estado/cilindro', [verificaToken, verificaAdminRole], cilindroController.cambiarEstado);

export default router;
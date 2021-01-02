// Controlador con la lógica
import * as clienteController from '../controllers/cliente.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER UN cliente en base a su [rut]
router.get('/cliente/:rut', [verificaToken], clienteController.obtenerUno);

// Realizamos la petición GET para OBTENER UNA dirección de un cliente por ID
router.get('/direccion/:id', [verificaToken], clienteController.obtenerDireccion);

// Realizamos la petición GET para OBTENER TODOS los clientes
router.get('/clientes', [verificaToken], clienteController.obtenerTodos);

// Se realiza una petición POST para INGRESAR un nuevo cliente
router.post('/cliente', [verificaToken, verificaAdminRole], clienteController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR un cliente
router.put('/cliente', [verificaToken], clienteController.actualizar);

// Se realiza una petición PUT para DESACTIVAR o ACTIVAR un cliente de la base de datos
router.put('/cambio-estado/cliente', [verificaToken, verificaAdminRole], clienteController.cambiarEstado);

export default router;
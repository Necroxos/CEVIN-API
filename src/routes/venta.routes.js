// Controlador con la lógica
import * as ventaController from '../controllers/venta.controller'
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
router.get('/venta/:code', [verificaToken], ventaController.obtenerUno);

// Se realiza la petición GET para OBTENER TODAS las ventas en la base de datos
router.get('/ventas', [verificaToken], ventaController.obtenerTodos);

// Se realiza la petición GET para OBTENER TODOS los tipos de atrasps en la base de datos
router.get('/demoras', [verificaToken], ventaController.obtenerDemoras);

// Se realiza la petición GET para OBTENER TODOS los activos disponibles
router.get('/ventas/cilindros', [verificaToken], ventaController.obtenerCilindrosParaVenta);

// Se realiza la petición GET para OBTENER TODOS los activos de una venta
router.get('/cilindros/venta/:id', [verificaToken], ventaController.obtenerCilindrosDeVenta);

// Se realiza una petición POST para INGRESAR una nueva venta
router.post('/venta', [verificaToken], ventaController.ingresar);

// Se realiza una petición PUT para ACTUALIZAR una venta
router.put('/venta', [verificaToken], ventaController.actualizar);

// Se realiza una petición PUT para ACTUALIZAR un cilindro de una venta
router.put('/devolver/cilindro', [verificaToken], ventaController.devolverCilindro);

// Se realiza una petición DELETE para DESACTIVAR o ACTIVAR una venta de la base de datos
router.put('/cambio-estado/venta', [verificaToken, verificaAdminRole], ventaController.cambiarEstado);

export default router;
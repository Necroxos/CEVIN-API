// Controlador con la lógica
import * as ventaController from '../controllers/cilindro-venta.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Se realiza la petición GET para OBTENER TODOS los activos disponibles
router.get('/ventas/cilindros', [verificaToken], ventaController.obtenerCilindrosParaVenta);

// Se realiza la petición GET para OBTENER TODOS los activos de una venta
router.get('/cilindros/venta/:id', [verificaToken], ventaController.obtenerCilindrosDeVenta);

// Se realiza una petición PUT para ACTUALIZAR un cilindro de una venta
router.put('/devolver/cilindro', [verificaToken], ventaController.devolverCilindro);

// Se realiza la petición GET para OBTENER TODOS los activos de una venta
router.get('/cilindro-cliente/:id', [verificaToken], ventaController.obtenerCliente);

export default router;
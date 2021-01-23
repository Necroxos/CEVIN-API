// Controlador con la lógica
import * as stockController from '../controllers/stock.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Las rutas poseen verificación (según corresponda) en base a middleware para: Token válido y privilegios de Admin  *
 *********************************************************************************************************************/

// Realizamos la petición GET para OBTENER cilindros llenos y en bodega
router.get('/stock/llenos', [verificaToken], stockController.obtenerLlenos);

// Se realiza la petición GET para OBTENER cilindros vacios y en bodega
router.get('/stock/vacios', [verificaToken], stockController.obtenerVacios);

// Se realiza una petición GET para OBTENER cilindros en arriendo
router.get('/stock/arrendados', [verificaToken], stockController.obtenerArrendados);

export default router;
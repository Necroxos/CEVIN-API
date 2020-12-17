// Controlador con la lógica
import * as tipoController from '../controllers/tipo.controller'
// Middleware para verificaciones
import { verificaToken, verificaAdminRole } from '../middleware/autenticacion';
// Inicializa router
import { Router } from 'express';
const router = Router();

/**
 * Realizamos la petición GET para OBTENER TODOS los tipo_gas de [Activo.Tipo]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
router.get('/gases', [verificaToken], tipoController.obtenerTodos);

export default router;
import { Router } from 'express';

import propietario from './propietario';
import cilindro from './cilindro';
import usuario from './usuario';
import tipoGas from './tipo';
import admin from './admin';
import login from './login';
import rol from './rol';

const router = Router();

/**
 * En esta sección se importan las rutas que permite el API
 */
router.use(propietario);
router.use(cilindro);
router.use(usuario);
router.use(tipoGas);
router.use(admin);
router.use(login);
router.use(rol);


export default router;
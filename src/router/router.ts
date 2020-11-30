import { Router } from 'express';

import cilindro from './cilindro';
import usuario from './usuario';
import admin from './admin';
import login from './login';
import rol from './rol';

const router = Router();

/**
 * En esta sección se importan las rutas que permite el API
 */
router.use(cilindro);
router.use(usuario);
router.use(admin);
router.use(login);
router.use(rol);


export default router;
import { Router } from 'express';
import { registrarUsuario, loginUsuario, perfilActual } from '../controllers/usuario.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', autenticar, perfilActual);

export default router;
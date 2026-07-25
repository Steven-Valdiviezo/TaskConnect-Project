import { Router } from 'express';
import {
  registrarUsuario, loginUsuario, perfilActual, confirmarLogin2FA, actualizarPerfil
} from '../controllers/usuario.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/login/verificar-2fa', confirmarLogin2FA);
router.get('/perfil', autenticar, perfilActual);
router.put('/perfil', autenticar, actualizarPerfil);

export default router;
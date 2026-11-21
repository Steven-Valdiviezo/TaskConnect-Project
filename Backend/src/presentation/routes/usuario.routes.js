import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearUsuarioRoutes = (controller, autenticar) => {
  const router = Router();

  router.post('/registro', controller.registrar);
  router.post('/login', controller.login);
  router.post('/login/verificar-2fa', controller.confirmarLogin2FA);
  router.post('/login-prueba', controller.loginPrueba);
  router.get('/perfil', autenticar, controller.perfilActual);
  router.put('/perfil', autenticar, controller.actualizarPerfil);
  router.get('/freelancer/:id', controller.perfilPublicoFreelancer);
  router.get('/freelancer/:id/contacto', autenticar, permitirRoles('cliente'), controller.perfilFreelancerConContacto);

  return router;
};
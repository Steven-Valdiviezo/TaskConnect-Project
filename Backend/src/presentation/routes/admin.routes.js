import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearAdminRoutes = (controller, autenticar) => {
  const router = Router();

  // todo lo de este router es solo para administradores
  router.use(autenticar, permitirRoles('administrador'));

  router.get('/usuarios', controller.listarUsuarios);
  router.patch('/usuarios/:id/desactivar', controller.desactivarUsuario);
  router.patch('/usuarios/:id/reactivar', controller.reactivarUsuario);
  router.get('/auditoria', controller.listarAuditoria);
  router.get('/estadisticas', controller.estadisticas);

  return router;
};
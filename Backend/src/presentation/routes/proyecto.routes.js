import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearProyectoRoutes = (controller, autenticar) => {
  const router = Router();

  router.get('/', controller.listar);
  router.get('/mios', autenticar, permitirRoles('cliente'), controller.listarMios);
  router.get('/:id', controller.obtener);
  router.post('/', autenticar, permitirRoles('cliente'), controller.crear);
  router.put('/:id', autenticar, permitirRoles('cliente'), controller.editar);
  router.patch('/:id/cancelar', autenticar, permitirRoles('cliente'), controller.cancelar);
  router.delete('/:id', autenticar, permitirRoles('administrador'), controller.eliminar);

  return router;
};
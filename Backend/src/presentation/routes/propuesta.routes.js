import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearPropuestaRoutes = (controller, autenticar) => {
  const router = Router();

  router.get('/mias/recibidas', autenticar, permitirRoles('cliente'), controller.listarRecibidas);
  router.get('/mias/enviadas', autenticar, permitirRoles('freelancer'), controller.listarEnviadas);
  router.get('/proyecto/:idProyecto', autenticar, controller.listarDeProyecto);
  router.post('/', autenticar, permitirRoles('freelancer'), controller.enviar);
  router.patch('/:id/rechazar', autenticar, permitirRoles('cliente'), controller.rechazar);
  router.delete('/:id', autenticar, permitirRoles('freelancer'), controller.retirar);

  return router;
};
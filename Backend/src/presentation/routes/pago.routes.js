import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearPagoRoutes = (controller, autenticar) => {
  const router = Router();

  router.post('/', autenticar, permitirRoles('cliente'), controller.registrar);
  router.patch('/:id/marcar-pagado', autenticar, permitirRoles('cliente'), controller.marcarPagado);
  router.get('/contrato/:idContrato', autenticar, controller.obtenerDeContrato);

  return router;
};
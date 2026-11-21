import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearContratoRoutes = (controller, autenticar) => {
  const router = Router();

  router.post('/aceptar/:idPropuesta', autenticar, permitirRoles('cliente'), controller.aceptar);
  router.get('/mios', autenticar, controller.listarMios);
  router.patch('/:id/completar', autenticar, permitirRoles('cliente'), controller.completar);
  router.patch('/:id/cancelar', autenticar, permitirRoles('cliente'), controller.cancelar);

  return router;
};
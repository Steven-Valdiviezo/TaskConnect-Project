import { Router } from 'express';

export const crearCalificacionRoutes = (controller, autenticar) => {
  const router = Router();

  router.post('/', autenticar, controller.registrar);
  router.get('/mias/emitidas', autenticar, controller.listarEmitidas);
  router.get('/usuario/:idUsuario', controller.listarRecibidas);
  router.get('/reputacion/:idFreelancer', controller.obtenerReputacion);

  return router;
};
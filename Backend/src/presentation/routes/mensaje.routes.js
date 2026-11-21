import { Router } from 'express';

export const crearMensajeRoutes = (controller, autenticar) => {
  const router = Router();

  router.get('/no-leidos', autenticar, controller.contarNoLeidos);
  router.post('/', autenticar, controller.enviar);
  router.get('/conversacion/:idUsuario', autenticar, controller.obtenerConversacion);
  router.patch('/:id/leido', autenticar, controller.marcarLeido);

  return router;
};
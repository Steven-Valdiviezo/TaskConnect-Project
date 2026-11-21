import { Router } from 'express';

export const crearEstadisticasRoutes = (controller) => {
  const router = Router();

  // Público, sin autenticación: solo devuelve conteos agregados, ningún dato sensible de usuarios
  router.get('/', controller.publicas);

  return router;
};
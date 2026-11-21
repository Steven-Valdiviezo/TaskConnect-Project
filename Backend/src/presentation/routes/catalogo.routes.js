import { Router } from 'express';
import { permitirRoles } from '../middlewares/auth.middleware.js';

export const crearCatalogoRoutes = (controller, autenticar) => {
  const router = Router();
  const soloAdmin = [autenticar, permitirRoles('administrador')];

  // ---- Categoría ----
  router.get('/categorias', controller.listarCategorias);
  router.post('/categorias', ...soloAdmin, controller.crearCategoria);
  router.put('/categorias/:id', ...soloAdmin, controller.actualizarCategoria);
  router.delete('/categorias/:id', ...soloAdmin, controller.eliminarCategoria);

  // ---- Profesión ----
  router.get('/profesiones', controller.listarProfesiones);
  router.post('/profesiones', ...soloAdmin, controller.crearProfesion);
  router.put('/profesiones/:id', ...soloAdmin, controller.actualizarProfesion);
  router.delete('/profesiones/:id', ...soloAdmin, controller.eliminarProfesion);

  // ---- Método de pago ----
  router.get('/metodos-pago', controller.listarMetodosPago);
  router.post('/metodos-pago', ...soloAdmin, controller.crearMetodoPago);
  router.put('/metodos-pago/:id', ...soloAdmin, controller.actualizarMetodoPago);
  router.delete('/metodos-pago/:id', ...soloAdmin, controller.eliminarMetodoPago);

  // ---- Configuración pública (tarifa del IVA) ----
  router.get('/configuracion', controller.obtenerConfiguracion);

  return router;
};
import { Router } from 'express';
import {
  listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  listarProfesiones, crearProfesion, actualizarProfesion, eliminarProfesion,
  listarMetodosPago, crearMetodoPago, actualizarMetodoPago, eliminarMetodoPago, obtenerConfiguracion
} from '../controllers/catalogo.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ---- Categoría ----
router.get('/categorias', listarCategorias);
router.post('/categorias', autenticar, permitirRoles('administrador'), crearCategoria);
router.put('/categorias/:id', autenticar, permitirRoles('administrador'), actualizarCategoria);
router.delete('/categorias/:id', autenticar, permitirRoles('administrador'), eliminarCategoria);

// ---- Profesión ----
router.get('/profesiones', listarProfesiones);
router.post('/profesiones', autenticar, permitirRoles('administrador'), crearProfesion);
router.put('/profesiones/:id', autenticar, permitirRoles('administrador'), actualizarProfesion);
router.delete('/profesiones/:id', autenticar, permitirRoles('administrador'), eliminarProfesion);

// ---- Método de pago ----
router.get('/metodos-pago', listarMetodosPago);
router.post('/metodos-pago', autenticar, permitirRoles('administrador'), crearMetodoPago);
router.put('/metodos-pago/:id', autenticar, permitirRoles('administrador'), actualizarMetodoPago);
router.delete('/metodos-pago/:id', autenticar, permitirRoles('administrador'), eliminarMetodoPago);
// ---- Configuración pública (tarifa del IVA) ----
router.get('/configuracion', obtenerConfiguracion);
export default router;
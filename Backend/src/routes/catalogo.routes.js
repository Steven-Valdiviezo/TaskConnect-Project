import { Router } from 'express';
import {
  listarCategorias, crearCategoria,
  listarProfesiones, crearProfesion,
  listarMetodosPago, crearMetodoPago
} from '../controllers/catalogo.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/categorias', listarCategorias);
router.post('/categorias', autenticar, permitirRoles('administrador'), crearCategoria);

router.get('/profesiones', listarProfesiones);
router.post('/profesiones', autenticar, permitirRoles('administrador'), crearProfesion);

router.get('/metodos-pago', listarMetodosPago);
router.post('/metodos-pago', autenticar, permitirRoles('administrador'), crearMetodoPago);

export default router;
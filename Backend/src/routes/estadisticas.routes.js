import { Router } from 'express';
import { obtenerEstadisticasPublicas } from '../controllers/estadisticas.controller.js';

const router = Router();

// Público, sin autenticación: solo devuelve conteos agregados, ningún dato sensible de usuarios
router.get('/', obtenerEstadisticasPublicas);

export default router;
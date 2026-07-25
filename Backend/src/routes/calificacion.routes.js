import { Router } from 'express';
import { 
    registrarCalificacion, listarCalificacionesRecibidas, 
    obtenerReputacion, listarCalificacionesEmitidas 
} from '../controllers/calificacion.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', autenticar, registrarCalificacion);
router.get('/mias/emitidas', autenticar, listarCalificacionesEmitidas);
router.get('/usuario/:idUsuario', listarCalificacionesRecibidas);
router.get('/reputacion/:idFreelancer', obtenerReputacion);

export default router;
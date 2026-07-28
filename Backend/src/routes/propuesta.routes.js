import { Router } from 'express';
import { 
    listarPropuestasDeProyecto, listarPropuestasDelCliente, 
    listarMisPropuestasEnviadas, enviarPropuesta, rechazarPropuesta } 
from '../controllers/propuesta.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';
import { retirarPropuesta } from '../controllers/propuesta.controller.js';

const router = Router();

router.get('/mias/recibidas', autenticar, permitirRoles('cliente'), listarPropuestasDelCliente);
router.get('/mias/enviadas', autenticar, permitirRoles('freelancer'), listarMisPropuestasEnviadas);
router.get('/proyecto/:idProyecto', autenticar, listarPropuestasDeProyecto);
router.post('/', autenticar, permitirRoles('freelancer'), enviarPropuesta);
router.patch('/:id/rechazar', autenticar, permitirRoles('cliente'), rechazarPropuesta);
router.delete('/:id', autenticar, permitirRoles('freelancer'), retirarPropuesta);

export default router;
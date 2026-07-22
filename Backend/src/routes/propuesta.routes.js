import { Router } from 'express';
import { listarPropuestasDeProyecto, enviarPropuesta } from '../controllers/propuesta.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/proyecto/:idProyecto', autenticar, listarPropuestasDeProyecto);
router.post('/', autenticar, permitirRoles('freelancer'), enviarPropuesta);

export default router;
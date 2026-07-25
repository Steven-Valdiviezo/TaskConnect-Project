import { Router } from 'express';
import {
  listarProyectos, obtenerProyecto, crearProyecto, 
  editarProyecto, cancelarProyecto, listarMisProyectos
} from '../controllers/proyecto.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listarProyectos);
router.get('/mios', autenticar, permitirRoles('cliente'), listarMisProyectos);
router.get('/:id', obtenerProyecto);
router.post('/', autenticar, permitirRoles('cliente'), crearProyecto);
router.put('/:id', autenticar, permitirRoles('cliente'), editarProyecto);
router.patch('/:id/cancelar', autenticar, permitirRoles('cliente'), cancelarProyecto);

export default router;
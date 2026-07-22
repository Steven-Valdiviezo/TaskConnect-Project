import { Router } from 'express';
import { listarProyectos, obtenerProyecto, crearProyecto, editarProyecto } from '../controllers/proyecto.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listarProyectos);
router.get('/:id', obtenerProyecto);
router.post('/', autenticar, permitirRoles('cliente'), crearProyecto);
router.put('/:id', autenticar, permitirRoles('cliente'), editarProyecto);

export default router;
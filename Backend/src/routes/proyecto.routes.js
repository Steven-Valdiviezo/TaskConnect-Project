import { Router } from 'express';
import { listarProyectos, obtenerProyecto, crearProyecto, editarProyecto } from '../controllers/proyecto.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';
import { cancelarProyecto } from '../controllers/proyecto.controller.js';

const router = Router();

router.get('/', listarProyectos);
router.get('/:id', obtenerProyecto);
router.post('/', autenticar, permitirRoles('cliente'), crearProyecto);
router.put('/:id', autenticar, permitirRoles('cliente'), editarProyecto);
router.patch('/:id/cancelar', autenticar, permitirRoles('cliente'), cancelarProyecto);

export default router;
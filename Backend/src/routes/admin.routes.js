import { Router } from 'express';
import { listarUsuarios, desactivarUsuario, 
    reactivarUsuario, listarAuditoria, obtenerEstadisticasAdmin
} from '../controllers/admin.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticar, permitirRoles('administrador'));

router.get('/usuarios', listarUsuarios);
router.patch('/usuarios/:id/desactivar', desactivarUsuario);
router.patch('/usuarios/:id/reactivar', reactivarUsuario);
router.get('/auditoria', listarAuditoria);
router.get('/estadisticas', obtenerEstadisticasAdmin);

export default router;
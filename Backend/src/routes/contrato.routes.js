import { Router } from 'express';
import {
  aceptarPropuesta,
  listarMisContratos,
  completarContrato,
  cancelarContrato
} from '../controllers/contrato.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/aceptar/:idPropuesta', autenticar, permitirRoles('cliente'), aceptarPropuesta);
router.get('/mios', autenticar, listarMisContratos);
router.patch('/:id/completar', autenticar, permitirRoles('cliente'), completarContrato);
router.patch('/:id/cancelar', autenticar, permitirRoles('cliente'), cancelarContrato);

export default router;
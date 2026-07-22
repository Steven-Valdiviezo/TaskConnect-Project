import { Router } from 'express';
import { registrarPago, marcarPagoPagado, obtenerPagoDeContrato } from '../controllers/pago.controller.js';
import { autenticar, permitirRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', autenticar, permitirRoles('cliente'), registrarPago);
router.patch('/:id/marcar-pagado', autenticar, permitirRoles('cliente'), marcarPagoPagado);
router.get('/contrato/:idContrato', autenticar, obtenerPagoDeContrato);

export default router;
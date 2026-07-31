import { Router } from 'express';
import { enviarMensaje, obtenerConversacion, marcarLeido, contarNoLeidos } from '../controllers/mensaje.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/no-leidos', autenticar, contarNoLeidos);
router.post('/', autenticar, enviarMensaje);
router.get('/conversacion/:idUsuario', autenticar, obtenerConversacion);
router.patch('/:id/leido', autenticar, marcarLeido);

export default router;
import express from 'express';
import cors from 'cors';

import { crearAutenticar } from '../presentation/middlewares/auth.middleware.js';
import { cuerpoPorDefecto } from '../presentation/middlewares/cuerpo-por-defecto.js';
import { manejarErrores } from '../presentation/middlewares/error-handler.js';

import { crearUsuarioRoutes } from '../presentation/routes/usuario.routes.js';
import { crearProyectoRoutes } from '../presentation/routes/proyecto.routes.js';
import { crearPropuestaRoutes } from '../presentation/routes/propuesta.routes.js';
import { crearContratoRoutes } from '../presentation/routes/contrato.routes.js';
import { crearPagoRoutes } from '../presentation/routes/pago.routes.js';
import { crearMensajeRoutes } from '../presentation/routes/mensaje.routes.js';
import { crearCalificacionRoutes } from '../presentation/routes/calificacion.routes.js';
import { crearCatalogoRoutes } from '../presentation/routes/catalogo.routes.js';
import { crearAdminRoutes } from '../presentation/routes/admin.routes.js';
import { crearEstadisticasRoutes } from '../presentation/routes/estadisticas.routes.js';

export const crearApp = ({ controllers, tokenService, config }) => {
  const app = express();

  const origenesPermitidos = [
    'http://localhost:4200',
    config.frontendUrl // ej: https://taskconnect-web.vercel.app
  ].filter(Boolean);

  app.use(cors({ origin: origenesPermitidos, credentials: true }));
  app.use(express.json());
  app.use(cuerpoPorDefecto);

  app.get('/', (req, res) => {
    res.json({ mensaje: 'API de TaskConnect funcionando correctamente' });
  });

  const autenticar = crearAutenticar(tokenService);

  app.use('/api/usuarios', crearUsuarioRoutes(controllers.usuario, autenticar));
  app.use('/api/proyectos', crearProyectoRoutes(controllers.proyecto, autenticar));
  app.use('/api/propuestas', crearPropuestaRoutes(controllers.propuesta, autenticar));
  app.use('/api/contratos', crearContratoRoutes(controllers.contrato, autenticar));

  app.use('/api/pagos', crearPagoRoutes(controllers.pago, autenticar));
  app.use('/api/mensajes', crearMensajeRoutes(controllers.mensaje, autenticar));
  app.use('/api/calificaciones', crearCalificacionRoutes(controllers.calificacion, autenticar));
  app.use('/api', crearCatalogoRoutes(controllers.catalogo, autenticar)); // define /categorias, /profesiones, /metodos-pago, /configuracion

  app.use('/api/admin', crearAdminRoutes(controllers.admin, autenticar));
  app.use('/api/estadisticas', crearEstadisticasRoutes(controllers.estadisticas));

  app.use(manejarErrores);

  return app;
};
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verificarConexion } from './database/connection.js';
import { manejarErrores } from './middlewares/error.middleware.js';


import usuarioRoutes from './routes/usuario.routes.js';
import proyectoRoutes from './routes/proyecto.routes.js';
import propuestaRoutes from './routes/propuesta.routes.js';
import contratoRoutes from './routes/contrato.routes.js';

import pagoRoutes from './routes/pago.routes.js';
import mensajeRoutes from './routes/mensaje.routes.js';
import calificacionRoutes from './routes/calificacion.routes.js';
import catalogoRoutes from './routes/catalogo.routes.js';

import adminRoutes from './routes/admin.routes.js';


dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de TaskConnect funcionando correctamente' });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/propuestas', propuestaRoutes);
app.use('/api/contratos', contratoRoutes);

app.use('/api/pagos', pagoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api', catalogoRoutes); // ya define /categorias, /profesiones, /metodos-pago

app.use('/api/admin', adminRoutes);

app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor TaskConnect escuchando en el puerto ${PORT}`);
  await verificarConexion();
});
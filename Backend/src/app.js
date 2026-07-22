import express from 'express';
import dotenv from 'dotenv';
import { verificarConexion } from './database/connection.js';
import { manejarErrores } from './middlewares/error.middleware.js';

import usuarioRoutes from './routes/usuario.routes.js';
import proyectoRoutes from './routes/proyecto.routes.js';
import propuestaRoutes from './routes/propuesta.routes.js';
import contratoRoutes from './routes/contrato.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de TaskConnect funcionando correctamente' });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/propuestas', propuestaRoutes);
app.use('/api/contratos', contratoRoutes);

app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor TaskConnect escuchando en el puerto ${PORT}`);
  await verificarConexion();
});
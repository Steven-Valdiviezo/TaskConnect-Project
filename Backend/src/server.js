import { config } from './main/config.js';
import { AppDataSource } from './infrastructure/database/data-source.js';
import { crearContenedor } from './main/container.js';
import { crearApp } from './main/create-app.js';

const iniciar = async () => {
  // primero la conexión con TypeORM; si falla, el servidor no arranca
  await AppDataSource.initialize();
  console.log('Conectado a PostgreSQL (taskconnect) con TypeORM');

  const contenedor = crearContenedor({ dataSource: AppDataSource, config });
  const app = crearApp({ ...contenedor, config });

  app.listen(config.puerto, () => {
    console.log(`Servidor TaskConnect (hexagonal) escuchando en el puerto ${config.puerto}`);
  });
};

iniciar().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
});
import { AppDataSource } from '../src/infrastructure/database/data-source.js';

await AppDataSource.initialize();

// find({ take: 1 }) selecciona todas las columnas de la schema,
// así que falla si alguna columna no existe o tiene otro nombre en la BD
for (const meta of AppDataSource.entityMetadatas) {
  try {
    await AppDataSource.getRepository(meta.name).find({ take: 1 });
    console.log('OK   ', meta.tableName);
  } catch (error) {
    console.log('ERROR', meta.tableName, '->', error.message);
  }
}

await AppDataSource.destroy();
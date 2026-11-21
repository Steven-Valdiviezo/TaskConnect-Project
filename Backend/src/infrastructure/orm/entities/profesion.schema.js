import { EntitySchema } from 'typeorm';

export const ProfesionSchema = new EntitySchema({
  name: 'Profesion',
  tableName: 'profesion',
  columns: {
    id_profesion: { type: 'int', primary: true, generated: true },
    nombre: { type: 'varchar', length: 30 },
    descripcion: { type: 'varchar', length: 100 }
  }
});
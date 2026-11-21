import { EntitySchema } from 'typeorm';

export const CategoriaSchema = new EntitySchema({
  name: 'Categoria',
  tableName: 'categoria',
  columns: {
    id_categoria: { type: 'int', primary: true, generated: true },
    nombre_categoria: { type: 'varchar', length: 100 }
  }
});
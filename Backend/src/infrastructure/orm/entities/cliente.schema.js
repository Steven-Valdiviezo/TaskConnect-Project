import { EntitySchema } from 'typeorm';

export const ClienteSchema = new EntitySchema({
  name: 'Cliente',
  tableName: 'cliente',
  columns: {
    id_cliente: { type: 'int', primary: true, generated: true },
    id_usuario: { type: 'int' },
    empresa: { type: 'varchar', length: 30, nullable: true },
    direccion: { type: 'varchar', length: 100, nullable: true }
  },
  relations: {
    usuario: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'id_usuario' }
    }
  }
});
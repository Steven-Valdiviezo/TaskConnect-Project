import { EntitySchema } from 'typeorm';

export const MetodoPagoSchema = new EntitySchema({
  name: 'MetodoPago',
  tableName: 'metodo_pago',
  columns: {
    id_metodo_pago: { type: 'int', primary: true, generated: true },
    nombre: { type: 'varchar', length: 50 },
    descripcion: { type: 'varchar', length: 100 }
  }
});
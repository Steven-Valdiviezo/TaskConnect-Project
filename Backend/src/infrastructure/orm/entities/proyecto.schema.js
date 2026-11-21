import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer.js';

export const ProyectoSchema = new EntitySchema({
  name: 'Proyecto',
  tableName: 'proyecto',
  columns: {
    id_proyecto: { type: 'int', primary: true, generated: true },
    id_cliente: { type: 'int' },
    id_categoria: { type: 'int' },
    titulo: { type: 'varchar', length: 150 },
    descripcion: { type: 'text' },
    presupuesto: { type: 'numeric', transformer: numericTransformer },
    estado: { type: 'varchar', length: 20 },
    fecha_publicacion: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    fecha_entrega: { type: 'date', nullable: true }
  },
  relations: {
    cliente: { type: 'many-to-one', target: 'Cliente', joinColumn: { name: 'id_cliente' } },
    categoria: { type: 'many-to-one', target: 'Categoria', joinColumn: { name: 'id_categoria' } }
  }
});
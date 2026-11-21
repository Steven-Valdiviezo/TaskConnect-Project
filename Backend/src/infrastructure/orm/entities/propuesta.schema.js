import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer.js';

export const PropuestaSchema = new EntitySchema({
  name: 'Propuesta',
  tableName: 'propuesta',
  columns: {
    id_propuesta: { type: 'int', primary: true, generated: true },
    id_proyecto: { type: 'int' },
    id_freelancer: { type: 'int' },
    mensaje: { type: 'text' },
    monto_propuesto: { type: 'numeric', transformer: numericTransformer },
    fecha_propuesta: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    estado: { type: 'varchar', length: 20, default: 'pendiente' }
  },
  relations: {
    proyecto: { type: 'many-to-one', target: 'Proyecto', joinColumn: { name: 'id_proyecto' } },
    freelancer: { type: 'many-to-one', target: 'Freelancer', joinColumn: { name: 'id_freelancer' } }
  }
});
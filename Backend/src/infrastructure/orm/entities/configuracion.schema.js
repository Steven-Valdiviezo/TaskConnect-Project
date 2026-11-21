import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer.js';

export const ConfiguracionSchema = new EntitySchema({
  name: 'Configuracion',
  tableName: 'configuracion',
  columns: {
    id_configuracion: { type: 'int', primary: true, generated: true },
    clave: { type: 'varchar', length: 50 },
    valor: { type: 'numeric', transformer: numericTransformer },
    descripcion: { type: 'varchar', length: 150 },
    fecha_actualizacion: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }
  }
});
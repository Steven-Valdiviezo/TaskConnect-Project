import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer.js';

export const PagoSchema = new EntitySchema({
  name: 'Pago',
  tableName: 'pago',
  columns: {
    id_pago: { type: 'int', primary: true, generated: true },
    id_contrato: { type: 'int' },
    id_metodo_pago: { type: 'int' },
    monto: { type: 'numeric', transformer: numericTransformer },
    // comision, tarifa_iva e iva los calcula el trigger BEFORE INSERT, no se envían desde la app
    comision: { type: 'numeric', default: 0, transformer: numericTransformer },
    tarifa_iva: { type: 'numeric', default: 0, transformer: numericTransformer },
    iva: { type: 'numeric', default: 0, transformer: numericTransformer },
    fecha_solicitud: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    fecha_pago: { type: 'timestamp', nullable: true },
    estado: { type: 'varchar', length: 20, default: 'pendiente' }
  },
  relations: {
    contrato: { type: 'many-to-one', target: 'Contrato', joinColumn: { name: 'id_contrato' } },
    metodoPago: { type: 'many-to-one', target: 'MetodoPago', joinColumn: { name: 'id_metodo_pago' } }
  }
});
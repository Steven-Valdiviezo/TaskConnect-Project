import { EntitySchema } from 'typeorm';

// Sin relaciones: las columnas se llaman "remitente" y "destinatario" y chocarían con el nombre de la relación
export const MensajeSchema = new EntitySchema({
  name: 'Mensaje',
  tableName: 'mensaje',
  columns: {
    id_mensaje: { type: 'int', primary: true, generated: true },
    remitente: { type: 'int' },
    destinatario: { type: 'int' },
    contenido: { type: 'text' },
    fecha_envio: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    leido: { type: 'boolean', default: false }
  }
});
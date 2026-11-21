import { EntitySchema } from 'typeorm';

// Solo se lee desde la app; los registros los inserta el trigger fn_auditoria
export const AuditoriaSchema = new EntitySchema({
  name: 'Auditoria',
  tableName: 'auditoria',
  columns: {
    id_auditoria: { type: 'int', primary: true, generated: true },
    tabla: { type: 'varchar', length: 50 },
    operacion: { type: 'varchar', length: 10 },
    id_registro: { type: 'int', nullable: true },
    datos_anteriores: { type: 'jsonb', nullable: true },
    datos_nuevos: { type: 'jsonb', nullable: true },
    fecha: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    usuario_db: { type: 'varchar', length: 100, nullable: true }
  }
});
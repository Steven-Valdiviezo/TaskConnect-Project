import { EntitySchema } from 'typeorm';

export const Token2faSchema = new EntitySchema({
  name: 'Token2fa',
  tableName: 'token_2fa',
  columns: {
    id_token: { type: 'int', primary: true, generated: true },
    id_usuario: { type: 'int' },
    token_hash: { type: 'varchar', length: 64 },
    fecha_expiracion: { type: 'timestamp' },
    usado: { type: 'boolean', default: false },
    fecha_creacion: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }
  }
});
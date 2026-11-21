import { EntitySchema } from 'typeorm';

export const UsuarioSchema = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuario',
  columns: {
    id_usuario: { type: 'int', primary: true, generated: true },
    nombre: { type: 'varchar', length: 100 },
    correo: { type: 'varchar', length: 100 },
    contrasena: { type: 'varchar', length: 255 },
    telefono: { type: 'varchar', length: 20, nullable: true },
    fecha_registro: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    rol: { type: 'varchar', length: 20 },
    estado: { type: 'varchar', length: 20, default: 'activo' }
  }
});
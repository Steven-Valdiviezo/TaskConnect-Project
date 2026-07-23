import { pool } from '../database/connection.js';

export const listarUsuariosRepository = async ({ rol, estado }) => {
  const condiciones = [];
  const valores = [];

  if (rol) {
    valores.push(rol);
    condiciones.push(`rol = $${valores.length}`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`estado = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const resultado = await pool.query(
    `SELECT id_usuario, nombre, correo, telefono, rol, estado, fecha_registro
     FROM usuario
     ${where}
     ORDER BY fecha_registro DESC`,
    valores
  );
  return resultado.rows;
};

export const desactivarUsuarioRepository = async (id_usuario) => {
  const resultado = await pool.query(
    `UPDATE usuario SET estado = 'inactivo'
     WHERE id_usuario = $1 AND estado = 'activo'
     RETURNING id_usuario, nombre, correo, rol, estado`,
    [id_usuario]
  );
  return resultado.rows[0];
};

export const reactivarUsuarioRepository = async (id_usuario) => {
  const resultado = await pool.query(
    `UPDATE usuario SET estado = 'activo'
     WHERE id_usuario = $1 AND estado = 'inactivo'
     RETURNING id_usuario, nombre, correo, rol, estado`,
    [id_usuario]
  );
  return resultado.rows[0];
};

export const listarAuditoriaRepository = async ({ tabla, limite }) => {
  const condiciones = [];
  const valores = [];

  if (tabla) {
    valores.push(tabla);
    condiciones.push(`tabla = $${valores.length}`);
  }

  valores.push(limite || 100);
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const resultado = await pool.query(
    `SELECT * FROM auditoria
     ${where}
     ORDER BY fecha DESC
     LIMIT $${valores.length}`,
    valores
  );
  return resultado.rows;
};
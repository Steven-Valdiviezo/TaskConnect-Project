import { pool } from '../database/connection.js';

export const crearMensajeRepository = async ({ remitente, destinatario, contenido }) => {
  const resultado = await pool.query(
    `INSERT INTO mensaje (remitente, destinatario, contenido)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [remitente, destinatario, contenido]
  );
  return resultado.rows[0];
};

export const obtenerConversacionRepository = async (usuarioA, usuarioB) => {
  const resultado = await pool.query(
    `SELECT * FROM mensaje
     WHERE (remitente = $1 AND destinatario = $2)
        OR (remitente = $2 AND destinatario = $1)
     ORDER BY fecha_envio ASC`,
    [usuarioA, usuarioB]
  );
  return resultado.rows;
};

export const marcarMensajeLeidoRepository = async (id_mensaje, destinatario) => {
  const resultado = await pool.query(
    `UPDATE mensaje SET leido = TRUE
     WHERE id_mensaje = $1 AND destinatario = $2
     RETURNING *`,
    [id_mensaje, destinatario]
  );
  return resultado.rows[0];
};

export const contarMensajesNoLeidosRepository = async (id_usuario) => {
  const resultado = await pool.query(
    `SELECT COUNT(*)::int AS total FROM mensaje WHERE destinatario = $1 AND leido = FALSE`,
    [id_usuario]
  );
  return resultado.rows[0].total;
};
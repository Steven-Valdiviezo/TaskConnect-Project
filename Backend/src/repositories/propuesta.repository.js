import { pool } from '../database/connection.js';

export const listarPropuestasPorProyectoRepository = async (id_proyecto) => {
  const resultado = await pool.query(
    `SELECT pr.*, u.nombre AS nombre_freelancer
     FROM propuesta pr
     JOIN freelancer f ON f.id_freelancer = pr.id_freelancer
     JOIN usuario u ON u.id_usuario = f.id_usuario
     WHERE pr.id_proyecto = $1
     ORDER BY pr.fecha_propuesta DESC`,
    [id_proyecto]
  );
  return resultado.rows;
};

export const crearPropuestaRepository = async ({ id_proyecto, id_freelancer, mensaje, monto_propuesto }) => {
  const resultado = await pool.query(
    `INSERT INTO propuesta (id_proyecto, id_freelancer, mensaje, monto_propuesto)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id_proyecto, id_freelancer, mensaje, monto_propuesto]
  );
  return resultado.rows[0];
};

export const obtenerPropuestaPorIdRepository = async (id) => {
  const resultado = await pool.query('SELECT * FROM propuesta WHERE id_propuesta = $1', [id]);
  return resultado.rows[0];
};

export const eliminarPropuestaRepository = async (id_propuesta, id_freelancer) => {
  const resultado = await pool.query(
    `DELETE FROM propuesta
     WHERE id_propuesta = $1 AND id_freelancer = $2
     RETURNING *`,
    [id_propuesta, id_freelancer]
  );
  return resultado.rows[0];
};
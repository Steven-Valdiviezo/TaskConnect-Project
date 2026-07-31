import { pool } from '../database/connection.js';

export const listarPropuestasPorProyectoRepository = async (id_proyecto) => {
  const resultado = await pool.query(
    `SELECT pr.*, u.nombre AS nombre_freelancer, u.estado AS estado_freelancer
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
// Agregado para mostrar las propuestas
export const listarPropuestasPorClienteRepository = async (id_cliente) => {
  const resultado = await pool.query(
    `SELECT pr.*, u.nombre AS nombre_freelancer, u.estado AS estado_freelancer, p.titulo AS titulo_proyecto
     FROM propuesta pr
     JOIN proyecto p ON p.id_proyecto = pr.id_proyecto
     JOIN freelancer f ON f.id_freelancer = pr.id_freelancer
     JOIN usuario u ON u.id_usuario = f.id_usuario
     WHERE p.id_cliente = $1
     ORDER BY pr.fecha_propuesta DESC`,
    [id_cliente]
  );
  return resultado.rows;
};

export const listarPropuestasPorFreelancerRepository = async (id_freelancer) => {
  const resultado = await pool.query(
    `SELECT pr.*, p.titulo AS titulo_proyecto, p.presupuesto AS presupuesto_proyecto
     FROM propuesta pr
     JOIN proyecto p ON p.id_proyecto = pr.id_proyecto
     WHERE pr.id_freelancer = $1
     ORDER BY pr.fecha_propuesta DESC`,
    [id_freelancer]
  );
  return resultado.rows;
};

// Rechazar una propuesta (actualizar estado a 'retirada')
export const rechazarPropuestaRepository = async (id_propuesta, id_cliente) => {
  const resultado = await pool.query(
    `UPDATE propuesta
     SET estado = 'rechazada'
     FROM proyecto
     WHERE propuesta.id_propuesta = $1
       AND propuesta.id_proyecto = proyecto.id_proyecto
       AND proyecto.id_cliente = $2
       AND propuesta.estado = 'pendiente'
     RETURNING propuesta.*`,
    [id_propuesta, id_cliente]
  );
  return resultado.rows[0];
};
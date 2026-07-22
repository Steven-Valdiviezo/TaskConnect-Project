import { pool } from '../database/connection.js';

export const obtenerPropuestaConProyectoRepository = async (id_propuesta) => {
  const resultado = await pool.query(
    `SELECT pr.id_propuesta, pr.id_proyecto, pr.id_freelancer, pr.estado,
            py.id_cliente
     FROM propuesta pr
     JOIN proyecto py ON py.id_proyecto = pr.id_proyecto
     WHERE pr.id_propuesta = $1`,
    [id_propuesta]
  );
  return resultado.rows[0];
};

export const crearContratoRepository = async ({ id_proyecto, id_freelancer, fecha_inicio }) => {
  const resultado = await pool.query(
    `INSERT INTO contrato (id_proyecto, id_freelancer, fecha_inicio)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id_proyecto, id_freelancer, fecha_inicio]
  );
  return resultado.rows[0];
};

export const listarContratosPorUsuarioRepository = async (id_usuario, rol) => {
  if (rol === 'cliente') {
    const r = await pool.query(
      `SELECT c.* FROM contrato c
       JOIN proyecto p ON p.id_proyecto = c.id_proyecto
       JOIN cliente cl ON cl.id_cliente = p.id_cliente
       WHERE cl.id_usuario = $1
       ORDER BY c.fecha_inicio DESC`,
      [id_usuario]
    );
    return r.rows;
  }

  const r = await pool.query(
    `SELECT c.* FROM contrato c
     JOIN freelancer f ON f.id_freelancer = c.id_freelancer
     WHERE f.id_usuario = $1
     ORDER BY c.fecha_inicio DESC`,
    [id_usuario]
  );
  return r.rows;
};

export const actualizarEstadoContratoRepository = async (id_contrato, estado, fecha_fin) => {
  const resultado = await pool.query(
    `UPDATE contrato SET estado = $1, fecha_fin = COALESCE($2, fecha_fin)
     WHERE id_contrato = $3
     RETURNING *`,
    [estado, fecha_fin, id_contrato]
  );
  return resultado.rows[0];
};
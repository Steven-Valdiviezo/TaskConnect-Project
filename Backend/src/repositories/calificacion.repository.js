import { pool } from '../database/connection.js';

export const obtenerContratoParaCalificarRepository = async (id_contrato) => {
  const resultado = await pool.query(
    `SELECT c.id_contrato, c.estado AS estado_contrato,
            cl.id_usuario AS id_usuario_cliente,
            fl.id_usuario AS id_usuario_freelancer
     FROM contrato c
     JOIN proyecto p ON p.id_proyecto = c.id_proyecto
     JOIN cliente cl ON cl.id_cliente = p.id_cliente
     JOIN freelancer fl ON fl.id_freelancer = c.id_freelancer
     WHERE c.id_contrato = $1`,
    [id_contrato]
  );
  return resultado.rows[0];
};

export const crearCalificacionRepository = async ({ id_contrato, id_calificador, id_calificado, puntuacion, comentario }) => {
  const resultado = await pool.query(
    `INSERT INTO calificacion (id_contrato, id_calificador, id_calificado, puntuacion, comentario)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id_contrato, id_calificador, id_calificado, puntuacion, comentario]
  );
  return resultado.rows[0];
};

export const listarCalificacionesDeUsuarioRepository = async (id_usuario_calificado) => {
  const resultado = await pool.query(
    `SELECT cal.*, u.nombre AS nombre_calificador
     FROM calificacion cal
     JOIN usuario u ON u.id_usuario = cal.id_calificador
     WHERE cal.id_calificado = $1
     ORDER BY cal.fecha DESC`,
    [id_usuario_calificado]
  );
  return resultado.rows;
};

export const obtenerReputacionFreelancerRepository = async (id_freelancer) => {
  const resultado = await pool.query('SELECT fn_calcular_reputacion($1) AS reputacion', [id_freelancer]);
  return resultado.rows[0].reputacion;
};
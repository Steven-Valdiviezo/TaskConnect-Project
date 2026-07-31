import { pool } from '../database/connection.js';

export const obtenerPropuestaConProyectoRepository = async (id_propuesta) => {
  const resultado = await pool.query(
    `SELECT pr.id_propuesta, pr.id_proyecto, pr.id_freelancer, pr.estado,
            py.id_cliente,
            u.nombre AS nombre_freelancer, u.estado AS estado_freelancer
     FROM propuesta pr
     JOIN proyecto py ON py.id_proyecto = pr.id_proyecto
     JOIN freelancer f ON f.id_freelancer = pr.id_freelancer
     JOIN usuario u ON u.id_usuario = f.id_usuario
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

// Actualizado para mostrar "con quién" es cada contrato
export const listarContratosPorUsuarioRepository = async (id_usuario, rol) => {
  if (rol === 'cliente') {
    const r = await pool.query(
      `SELECT c.*, p.titulo AS titulo_proyecto, p.presupuesto,
              fu.id_usuario AS id_usuario_contraparte, fu.nombre AS nombre_contraparte, fu.estado AS estado_contraparte,
              pr.monto_propuesto
      FROM contrato c
      JOIN proyecto p ON p.id_proyecto = c.id_proyecto
      JOIN cliente cl ON cl.id_cliente = p.id_cliente
      JOIN freelancer f ON f.id_freelancer = c.id_freelancer
      JOIN usuario fu ON fu.id_usuario = f.id_usuario
      LEFT JOIN propuesta pr ON pr.id_proyecto = c.id_proyecto AND pr.id_freelancer = c.id_freelancer AND pr.estado = 'aceptada'
      WHERE cl.id_usuario = $1
      ORDER BY c.fecha_inicio DESC`,
      [id_usuario]
    );
    return r.rows;
  }

  // Si el rol es 'freelancer'
  const r = await pool.query(
    `SELECT c.*, p.titulo AS titulo_proyecto, p.presupuesto,
            cu.id_usuario AS id_usuario_contraparte, cu.nombre AS nombre_contraparte,
            pr.monto_propuesto
    FROM contrato c
    JOIN freelancer f ON f.id_freelancer = c.id_freelancer
    JOIN proyecto p ON p.id_proyecto = c.id_proyecto
    JOIN cliente cl ON cl.id_cliente = p.id_cliente
    JOIN usuario cu ON cu.id_usuario = cl.id_usuario
    LEFT JOIN propuesta pr ON pr.id_proyecto = c.id_proyecto AND pr.id_freelancer = c.id_freelancer AND pr.estado = 'aceptada'
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

export const obtenerContratoConFreelancerRepository = async (id_contrato) => {
  const resultado = await pool.query(
    `SELECT c.id_contrato, c.estado AS estado_contrato,
            u.nombre AS nombre_freelancer, u.estado AS estado_freelancer
     FROM contrato c
     JOIN freelancer f ON f.id_freelancer = c.id_freelancer
     JOIN usuario u ON u.id_usuario = f.id_usuario
     WHERE c.id_contrato = $1`,
    [id_contrato]
  );
  return resultado.rows[0];
};
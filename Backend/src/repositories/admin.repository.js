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

// Consultas adicionales Actualizadas para que el admin tenga acceso a información detallada de la plataforma
export const contarUsuariosDetalladoRepository = async () => {
  const r = await pool.query(`SELECT rol, estado, COUNT(*)::INT AS total FROM usuario GROUP BY rol, estado`);
  return r.rows;
};

export const contarProyectosDetalladoRepository = async () => {
  const r = await pool.query(
    `SELECT
       COUNT(*)::INT AS total,
       COUNT(*) FILTER (WHERE estado = 'abierto')::INT AS total_abiertos,
       COUNT(*) FILTER (WHERE estado = 'ejecucion')::INT AS total_ejecucion,
       COUNT(*) FILTER (WHERE estado = 'finalizado')::INT AS total_finalizados,
       COUNT(*) FILTER (WHERE estado = 'cancelado')::INT AS total_cancelados
     FROM proyecto`
  );
  return r.rows[0];
};

export const proyectosPorCategoriaRepository = async () => {
  const r = await pool.query(
    `SELECT c.id_categoria, c.nombre_categoria, COUNT(p.id_proyecto)::INT AS total
     FROM categoria c LEFT JOIN proyecto p ON p.id_categoria = c.id_categoria
     GROUP BY c.id_categoria, c.nombre_categoria
     ORDER BY total DESC`
  );
  return r.rows;
};

export const freelancersPorProfesionRepository = async () => {
  const r = await pool.query(
    `SELECT p.id_profesion, p.nombre, COUNT(f.id_freelancer)::INT AS total
     FROM profesion p LEFT JOIN freelancer f ON f.id_profesion = p.id_profesion
     GROUP BY p.id_profesion, p.nombre
     ORDER BY total DESC`
  );
  return r.rows;
};

export const contarPropuestasRepository = async () => {
  const r = await pool.query(
    `SELECT COUNT(*)::INT AS total, COUNT(*) FILTER (WHERE estado = 'aceptada')::INT AS total_aceptadas FROM propuesta`
  );
  return r.rows[0];
};

export const contarContratosRepository = async () => {
  const r = await pool.query(
    `SELECT COUNT(*)::INT AS total, COUNT(*) FILTER (WHERE estado = 'activo')::INT AS total_activos,
            COUNT(*) FILTER (WHERE estado = 'completado')::INT AS total_completados
     FROM contrato`
  );
  return r.rows[0];
};

export const sumarPagosRepository = async () => {
  const r = await pool.query(
    `SELECT COALESCE(SUM(monto),0)::NUMERIC(12,2) AS total_pagado, COALESCE(SUM(comision),0)::NUMERIC(12,2) AS total_comision,
            COALESCE(SUM(iva),0)::NUMERIC(12,2) AS total_iva
     FROM pago WHERE estado = 'pagado'`
  );
  return r.rows[0];
};
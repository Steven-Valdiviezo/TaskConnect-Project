import { pool } from '../database/connection.js';

export const listarProyectosRepository = async ({ id_categoria, presupuesto_min, presupuesto_max }) => {
  const condiciones = [];
  const valores = [];
  if (id_categoria) { valores.push(id_categoria); condiciones.push(`p.id_categoria = $${valores.length}`); }
  if (presupuesto_min) { valores.push(presupuesto_min); condiciones.push(`p.presupuesto >= $${valores.length}`); }
  if (presupuesto_max) { valores.push(presupuesto_max); condiciones.push(`p.presupuesto <= $${valores.length}`); }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const resultado = await pool.query(
    `SELECT p.*, c.nombre_categoria, u.nombre AS nombre_cliente
     FROM proyecto p
     JOIN categoria c ON c.id_categoria = p.id_categoria
     JOIN cliente cl ON cl.id_cliente = p.id_cliente
     JOIN usuario u ON u.id_usuario = cl.id_usuario
     ${where}
     ORDER BY p.fecha_publicacion DESC`,
    valores
  );
  return resultado.rows;
};

export const obtenerProyectoPorIdRepository = async (id) => {
  const resultado = await pool.query(
    `SELECT p.*, c.nombre_categoria, u.nombre AS nombre_cliente
     FROM proyecto p
     JOIN categoria c ON c.id_categoria = p.id_categoria
     JOIN cliente cl ON cl.id_cliente = p.id_cliente
     JOIN usuario u ON u.id_usuario = cl.id_usuario
     WHERE p.id_proyecto = $1`,
    [id]
  );
  return resultado.rows[0];
};

export const crearProyectoRepository = async ({ id_cliente, id_categoria, titulo, descripcion, presupuesto, fecha_entrega }) => {
  const resultado = await pool.query(
    `INSERT INTO proyecto (id_cliente, id_categoria, titulo, descripcion, presupuesto, fecha_entrega, estado)
     VALUES ($1, $2, $3, $4, $5, $6, 'abierto')
     RETURNING *`,
    [id_cliente, id_categoria, titulo, descripcion, presupuesto, fecha_entrega ?? null]
  );
  return resultado.rows[0];
};

export const actualizarProyectoRepository = async (id, { titulo, descripcion, presupuesto, id_categoria, fecha_entrega }) => {
  const resultado = await pool.query(
    `UPDATE proyecto SET titulo = $1, descripcion = $2, presupuesto = $3, id_categoria = $4, fecha_entrega = $5
     WHERE id_proyecto = $6 RETURNING *`,
    [titulo, descripcion, presupuesto, id_categoria, fecha_entrega ?? null, id]
  );
  return resultado.rows[0];
};

export const obtenerDueñoProyectoRepository = async (id_proyecto) => {
  const resultado = await pool.query(
    'SELECT id_cliente FROM proyecto WHERE id_proyecto = $1',
    [id_proyecto]
  );
  return resultado.rows[0];
};

// El orden de los 3 UPDATE importa: primero proyecto, después contrato.
// Si se lo hace  al revés, el trigger trg_contrato_reabrir_proyecto
// intentaría reabrir el proyecto a 'abierto' antes de
// que termines de cancelarlo, y quedaría en un estado inconsistente.
export const cancelarProyectoRepository = async (id_proyecto) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const proyectoResultado = await client.query(
      `UPDATE proyecto SET estado = 'cancelado'
       WHERE id_proyecto = $1 AND estado IN ('abierto', 'ejecucion')
       RETURNING *`,
      [id_proyecto]
    );

    if (proyectoResultado.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `UPDATE contrato SET estado = 'cancelado'
       WHERE id_proyecto = $1 AND estado = 'activo'`,
      [id_proyecto]
    );

    await client.query(
      `UPDATE propuesta SET estado = 'rechazada'
       WHERE id_proyecto = $1 AND estado = 'pendiente'`,
      [id_proyecto]
    );

    await client.query('COMMIT');
    return proyectoResultado.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listarProyectosPorClienteRepository = async (id_cliente) => {
  const resultado = await pool.query(
    `SELECT p.*, c.nombre_categoria,
            (SELECT COUNT(*)::INT FROM propuesta pr WHERE pr.id_proyecto = p.id_proyecto) AS total_propuestas
     FROM proyecto p
     JOIN categoria c ON c.id_categoria = p.id_categoria
     WHERE p.id_cliente = $1
     ORDER BY p.fecha_publicacion DESC`,
    [id_cliente]
  );
  return resultado.rows;
};
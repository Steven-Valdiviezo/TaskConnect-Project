import { pool } from '../database/connection.js';

export const listarProyectosRepository = async ({ id_categoria, presupuesto_min, presupuesto_max }) => {
  const condiciones = [];
  const valores = [];

  if (id_categoria) {
    valores.push(id_categoria);
    condiciones.push(`p.id_categoria = $${valores.length}`);
  }
  if (presupuesto_min) {
    valores.push(presupuesto_min);
    condiciones.push(`p.presupuesto >= $${valores.length}`);
  }
  if (presupuesto_max) {
    valores.push(presupuesto_max);
    condiciones.push(`p.presupuesto <= $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const resultado = await pool.query(
    `SELECT p.*, c.nombre_categoria
     FROM proyecto p
     JOIN categoria c ON c.id_categoria = p.id_categoria
     ${where}
     ORDER BY p.fecha_publicacion DESC`,
    valores
  );

  return resultado.rows;
};

export const obtenerProyectoPorIdRepository = async (id) => {
  const resultado = await pool.query(
    `SELECT p.*, c.nombre_categoria
     FROM proyecto p
     JOIN categoria c ON c.id_categoria = p.id_categoria
     WHERE p.id_proyecto = $1`,
    [id]
  );
  return resultado.rows[0];
};

export const crearProyectoRepository = async ({ id_cliente, id_categoria, titulo, descripcion, presupuesto }) => {
  const resultado = await pool.query(
    `INSERT INTO proyecto (id_cliente, id_categoria, titulo, descripcion, presupuesto, estado)
     VALUES ($1, $2, $3, $4, $5, 'abierto')
     RETURNING *`,
    [id_cliente, id_categoria, titulo, descripcion, presupuesto]
  );
  return resultado.rows[0];
};

export const actualizarProyectoRepository = async (id, { titulo, descripcion, presupuesto, id_categoria }) => {
  const resultado = await pool.query(
    `UPDATE proyecto
     SET titulo = $1, descripcion = $2, presupuesto = $3, id_categoria = $4
     WHERE id_proyecto = $5
     RETURNING *`,
    [titulo, descripcion, presupuesto, id_categoria, id]
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
import { pool } from '../database/connection.js';
// Estos tres son simples y muy parecidos entre sí, así que los agrupé 
// en un solo módulo para no repetir cuatro archivos casi idénticos tres veces.

// =========== Categoría ===========
export const listarCategoriasRepository = async () => {
  const r = await pool.query('SELECT * FROM categoria ORDER BY nombre_categoria ASC');
  return r.rows;
};

export const obtenerCategoriaPorIdRepository = async (id_categoria) => {
  const r = await pool.query('SELECT * FROM categoria WHERE id_categoria = $1', [id_categoria]);
  return r.rows[0];
};

export const obtenerCategoriaPorNombreRepository = async (nombre_categoria) => {
  const r = await pool.query(
    'SELECT * FROM categoria WHERE LOWER(nombre_categoria) = LOWER($1)',
    [nombre_categoria]
  );
  return r.rows[0];
};

export const crearCategoriaRepository = async (nombre_categoria) => {
  const r = await pool.query(
    'INSERT INTO categoria (nombre_categoria) VALUES ($1) RETURNING *',
    [nombre_categoria]
  );
  return r.rows[0];
};

export const actualizarCategoriaRepository = async (id_categoria, nombre_categoria) => {
  const r = await pool.query(
    'UPDATE categoria SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING *',
    [nombre_categoria, id_categoria]
  );
  return r.rows[0];
};

export const contarProyectosPorCategoriaRepository = async (id_categoria) => {
  const r = await pool.query(
    'SELECT COUNT(*)::INT AS total FROM proyecto WHERE id_categoria = $1',
    [id_categoria]
  );
  return r.rows[0].total;
};

export const eliminarCategoriaRepository = async (id_categoria) => {
  const r = await pool.query(
    'DELETE FROM categoria WHERE id_categoria = $1 RETURNING *',
    [id_categoria]
  );
  return r.rows[0];
};

// =========== Profesión ===========
export const listarProfesionesRepository = async () => {
  const r = await pool.query('SELECT * FROM profesion ORDER BY nombre ASC');
  return r.rows;
};

export const obtenerProfesionPorIdRepository = async (id_profesion) => {
  const r = await pool.query('SELECT * FROM profesion WHERE id_profesion = $1', [id_profesion]);
  return r.rows[0];
};

export const obtenerProfesionPorNombreRepository = async (nombre) => {
  const r = await pool.query(
    'SELECT * FROM profesion WHERE LOWER(nombre) = LOWER($1)',
    [nombre]
  );
  return r.rows[0];
};

export const crearProfesionRepository = async ({ nombre, descripcion }) => {
  const r = await pool.query(
    'INSERT INTO profesion (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion]
  );
  return r.rows[0];
};

export const actualizarProfesionRepository = async (id_profesion, { nombre, descripcion }) => {
  const r = await pool.query(
    'UPDATE profesion SET nombre = $1, descripcion = $2 WHERE id_profesion = $3 RETURNING *',
    [nombre, descripcion, id_profesion]
  );
  return r.rows[0];
};

export const contarFreelancersPorProfesionRepository = async (id_profesion) => {
  const r = await pool.query(
    'SELECT COUNT(*)::INT AS total FROM freelancer WHERE id_profesion = $1',
    [id_profesion]
  );
  return r.rows[0].total;
};

export const eliminarProfesionRepository = async (id_profesion) => {
  const r = await pool.query(
    'DELETE FROM profesion WHERE id_profesion = $1 RETURNING *',
    [id_profesion]
  );
  return r.rows[0];
};

// =========== Método de pago ===========
export const listarMetodosPagoRepository = async () => {
  const r = await pool.query('SELECT * FROM metodo_pago ORDER BY nombre ASC');
  return r.rows;
};

export const obtenerMetodoPagoPorIdRepository = async (id_metodo_pago) => {
  const r = await pool.query('SELECT * FROM metodo_pago WHERE id_metodo_pago = $1', [id_metodo_pago]);
  return r.rows[0];
};

export const obtenerMetodoPagoPorNombreRepository = async (nombre) => {
  const r = await pool.query(
    'SELECT * FROM metodo_pago WHERE LOWER(nombre) = LOWER($1)',
    [nombre]
  );
  return r.rows[0];
};

export const crearMetodoPagoRepository = async ({ nombre, descripcion }) => {
  const r = await pool.query(
    'INSERT INTO metodo_pago (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion]
  );
  return r.rows[0];
};

export const actualizarMetodoPagoRepository = async (id_metodo_pago, { nombre, descripcion }) => {
  const r = await pool.query(
    'UPDATE metodo_pago SET nombre = $1, descripcion = $2 WHERE id_metodo_pago = $3 RETURNING *',
    [nombre, descripcion, id_metodo_pago]
  );
  return r.rows[0];
};

export const contarPagosPorMetodoRepository = async (id_metodo_pago) => {
  const r = await pool.query(
    'SELECT COUNT(*)::INT AS total FROM pago WHERE id_metodo_pago = $1',
    [id_metodo_pago]
  );
  return r.rows[0].total;
};

export const eliminarMetodoPagoRepository = async (id_metodo_pago) => {
  const r = await pool.query(
    'DELETE FROM metodo_pago WHERE id_metodo_pago = $1 RETURNING *',
    [id_metodo_pago]
  );
  return r.rows[0];
};
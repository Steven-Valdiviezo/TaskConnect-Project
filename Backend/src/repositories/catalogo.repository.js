import { pool } from '../database/connection.js';
// Estos tres son simples y muy parecidos entre sí, así que los agrupé 
// en un solo módulo para no repetir cuatro archivos casi idénticos tres veces.
// ---- Categoría ----
export const listarCategoriasRepository = async () => {
  const r = await pool.query('SELECT * FROM categoria ORDER BY nombre_categoria ASC');
  return r.rows;
};

export const crearCategoriaRepository = async (nombre_categoria) => {
  const r = await pool.query(
    'INSERT INTO categoria (nombre_categoria) VALUES ($1) RETURNING *',
    [nombre_categoria]
  );
  return r.rows[0];
};

// ---- Profesión ----
export const listarProfesionesRepository = async () => {
  const r = await pool.query('SELECT * FROM profesion ORDER BY nombre ASC');
  return r.rows;
};

export const crearProfesionRepository = async ({ nombre, descripcion }) => {
  const r = await pool.query(
    'INSERT INTO profesion (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion]
  );
  return r.rows[0];
};

// ---- Método de pago ----
export const listarMetodosPagoRepository = async () => {
  const r = await pool.query('SELECT * FROM metodo_pago ORDER BY nombre ASC');
  return r.rows;
};

export const crearMetodoPagoRepository = async ({ nombre, descripcion }) => {
  const r = await pool.query(
    'INSERT INTO metodo_pago (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion]
  );
  return r.rows[0];
};
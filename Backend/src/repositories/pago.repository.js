import { pool } from '../database/connection.js';

export const obtenerContratoConClienteRepository = async (id_contrato) => {
  const resultado = await pool.query(
    `SELECT c.id_contrato, c.estado AS estado_contrato, p.id_cliente, p.presupuesto
     FROM contrato c
     JOIN proyecto p ON p.id_proyecto = c.id_proyecto
     WHERE c.id_contrato = $1`,
    [id_contrato]
  );
  return resultado.rows[0];
};

export const crearPagoRepository = async ({ id_contrato, id_metodo_pago, monto }) => {
  const resultado = await pool.query(
    `INSERT INTO pago (id_contrato, id_metodo_pago, monto)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id_contrato, id_metodo_pago, monto]
  );
  return resultado.rows[0];
};

export const obtenerPagoPorIdRepository = async (id_pago) => {
  const resultado = await pool.query('SELECT * FROM pago WHERE id_pago = $1', [id_pago]);
  return resultado.rows[0];
};

export const obtenerPagoPorContratoRepository = async (id_contrato) => {
  const resultado = await pool.query('SELECT * FROM pago WHERE id_contrato = $1', [id_contrato]);
  return resultado.rows[0];
};

export const marcarPagoComoPagadoRepository = async (id_pago) => {
  const resultado = await pool.query(
    `UPDATE pago SET estado = 'pagado', fecha_pago = CURRENT_TIMESTAMP
     WHERE id_pago = $1
     RETURNING *`,
    [id_pago]
  );
  return resultado.rows[0];
};
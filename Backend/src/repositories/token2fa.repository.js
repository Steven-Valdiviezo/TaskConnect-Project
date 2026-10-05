import { pool } from '../database/connection.js';

export const crearToken2FARepository = async ({ id_usuario, token_hash, minutos }) => {
    // Invalida links anteriores pendientes del mismo usuario
    await pool.query(
        'UPDATE token_2fa SET usado = TRUE WHERE id_usuario = $1 AND usado = FALSE',
        [id_usuario]
    );

    await pool.query(
        `INSERT INTO token_2fa (id_usuario, token_hash, fecha_expiracion)
         VALUES ($1, $2, CURRENT_TIMESTAMP + make_interval(mins => $3))`,
        [id_usuario, token_hash, minutos]
    );
};

// Consumo atómico: valida y marca como usado en una sola sentencia
export const consumirToken2FARepository = async (token_hash) => {
    const r = await pool.query(
        `UPDATE token_2fa SET usado = TRUE
         WHERE token_hash = $1 AND usado = FALSE AND fecha_expiracion > CURRENT_TIMESTAMP
         RETURNING id_usuario`,
        [token_hash]
    );
    return r.rows[0];
};
// Apartado especializado para estadisticas publicas presentadas en la pagina principal
import { pool } from '../database/connection.js';

export const contarUsuariosPorRolRepository = async () => {
    const resultado = await pool.query(
        `SELECT rol, COUNT(*)::int AS total
         FROM usuario
         WHERE estado = 'activo'
         GROUP BY rol`
    );
    return resultado.rows; // [{ rol: 'cliente', total: N }, { rol: 'freelancer', total: N }, ...]
};

export const contarProyectosRepository = async () => {
    const resultado = await pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE estado = 'abierto')::int AS total_abiertos,
           COUNT(*) FILTER (WHERE estado = 'finalizado')::int AS total_finalizados
         FROM proyecto`
    );
    return resultado.rows[0];
};

export const contarCategoriasRepository = async () => {
    const resultado = await pool.query('SELECT COUNT(*)::int AS total FROM categoria');
    return resultado.rows[0].total;
};
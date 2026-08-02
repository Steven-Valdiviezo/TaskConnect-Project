import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pg;

types.setTypeParser(1700, (value) => (value === null ? null : parseFloat(value)));

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export const verificarConexion = async() => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Conectado a PostgreSQL (taskconnect)');
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error.message);
    }
};
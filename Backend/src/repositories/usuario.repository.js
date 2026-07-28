import { pool } from '../database/connection.js';

export const buscarUsuarioPorCorreoRepository = async(correo) => {
    const resultado = await pool.query(
        'SELECT * FROM usuario WHERE correo = $1', [correo]
    );
    return resultado.rows[0];
};

export const buscarUsuarioPorIdRepository = async(id) => {
    const resultado = await pool.query(
        'SELECT id_usuario, nombre, correo, telefono, rol, estado, fecha_registro FROM usuario WHERE id_usuario = $1', [id]
    );
    return resultado.rows[0];
};

// Registro transaccional: usuario + (cliente | freelancer)
export const registrarUsuarioRepository = async({ nombre, correo, contrasenaHash, telefono, rol, perfil }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const usuarioResultado = await client.query(
            `INSERT INTO usuario (nombre, correo, contrasena, telefono, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_usuario, nombre, correo, telefono, rol, estado, fecha_registro`, [nombre, correo, contrasenaHash, telefono, rol]
        );

        const usuario = usuarioResultado.rows[0];
        let perfilCreado = null;

        if (rol === 'cliente') {
            const empresa = (perfil && perfil.empresa) ? perfil.empresa : null;
            const direccion = (perfil && perfil.direccion) ? perfil.direccion : null;

            const clienteResultado = await client.query(
                `INSERT INTO cliente (id_usuario, empresa, direccion)
         VALUES ($1, $2, $3)
         RETURNING id_cliente, empresa, direccion`, [usuario.id_usuario, empresa, direccion]
            );
            perfilCreado = clienteResultado.rows[0];
        }

        if (rol === 'freelancer') {
            const freelancerResultado = await client.query(
                `INSERT INTO freelancer (id_usuario, id_profesion, descripcion, experiencia)
         VALUES ($1, $2, $3, $4)
         RETURNING id_freelancer, id_profesion, descripcion, experiencia`, [usuario.id_usuario, perfil.id_profesion, perfil.descripcion, perfil.experiencia]
            );
            perfilCreado = freelancerResultado.rows[0];
        }

        await client.query('COMMIT');
        return { usuario, perfil: perfilCreado };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const obtenerIdsPerfilRepository = async(id_usuario, rol) => {
    if (rol === 'cliente') {
        const r = await pool.query('SELECT id_cliente FROM cliente WHERE id_usuario = $1', [id_usuario]);
        return r.rows[0]; // { id_cliente }
    }
    if (rol === 'freelancer') {
        const r = await pool.query('SELECT id_freelancer FROM freelancer WHERE id_usuario = $1', [id_usuario]);
        return r.rows[0]; // { id_freelancer }
    }
    return null;
};

export const obtenerDatosClienteRepository = async (id_usuario) => {
    const r = await pool.query(
        'SELECT id_cliente, empresa, direccion FROM cliente WHERE id_usuario = $1',
        [id_usuario]
    );
    return r.rows[0];
};

export const obtenerDatosFreelancerRepository = async (id_usuario) => {
    const r = await pool.query(
        `SELECT f.id_freelancer, f.descripcion, f.experiencia, p.id_profesion, p.nombre AS profesion
         FROM freelancer f JOIN profesion p ON p.id_profesion = f.id_profesion
         WHERE f.id_usuario = $1`,
        [id_usuario]
    );
    return r.rows[0];
};

export const actualizarPerfilUsuarioRepository = async (id_usuario, { nombre, telefono }) => {
    const r = await pool.query(
        `UPDATE usuario SET nombre = $1, telefono = $2 WHERE id_usuario = $3
         RETURNING id_usuario, nombre, correo, telefono, rol, estado, fecha_registro`,
        [nombre, telefono, id_usuario]
    );
    return r.rows[0];
};

export const actualizarClienteRepository = async (id_usuario, { empresa, direccion }) => {
    const r = await pool.query(
        `UPDATE cliente SET empresa = $1, direccion = $2 WHERE id_usuario = $3
         RETURNING id_cliente, empresa, direccion`,
        [empresa, direccion, id_usuario]
    );
    return r.rows[0];
};

export const actualizarFreelancerRepository = async (id_usuario, { id_profesion, descripcion, experiencia }) => {
    const r = await pool.query(
        `UPDATE freelancer SET id_profesion = $1, descripcion = $2, experiencia = $3
         WHERE id_usuario = $4
         RETURNING id_freelancer, id_profesion, descripcion, experiencia`,
        [id_profesion, descripcion, experiencia, id_usuario]
    );
    return r.rows[0];
};

export const obtenerPerfilPublicoFreelancerRepository = async (id_freelancer) => {
    const r = await pool.query(
        `SELECT f.id_freelancer, u.nombre, u.fecha_registro,
                p.nombre AS profesion, f.descripcion, f.experiencia,
                (SELECT COUNT(*) FROM contrato c
                 WHERE c.id_freelancer = f.id_freelancer AND c.estado = 'completado')::int AS contratos_completados
         FROM freelancer f
         JOIN usuario u ON u.id_usuario = f.id_usuario
         JOIN profesion p ON p.id_profesion = f.id_profesion
         WHERE f.id_freelancer = $1`,
        [id_freelancer]
    );
    return r.rows[0];
};
// Obtiene perfil para contacto
export const obtenerPerfilFreelancerConContactoRepository = async (id_freelancer) => {
    const r = await pool.query(
        `SELECT f.id_freelancer, u.nombre, u.correo, u.telefono, u.fecha_registro,
                p.nombre AS profesion, f.descripcion, f.experiencia,
                (SELECT COUNT(*) FROM contrato c
                 WHERE c.id_freelancer = f.id_freelancer AND c.estado = 'completado')::int AS contratos_completados
         FROM freelancer f
         JOIN usuario u ON u.id_usuario = f.id_usuario
         JOIN profesion p ON p.id_profesion = f.id_profesion
         WHERE f.id_freelancer = $1`,
        [id_freelancer]
    );
    return r.rows[0];
};

export const existeContratoEntreClienteYFreelancerRepository = async (id_cliente, id_freelancer) => {
    const r = await pool.query(
        `SELECT 1 FROM contrato c
         JOIN proyecto p ON p.id_proyecto = c.id_proyecto
         WHERE c.id_freelancer = $1 AND p.id_cliente = $2
         LIMIT 1`,
        [id_freelancer, id_cliente]
    );
    return r.rowCount > 0;
};
import {
    buscarUsuarioPorCorreoRepository,
    buscarUsuarioPorIdRepository,
    registrarUsuarioRepository,
    obtenerIdsPerfilRepository,
    obtenerDatosClienteRepository,
    obtenerDatosFreelancerRepository,
    actualizarPerfilUsuarioRepository,
    actualizarClienteRepository,
    actualizarFreelancerRepository,
    obtenerPerfilPublicoFreelancerRepository,
    obtenerPerfilFreelancerConContactoRepository,
    existeContratoEntreClienteYFreelancerRepository
} from '../repositories/usuario.repository.js';

import { hashPassword, compararPassword } from '../utils/password.util.js';
import crypto from 'crypto';
import { generarToken } from '../utils/jwt.util.js';
import { enviarCorreoBrevo } from '../utils/brevo.util.js';
import { crearToken2FARepository, consumirToken2FARepository } from '../repositories/token2fa.repository.js';

export const registrarUsuarioService = async(datos) => {
    const { nombre, correo, contrasena, telefono, rol, perfil } = datos;

    if (!nombre || !correo || !contrasena || !rol) {
        const error = new Error('nombre, correo, contrasena y rol son obligatorios');
        error.status = 400;
        throw error;
    }

    if (contrasena.length < 8) {
        const error = new Error('La contraseña debe tener al menos 8 caracteres');
        error.status = 400;
        throw error;
    }

    if (!['cliente', 'freelancer'].includes(rol)) {
        const error = new Error('El rol de registro público solo puede ser cliente o freelancer');
        error.status = 400;
        throw error;
    }

    const existente = await buscarUsuarioPorCorreoRepository(correo);
    if (existente) {
        const error = new Error('Ya existe un usuario registrado con ese correo');
        error.status = 409;
        throw error;
    }

    const contrasenaHash = await hashPassword(contrasena);

    const { usuario, perfil: perfilCreado } = await registrarUsuarioRepository({
        nombre,
        correo,
        contrasenaHash,
        telefono,
        rol,
        perfil
    });

    return { usuario, perfil: perfilCreado };
};

// Paso 1: credenciales + envío del magic link
export const loginUsuarioService = async ({ correo, contrasena }) => {
    const usuario = await buscarUsuarioPorCorreoRepository(correo);

    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    if (usuario.estado !== 'activo') {
        const error = new Error('El usuario está inactivo');
        error.status = 403;
        throw error;
    }

    const coincide = await compararPassword(contrasena, usuario.contrasena);
    if (!coincide) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    // Token aleatorio: al correo va el token, a la BD solo su hash
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const minutos = Number(process.env.MAGIC_LINK_EXPIRES_MIN) || 10;

    await crearToken2FARepository({ id_usuario: usuario.id_usuario, token_hash: tokenHash, minutos });

    // antes: /verificar-2fa?token=
    const enlace = `${process.env.FRONTEND_URL}/login/verificar-correo?token=${token}`;

    await enviarCorreoBrevo({
        para: usuario.correo,
        nombrePara: usuario.nombre,
        asunto: 'Verifica tu inicio de sesión en TaskConnect',
        html: `
            <p>Hola ${usuario.nombre},</p>
            <p>Haz clic en el botón para completar tu inicio de sesión. El enlace expira en ${minutos} minutos y solo puede usarse una vez.</p>
            <p><a href="${enlace}" style="background:#0d6efd;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Verificar inicio de sesión</a></p>
            <p>Si no fuiste tú, ignora este mensaje.</p>`
    });

    return { requiere2fa: true, correo: usuario.correo };
};

// Paso 2: consume el magic link y emite el JWT real
export const confirmarLogin2FAService = async ({ token }) => {
    if (!token) {
        const error = new Error('El token de verificación es obligatorio');
        error.status = 400;
        throw error;
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const registro = await consumirToken2FARepository(tokenHash);

    if (!registro) {
        const error = new Error('El enlace es inválido, expiró o ya fue utilizado');
        error.status = 401;
        throw error;
    }

    const usuario = await buscarUsuarioPorIdRepository(registro.id_usuario);
    if (!usuario || usuario.estado !== 'activo') {
        const error = new Error('Usuario no válido');
        error.status = 401;
        throw error;
    }

    const idsPerfil = await obtenerIdsPerfilRepository(usuario.id_usuario, usuario.rol);
    const payload = { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol, ...(idsPerfil ?? {}) };
    const tokenJwt = generarToken(payload);

    return { token: tokenJwt, usuario: payload };
};

// Actualizado para que muestre por rol y no solo el usuario
export const obtenerPerfilService = async (id_usuario) => {
    const usuario = await buscarUsuarioPorIdRepository(id_usuario);
    if (!usuario) return null;

    let perfil = null;
    if (usuario.rol === 'cliente') perfil = await obtenerDatosClienteRepository(id_usuario);
    if (usuario.rol === 'freelancer') perfil = await obtenerDatosFreelancerRepository(id_usuario);

    return { usuario, perfil };
};

// Servicio para actualizar el perfil del usuario
export const actualizarPerfilService = async (usuarioActual, datos) => {
    const { nombre, telefono, empresa, direccion, id_profesion, descripcion, experiencia } = datos;

    if (!nombre || !nombre.trim()) {
        const error = new Error('El nombre es obligatorio');
        error.status = 400;
        throw error;
    }

    if (usuarioActual.rol === 'freelancer' && (!id_profesion || !descripcion || !descripcion.trim())) {
        const error = new Error('La profesión y la descripción son obligatorias');
        error.status = 400;
        throw error;
    }

    const usuario = await actualizarPerfilUsuarioRepository(usuarioActual.id_usuario, { nombre, telefono: telefono ?? null });

    let perfil = null;
    if (usuarioActual.rol === 'cliente') {
        perfil = await actualizarClienteRepository(usuarioActual.id_usuario, { empresa: empresa ?? null, direccion: direccion ?? null });
    }
    if (usuarioActual.rol === 'freelancer') {
        perfil = await actualizarFreelancerRepository(usuarioActual.id_usuario, { id_profesion, descripcion, experiencia: experiencia ?? 0 });
    }

    return { usuario, perfil };
};

// SOLO PARA DESARROLLO/TESTING — evita el paso de Firebase 2FA
export const loginPruebaService = async ({ correo, contrasena }) => {
    if (process.env.PERMITIR_LOGIN_PRUEBA !== 'true') {
        const error = new Error('Ruta no disponible');
        error.status = 404;
        throw error;
    }

    const usuario = await buscarUsuarioPorCorreoRepository(correo);
    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    if (usuario.estado !== 'activo') {
        const error = new Error('El usuario está inactivo');
        error.status = 403;
        throw error;
    }

    const coincide = await compararPassword(contrasena, usuario.contrasena);
    if (!coincide) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    const idsPerfil = await obtenerIdsPerfilRepository(usuario.id_usuario, usuario.rol);
    const payload = { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol, ...(idsPerfil ?? {}) };
    const token = generarToken(payload);

    return { token, usuario: payload };
};
// para observar el perfil
export const obtenerPerfilPublicoFreelancerService = async (id_freelancer) => {
    const perfil = await obtenerPerfilPublicoFreelancerRepository(id_freelancer);

    if (!perfil) {
        const error = new Error('Freelancer no encontrado');
        error.status = 404;
        throw error;
    }

    return perfil;
};

// Para obtener el perfil de un freelancer con información de contacto si hay un contrato con el cliente
export const obtenerPerfilConContactoFreelancerService = async (usuarioActual, id_freelancer) => {
    if (usuarioActual.rol !== 'cliente') {
        const error = new Error('Solo un cliente puede ver el contacto de un freelancer');
        error.status = 403;
        throw error;
    }

    const tieneContrato = await existeContratoEntreClienteYFreelancerRepository(usuarioActual.id_cliente, id_freelancer);
    if (!tieneContrato) {
        const error = new Error('Solo puedes ver el contacto de freelancers con los que ya tienes un contrato');
        error.status = 403;
        throw error;
    }

    const perfil = await obtenerPerfilFreelancerConContactoRepository(id_freelancer);
    if (!perfil) {
        const error = new Error('Freelancer no encontrado');
        error.status = 404;
        throw error;
    }

    return perfil;
};
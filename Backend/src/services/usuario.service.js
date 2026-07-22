import {
    buscarUsuarioPorCorreoRepository,
    buscarUsuarioPorIdRepository,
    registrarUsuarioRepository,
    obtenerIdsPerfilRepository
} from '../repositories/usuario.repository.js';
import { hashPassword, compararPassword } from '../utils/password.util.js';
import { generarToken } from '../utils/jwt.util.js';

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

export const loginUsuarioService = async({ correo, contrasena }) => {
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

    const payload = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
        ...(idsPerfil ?? {})
    };

    const token = generarToken(payload);

    return {
        token,
        usuario: payload
    };
};

export const obtenerPerfilService = async(id_usuario) => {
    return await buscarUsuarioPorIdRepository(id_usuario);
};
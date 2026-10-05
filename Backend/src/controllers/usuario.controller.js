import {
  registrarUsuarioService,
  loginUsuarioService,
  obtenerPerfilService,
  confirmarLogin2FAService,
  actualizarPerfilService,
  loginPruebaService,
  obtenerPerfilPublicoFreelancerService,
  obtenerPerfilConContactoFreelancerService
} from '../services/usuario.service.js';

export const registrarUsuario = async (req, res, next) => {
  try {
    const resultado = await registrarUsuarioService(req.body);
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      ...resultado
    });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const loginUsuario = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'correo y contrasena son obligatorios' });
    }

    const resultado = await loginUsuarioService({ correo, contrasena });
    res.json({ mensaje: 'Inicio de sesión exitoso', ...resultado });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const perfilActual = async (req, res, next) => {
  try {
    const resultado = await obtenerPerfilService(req.usuario.id_usuario);
    res.json({ mensaje: 'Perfil del usuario autenticado', ...resultado });
  } catch (error) {
    next(error);
  }
};

export const confirmarLogin2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const resultado = await confirmarLogin2FAService({ token });
    res.json({ mensaje: 'Inicio de sesión exitoso', ...resultado });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const actualizarPerfil = async (req, res, next) => {
  try {
    const resultado = await actualizarPerfilService(req.usuario, req.body);
    res.json({ mensaje: 'Perfil actualizado correctamente', ...resultado });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

// login prueba sin 2FA, para pruebas de desarrollo
export const loginPrueba = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'correo y contrasena son obligatorios' });
    }
    const resultado = await loginPruebaService({ correo, contrasena });
    res.json({ mensaje: 'Inicio de sesión de prueba exitoso (sin 2FA)', ...resultado });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

// Obtener perfil público de un freelancer por su ID
export const perfilPublicoFreelancer = async (req, res, next) => {
  try {
    const perfil = await obtenerPerfilPublicoFreelancerService(Number(req.params.id));
    res.json({ mensaje: 'Perfil público del freelancer', perfil });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

// Obtener perfil de un freelancer con información de contacto si hay contrato con el cliente
export const perfilFreelancerConContacto = async (req, res, next) => {
  try {
    const perfil = await obtenerPerfilConContactoFreelancerService(req.usuario, Number(req.params.id));
    res.json({ mensaje: 'Perfil del freelancer con datos de contacto', perfil });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};
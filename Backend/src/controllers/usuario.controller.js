import {
  registrarUsuarioService,
  loginUsuarioService,
  obtenerPerfilService,
  confirmarLogin2FAService,
  actualizarPerfilService
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
    const { preAuthToken, firebaseIdToken } = req.body;
    const resultado = await confirmarLogin2FAService({ preAuthToken, firebaseIdToken });
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
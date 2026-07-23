import {
  listarUsuariosRepository,
  desactivarUsuarioRepository,
  reactivarUsuarioRepository,
  listarAuditoriaRepository
} from '../repositories/admin.repository.js';

export const listarUsuariosService = async (filtros) => {
  return await listarUsuariosRepository(filtros);
};

export const desactivarUsuarioService = async (adminActual, id_usuario) => {
  if (adminActual.id_usuario === id_usuario) {
    const error = new Error('No puedes desactivar tu propia cuenta de administrador');
    error.status = 400;
    throw error;
  }

  const usuario = await desactivarUsuarioRepository(id_usuario);

  if (!usuario) {
    const error = new Error('Usuario no encontrado o ya estaba inactivo');
    error.status = 404;
    throw error;
  }

  return usuario;
};

export const reactivarUsuarioService = async (id_usuario) => {
  const usuario = await reactivarUsuarioRepository(id_usuario);

  if (!usuario) {
    const error = new Error('Usuario no encontrado o ya estaba activo');
    error.status = 404;
    throw error;
  }

  return usuario;
};

export const listarAuditoriaService = async (filtros) => {
  return await listarAuditoriaRepository(filtros);
};
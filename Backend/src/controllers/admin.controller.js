import {
  listarUsuariosService,
  desactivarUsuarioService,
  reactivarUsuarioService,
  listarAuditoriaService,
  obtenerEstadisticasAdminService
} from '../services/admin.service.js';

export const listarUsuarios = async (req, res, next) => {
  try {
    const { rol, estado } = req.query;
    const usuarios = await listarUsuariosService({ rol, estado });
    res.json({ mensaje: 'Listado de usuarios', total: usuarios.length, usuarios });
  } catch (error) {
    next(error);
  }
};

export const desactivarUsuario = async (req, res, next) => {
  try {
    const usuario = await desactivarUsuarioService(req.usuario, Number(req.params.id));
    res.json({ mensaje: 'Usuario desactivado correctamente', usuario });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const reactivarUsuario = async (req, res, next) => {
  try {
    const usuario = await reactivarUsuarioService(Number(req.params.id));
    res.json({ mensaje: 'Usuario reactivado correctamente', usuario });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarAuditoria = async (req, res, next) => {
  try {
    const { tabla, limite } = req.query;
    const registros = await listarAuditoriaService({ tabla, limite: Number(limite) || undefined });
    res.json({ mensaje: 'Registros de auditoría', total: registros.length, registros });
  } catch (error) {
    next(error);
  }
};

export const obtenerEstadisticasAdmin = async (req, res, next) => {
  try {
    const estadisticas = await obtenerEstadisticasAdminService();
    res.json({ mensaje: 'Estadísticas administrativas', estadisticas });
  } catch (error) { next(error); }
};
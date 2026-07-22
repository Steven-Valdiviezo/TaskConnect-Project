import {
  registrarCalificacionService,
  listarCalificacionesRecibidasService,
  obtenerReputacionService
} from '../services/calificacion.service.js';

export const registrarCalificacion = async (req, res, next) => {
  try {
    const calificacion = await registrarCalificacionService(req.usuario, req.body);
    res.status(201).json({ mensaje: 'Calificación registrada correctamente', calificacion });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarCalificacionesRecibidas = async (req, res, next) => {
  try {
    const calificaciones = await listarCalificacionesRecibidasService(Number(req.params.idUsuario));
    res.json({ mensaje: 'Calificaciones recibidas', total: calificaciones.length, calificaciones });
  } catch (error) {
    next(error);
  }
};

export const obtenerReputacion = async (req, res, next) => {
  try {
    const reputacion = await obtenerReputacionService(Number(req.params.idFreelancer));
    res.json({ mensaje: 'Reputación del freelancer', reputacion });
  } catch (error) {
    next(error);
  }
};
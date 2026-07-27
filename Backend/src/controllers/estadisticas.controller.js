import { obtenerEstadisticasPublicasService } from '../services/estadisticas.service.js';

export const obtenerEstadisticasPublicas = async (req, res, next) => {
  try {
    const estadisticas = await obtenerEstadisticasPublicasService();
    res.json({ mensaje: 'Estadísticas públicas de la plataforma', estadisticas });
  } catch (error) {
    next(error);
  }
};
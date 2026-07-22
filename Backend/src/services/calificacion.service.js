import {
  obtenerContratoParaCalificarRepository,
  crearCalificacionRepository,
  listarCalificacionesDeUsuarioRepository,
  obtenerReputacionFreelancerRepository
} from '../repositories/calificacion.repository.js';

export const registrarCalificacionService = async (usuarioActual, datos) => {
  const { id_contrato, puntuacion, comentario } = datos;

  if (usuarioActual.rol !== 'cliente') {
    const error = new Error('Solo los clientes pueden calificar. El sistema de reputación es unidireccional (cliente → freelancer)');
    error.status = 403;
    throw error;
  }

  if (!id_contrato || !puntuacion) {
    const error = new Error('id_contrato y puntuacion son obligatorios');
    error.status = 400;
    throw error;
  }

  if (puntuacion < 1 || puntuacion > 5) {
    const error = new Error('La puntuación debe estar entre 1 y 5');
    error.status = 400;
    throw error;
  }

  const contrato = await obtenerContratoParaCalificarRepository(id_contrato);

  if (!contrato) {
    const error = new Error('Contrato no encontrado');
    error.status = 404;
    throw error;
  }

  if (contrato.id_usuario_cliente !== usuarioActual.id_usuario) {
    const error = new Error('Solo el cliente dueño de este contrato puede calificarlo');
    error.status = 403;
    throw error;
  }

  // trg_validar_calificacion exige que el contrato esté 'completado'
  // uq_calificacion impide repetir calificación del mismo contrato
  return await crearCalificacionRepository({
    id_contrato,
    id_calificador: usuarioActual.id_usuario,
    id_calificado: contrato.id_usuario_freelancer,
    puntuacion,
    comentario: comentario ?? null
  });
};

export const listarCalificacionesRecibidasService = async (id_usuario) => {
  return await listarCalificacionesDeUsuarioRepository(id_usuario);
};

export const obtenerReputacionService = async (id_freelancer) => {
  return await obtenerReputacionFreelancerRepository(id_freelancer);
};
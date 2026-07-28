import {
  obtenerPropuestaConProyectoRepository,
  crearContratoRepository,
  listarContratosPorUsuarioRepository,
  actualizarEstadoContratoRepository,
  obtenerContratoConFreelancerRepository
} from '../repositories/contrato.repository.js';

export const aceptarPropuestaYCrearContratoService = async (id_cliente, id_propuesta) => {
  const propuesta = await obtenerPropuestaConProyectoRepository(id_propuesta);

  if (!propuesta) {
    const error = new Error('Propuesta no encontrada');
    error.status = 404;
    throw error;
  }

  if (propuesta.id_cliente !== id_cliente) {
    const error = new Error('Solo el cliente dueño del proyecto puede aceptar esta propuesta');
    error.status = 403;
    throw error;
  }

  if (propuesta.estado !== 'pendiente') {
    const error = new Error('Solo se pueden aceptar propuestas en estado pendiente');
    error.status = 400;
    throw error;
  }
  // Valida si el freelancer es activo
  if (propuesta.estado_freelancer !== 'activo') {
    const error = new Error(`No es posible aceptar la propuesta porque el freelancer "${propuesta.nombre_freelancer}" se encuentra inactivo.`);
    error.status = 409;
    throw error;
  }

  // Al insertar, los triggers se encargan de:
  // - validar que el proyecto esté abierto (trg_validar_estado_proyecto)
  // - impedir auto-contratación (trg_validar_contrato_propio)
  // - pasar el proyecto a 'ejecucion' (trg_proyecto_en_progreso)
  // - marcar esta propuesta como 'aceptada' y rechazar las demás
  //   (trg_aceptar_propuesta, trg_cerrar_propuestas)
  const contrato = await crearContratoRepository({
    id_proyecto: propuesta.id_proyecto,
    id_freelancer: propuesta.id_freelancer,
    fecha_inicio: new Date()
  });

  return contrato;
};

export const listarMisContratosService = async (id_usuario, rol) => {
  return await listarContratosPorUsuarioRepository(id_usuario, rol);
};

export const completarContratoService = async (id_contrato) => {
  const contrato = await obtenerContratoConFreelancerRepository(id_contrato);

  if (!contrato) {
    const error = new Error('Contrato no encontrado');
    error.status = 404;
    throw error;
  }

  if (contrato.estado_freelancer !== 'activo') {
    const error = new Error(`No es posible marcar el contrato como completado porque el freelancer "${contrato.nombre_freelancer}" se encuentra inactivo.`);
    error.status = 409;
    throw error;
  }
  // El trigger marca como finalizado
  return await actualizarEstadoContratoRepository(id_contrato, 'completado', new Date());
};

export const cancelarContratoService = async (id_contrato) => {
  // trg_validar_cancelacion_contrato impide cancelar uno ya completado
  return await actualizarEstadoContratoRepository(id_contrato, 'cancelado', null);
};
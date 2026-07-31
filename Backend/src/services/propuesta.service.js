import {
  listarPropuestasPorProyectoRepository,
  crearPropuestaRepository,
  eliminarPropuestaRepository,
  listarPropuestasPorClienteRepository,
  listarPropuestasPorFreelancerRepository,
  rechazarPropuestaRepository
} from '../repositories/propuesta.repository.js';

import { obtenerProyectoPorIdRepository } from '../repositories/proyecto.repository.js';

export const listarPropuestasService = async (id_proyecto) => {
  return await listarPropuestasPorProyectoRepository(id_proyecto);
};

export const listarPropuestasDelClienteService = async (id_cliente) => {
  return await listarPropuestasPorClienteRepository(id_cliente);
};

export const listarPropuestasDelFreelancerService = async (id_freelancer) => {
  return await listarPropuestasPorFreelancerRepository(id_freelancer);
};

export const crearPropuestaService = async (id_freelancer, datos) => {
  const { id_proyecto, mensaje, monto_propuesto } = datos;

  if (!id_proyecto || !mensaje || !monto_propuesto) {
    const error = new Error('id_proyecto, mensaje y monto_propuesto son obligatorios');
    error.status = 400;
    throw error;
  }

  if (Number(monto_propuesto) <= 0) {
    const error = new Error('El monto propuesto debe ser mayor a 0');
    error.status = 400;
    throw error;
  }
  // Validacion de presupesto del proyecto
  // --- VALIDACIÓN DE PRESUPUESTO DEL PROYECTO ---
  const proyecto = await obtenerProyectoPorIdRepository(id_proyecto);

  if (!proyecto) {
    const error = new Error('El proyecto especificado no existe');
    error.status = 404;
    throw error;
  }

  if (Number(monto_propuesto) > Number(proyecto.presupuesto)) {
    const error = new Error(`El monto propuesto ($${monto_propuesto}) no puede ser mayor al presupuesto del proyecto ($${proyecto.presupuesto})`);
    error.status = 400;
    throw error;
  }

  // Las reglas de "proyecto abierto", "no auto-postulación" y "sin propuesta activa duplicada"
  // ya las validan los triggers trg_no_propuesta_proyecto_cerrado,
  // trg_validar_propuesta_propio_proyecto y trg_validar_propuesta_activa.
  return await crearPropuestaRepository({
    id_proyecto,
    id_freelancer,
    mensaje,
    monto_propuesto
  });
};

export const retirarPropuestaService = async (id_freelancer, id_propuesta) => {
  const propuesta = await eliminarPropuestaRepository(id_propuesta, id_freelancer);

  if (!propuesta) {
    const error = new Error('Propuesta no encontrada, no te pertenece, o ya no se puede retirar (estado aceptada)');
    error.status = 404;
    throw error;
  }

  return propuesta;
};

export const rechazarPropuestaService = async (id_cliente, id_propuesta) => {
  const propuesta = await rechazarPropuestaRepository(id_propuesta, id_cliente);

  if (!propuesta) {
    const error = new Error('Propuesta no encontrada, no pertenece a uno de tus proyectos, o ya no está pendiente');
    error.status = 404;
    throw error;
  }

  return propuesta;
};
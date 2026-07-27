import { 
  listarPropuestasService, listarPropuestasDelClienteService, listarPropuestasDelFreelancerService,
  crearPropuestaService, retirarPropuestaService } 
from '../services/propuesta.service.js';

export const listarPropuestasDeProyecto = async (req, res, next) => {
  try {
    const propuestas = await listarPropuestasService(Number(req.params.idProyecto));
    res.json({ mensaje: 'Propuestas del proyecto', total: propuestas.length, propuestas });
  } catch (error) {
    next(error);
  }
};

export const listarPropuestasDelCliente = async (req, res, next) => {
  try {
    const propuestas = await listarPropuestasDelClienteService(req.usuario.id_cliente);
    res.json({ mensaje: 'Propuestas recibidas en todos tus proyectos', total: propuestas.length, propuestas });
  } catch (error) {
    next(error);
  }
};

export const enviarPropuesta = async (req, res, next) => {
  try {
    const propuesta = await crearPropuestaService(req.usuario.id_freelancer, req.body);
    res.status(201).json({ mensaje: 'Propuesta enviada correctamente', propuesta });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const retirarPropuesta = async (req, res, next) => {
  try {
    const propuesta = await retirarPropuestaService(req.usuario.id_freelancer, Number(req.params.id));
    res.json({ mensaje: 'Propuesta retirada correctamente', propuesta });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarMisPropuestasEnviadas = async (req, res, next) => {
  try {
    const propuestas = await listarPropuestasDelFreelancerService(req.usuario.id_freelancer);
    res.json({ mensaje: 'Mis propuestas enviadas', total: propuestas.length, propuestas });
  } catch (error) { next(error); }
};
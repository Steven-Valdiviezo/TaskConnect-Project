import {
  listarProyectosService,
  obtenerProyectoService,
  crearProyectoService,
  actualizarProyectoService,
  cancelarProyectoService,
  listarMisProyectosService,
  eliminarProyectoService
} from '../services/proyecto.service.js';

export const listarProyectos = async (req, res, next) => {
  try {
    const { id_categoria, presupuesto_min, presupuesto_max } = req.query;
    const proyectos = await listarProyectosService({ id_categoria, presupuesto_min, presupuesto_max });
    res.json({ mensaje: 'Listado de proyectos', total: proyectos.length, proyectos });
  } catch (error) {
    next(error);
  }
};

export const obtenerProyecto = async (req, res, next) => {
  try {
    const proyecto = await obtenerProyectoService(Number(req.params.id));
    if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    res.json({ mensaje: 'Proyecto encontrado', proyecto });
  } catch (error) {
    next(error);
  }
};

export const crearProyecto = async (req, res, next) => {
  try {
    const proyecto = await crearProyectoService(req.usuario.id_cliente, req.body);
    res.status(201).json({ mensaje: 'Proyecto publicado correctamente', proyecto });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const editarProyecto = async (req, res, next) => {
  try {
    const proyecto = await actualizarProyectoService(Number(req.params.id), req.usuario.id_cliente, req.body);
    res.json({ mensaje: 'Proyecto actualizado correctamente', proyecto });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const cancelarProyecto = async (req, res, next) => {
  try {
    const proyecto = await cancelarProyectoService(Number(req.params.id), req.usuario.id_cliente);
    res.json({ mensaje: 'Proyecto cancelado correctamente', proyecto });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarMisProyectos = async (req, res, next) => {
  try {
    const proyectos = await listarMisProyectosService(req.usuario.id_cliente);
    res.json({ mensaje: 'Mis proyectos', total: proyectos.length, proyectos });
  } catch (error) { next(error); }
};

export const eliminarProyecto = async (req, res, next) => {
  try {
    const proyecto = await eliminarProyectoService(Number(req.params.id));
    res.json({ mensaje: 'Proyecto eliminado correctamente', proyecto });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};
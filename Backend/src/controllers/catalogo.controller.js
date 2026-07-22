import {
  listarCategoriasService, crearCategoriaService,
  listarProfesionesService, crearProfesionService,
  listarMetodosPagoService, crearMetodoPagoService
} from '../services/catalogo.service.js';

export const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await listarCategoriasService();
    res.json({ mensaje: 'Listado de categorías', categorias });
  } catch (error) { next(error); }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const categoria = await crearCategoriaService(req.body.nombre_categoria);
    res.status(201).json({ mensaje: 'Categoría creada correctamente', categoria });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarProfesiones = async (req, res, next) => {
  try {
    const profesiones = await listarProfesionesService();
    res.json({ mensaje: 'Listado de profesiones', profesiones });
  } catch (error) { next(error); }
};

export const crearProfesion = async (req, res, next) => {
  try {
    const profesion = await crearProfesionService(req.body);
    res.status(201).json({ mensaje: 'Profesión creada correctamente', profesion });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarMetodosPago = async (req, res, next) => {
  try {
    const metodos = await listarMetodosPagoService();
    res.json({ mensaje: 'Listado de métodos de pago', metodos });
  } catch (error) { next(error); }
};

export const crearMetodoPago = async (req, res, next) => {
  try {
    const metodo = await crearMetodoPagoService(req.body);
    res.status(201).json({ mensaje: 'Método de pago creado correctamente', metodo });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};
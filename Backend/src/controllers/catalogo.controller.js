import {
  listarCategoriasService, crearCategoriaService, actualizarCategoriaService, eliminarCategoriaService,

  listarProfesionesService, crearProfesionService, actualizarProfesionService, eliminarProfesionService,
  
  listarMetodosPagoService, crearMetodoPagoService, actualizarMetodoPagoService, eliminarMetodoPagoService, obtenerTarifaIvaService
} from '../services/catalogo.service.js';

// ---- Categoría ----
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
// ---- Configuración pública (tarifa del IVA) ----
export const obtenerConfiguracion = async (req, res, next) => {
  try {
    const tarifa_iva = await obtenerTarifaIvaService();
    res.json({ mensaje: 'Configuración pública', tarifa_iva });
  } catch (error) { next(error); }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const categoria = await actualizarCategoriaService(Number(req.params.id), req.body.nombre_categoria);
    res.json({ mensaje: 'Categoría actualizada correctamente', categoria });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const categoria = await eliminarCategoriaService(Number(req.params.id));
    res.json({ mensaje: 'Categoría eliminada correctamente', categoria });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

// ---- Profesión ----
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

export const actualizarProfesion = async (req, res, next) => {
  try {
    const profesion = await actualizarProfesionService(Number(req.params.id), req.body);
    res.json({ mensaje: 'Profesión actualizada correctamente', profesion });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const eliminarProfesion = async (req, res, next) => {
  try {
    const profesion = await eliminarProfesionService(Number(req.params.id));
    res.json({ mensaje: 'Profesión eliminada correctamente', profesion });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

// ---- Método de pago ----
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

export const actualizarMetodoPago = async (req, res, next) => {
  try {
    const metodo = await actualizarMetodoPagoService(Number(req.params.id), req.body);
    res.json({ mensaje: 'Método de pago actualizado correctamente', metodo });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const eliminarMetodoPago = async (req, res, next) => {
  try {
    const metodo = await eliminarMetodoPagoService(Number(req.params.id));
    res.json({ mensaje: 'Método de pago eliminado correctamente', metodo });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};
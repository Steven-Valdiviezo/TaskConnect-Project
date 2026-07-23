import {
  // Categoría
  listarCategoriasRepository, obtenerCategoriaPorIdRepository, obtenerCategoriaPorNombreRepository,
  crearCategoriaRepository, actualizarCategoriaRepository, contarProyectosPorCategoriaRepository,
  eliminarCategoriaRepository,
  // Profesión
  listarProfesionesRepository, obtenerProfesionPorIdRepository, obtenerProfesionPorNombreRepository,
  crearProfesionRepository, actualizarProfesionRepository, contarFreelancersPorProfesionRepository,
  eliminarProfesionRepository,
  // Método de pago
  listarMetodosPagoRepository, obtenerMetodoPagoPorIdRepository, obtenerMetodoPagoPorNombreRepository,
  crearMetodoPagoRepository, actualizarMetodoPagoRepository, contarPagosPorMetodoRepository,
  eliminarMetodoPagoRepository
} from '../repositories/catalogo.repository.js';

// ============ Categoría ============
export const listarCategoriasService = async () => await listarCategoriasRepository();

export const crearCategoriaService = async (nombre_categoria) => {
  if (!nombre_categoria || !nombre_categoria.trim()) {
    const error = new Error('nombre_categoria es obligatorio');
    error.status = 400;
    throw error;
  }

  const duplicada = await obtenerCategoriaPorNombreRepository(nombre_categoria.trim());
  if (duplicada) {
    const error = new Error('Ya existe una categoría con ese nombre');
    error.status = 409;
    throw error;
  }

  return await crearCategoriaRepository(nombre_categoria.trim());
};

export const actualizarCategoriaService = async (id_categoria, nombre_categoria) => {
  if (!nombre_categoria || !nombre_categoria.trim()) {
    const error = new Error('nombre_categoria es obligatorio');
    error.status = 400;
    throw error;
  }

  const existente = await obtenerCategoriaPorIdRepository(id_categoria);
  if (!existente) {
    const error = new Error('Categoría no encontrada');
    error.status = 404;
    throw error;
  }

  const duplicada = await obtenerCategoriaPorNombreRepository(nombre_categoria.trim());
  if (duplicada && duplicada.id_categoria !== id_categoria) {
    const error = new Error('Ya existe otra categoría con ese nombre');
    error.status = 409;
    throw error;
  }

  return await actualizarCategoriaRepository(id_categoria, nombre_categoria.trim());
};

export const eliminarCategoriaService = async (id_categoria) => {
  const existente = await obtenerCategoriaPorIdRepository(id_categoria);
  if (!existente) {
    const error = new Error('Categoría no encontrada');
    error.status = 404;
    throw error;
  }

  const enUso = await contarProyectosPorCategoriaRepository(id_categoria);
  if (enUso > 0) {
    const error = new Error(`No se puede eliminar: ${enUso} proyecto(s) usan esta categoría`);
    error.status = 409;
    throw error;
  }

  return await eliminarCategoriaRepository(id_categoria);
};

// ============ Profesión ============
export const listarProfesionesService = async () => await listarProfesionesRepository();

export const crearProfesionService = async ({ nombre, descripcion }) => {
  if (!nombre || !nombre.trim() || !descripcion || !descripcion.trim()) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }

  const duplicada = await obtenerProfesionPorNombreRepository(nombre.trim());
  if (duplicada) {
    const error = new Error('Ya existe una profesión con ese nombre');
    error.status = 409;
    throw error;
  }

  return await crearProfesionRepository({ nombre: nombre.trim(), descripcion: descripcion.trim() });
};

export const actualizarProfesionService = async (id_profesion, { nombre, descripcion }) => {
  if (!nombre || !nombre.trim() || !descripcion || !descripcion.trim()) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }

  const existente = await obtenerProfesionPorIdRepository(id_profesion);
  if (!existente) {
    const error = new Error('Profesión no encontrada');
    error.status = 404;
    throw error;
  }

  const duplicada = await obtenerProfesionPorNombreRepository(nombre.trim());
  if (duplicada && duplicada.id_profesion !== id_profesion) {
    const error = new Error('Ya existe otra profesión con ese nombre');
    error.status = 409;
    throw error;
  }

  return await actualizarProfesionRepository(id_profesion, { nombre: nombre.trim(), descripcion: descripcion.trim() });
};

export const eliminarProfesionService = async (id_profesion) => {
  const existente = await obtenerProfesionPorIdRepository(id_profesion);
  if (!existente) {
    const error = new Error('Profesión no encontrada');
    error.status = 404;
    throw error;
  }

  const enUso = await contarFreelancersPorProfesionRepository(id_profesion);
  if (enUso > 0) {
    const error = new Error(`No se puede eliminar: ${enUso} freelancer(s) tienen esta profesión`);
    error.status = 409;
    throw error;
  }

  return await eliminarProfesionRepository(id_profesion);
};

// ============ Método de pago ============
export const listarMetodosPagoService = async () => await listarMetodosPagoRepository();

export const crearMetodoPagoService = async ({ nombre, descripcion }) => {
  if (!nombre || !nombre.trim() || !descripcion || !descripcion.trim()) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }

  const duplicado = await obtenerMetodoPagoPorNombreRepository(nombre.trim());
  if (duplicado) {
    const error = new Error('Ya existe un método de pago con ese nombre');
    error.status = 409;
    throw error;
  }

  return await crearMetodoPagoRepository({ nombre: nombre.trim(), descripcion: descripcion.trim() });
};

export const actualizarMetodoPagoService = async (id_metodo_pago, { nombre, descripcion }) => {
  if (!nombre || !nombre.trim() || !descripcion || !descripcion.trim()) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }

  const existente = await obtenerMetodoPagoPorIdRepository(id_metodo_pago);
  if (!existente) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  const duplicado = await obtenerMetodoPagoPorNombreRepository(nombre.trim());
  if (duplicado && duplicado.id_metodo_pago !== id_metodo_pago) {
    const error = new Error('Ya existe otro método de pago con ese nombre');
    error.status = 409;
    throw error;
  }

  return await actualizarMetodoPagoRepository(id_metodo_pago, { nombre: nombre.trim(), descripcion: descripcion.trim() });
};

export const eliminarMetodoPagoService = async (id_metodo_pago) => {
  const existente = await obtenerMetodoPagoPorIdRepository(id_metodo_pago);
  if (!existente) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  const enUso = await contarPagosPorMetodoRepository(id_metodo_pago);
  if (enUso > 0) {
    const error = new Error(`No se puede eliminar: ${enUso} pago(s) usan este método`);
    error.status = 409;
    throw error;
  }

  return await eliminarMetodoPagoRepository(id_metodo_pago);
};
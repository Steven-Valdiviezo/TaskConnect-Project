import {
  listarCategoriasRepository, crearCategoriaRepository,
  listarProfesionesRepository, crearProfesionRepository,
  listarMetodosPagoRepository, crearMetodoPagoRepository
} from '../repositories/catalogo.repository.js';

export const listarCategoriasService = async () => await listarCategoriasRepository();

export const crearCategoriaService = async (nombre_categoria) => {
  if (!nombre_categoria || !nombre_categoria.trim()) {
    const error = new Error('nombre_categoria es obligatorio');
    error.status = 400;
    throw error;
  }
  return await crearCategoriaRepository(nombre_categoria);
};

export const listarProfesionesService = async () => await listarProfesionesRepository();

export const crearProfesionService = async ({ nombre, descripcion }) => {
  if (!nombre || !descripcion) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }
  return await crearProfesionRepository({ nombre, descripcion });
};

export const listarMetodosPagoService = async () => await listarMetodosPagoRepository();

export const crearMetodoPagoService = async ({ nombre, descripcion }) => {
  if (!nombre || !descripcion) {
    const error = new Error('nombre y descripcion son obligatorios');
    error.status = 400;
    throw error;
  }
  return await crearMetodoPagoRepository({ nombre, descripcion });
};
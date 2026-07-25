import {
  listarProyectosRepository,
  obtenerProyectoPorIdRepository,
  crearProyectoRepository,
  actualizarProyectoRepository,
  obtenerDueñoProyectoRepository,
  cancelarProyectoRepository,
  listarProyectosPorClienteRepository
} from '../repositories/proyecto.repository.js';

export const listarProyectosService = async (filtros) => {
  return await listarProyectosRepository(filtros);
};

export const obtenerProyectoService = async (id) => {
  return await obtenerProyectoPorIdRepository(id);
};

export const crearProyectoService = async (id_cliente, datos) => {
  const { titulo, descripcion, presupuesto, id_categoria } = datos;

  if (!titulo || !descripcion || !presupuesto || !id_categoria) {
    const error = new Error('titulo, descripcion, presupuesto e id_categoria son obligatorios');
    error.status = 400;
    throw error;
  }

  if (Number(presupuesto) <= 0) {
    const error = new Error('El presupuesto debe ser mayor a 0');
    error.status = 400;
    throw error;
  }

  return await crearProyectoRepository({
    id_cliente,
    id_categoria,
    titulo,
    descripcion,
    presupuesto
  });
};

export const actualizarProyectoService = async (id_proyecto, id_cliente, datos) => {
  const dueño = await obtenerDueñoProyectoRepository(id_proyecto);

  if (!dueño) {
    const error = new Error('Proyecto no encontrado');
    error.status = 404;
    throw error;
  }

  if (dueño.id_cliente !== id_cliente) {
    const error = new Error('Solo el cliente dueño del proyecto puede modificarlo');
    error.status = 403;
    throw error;
  }

  // El trigger trg_validar_modificacion_proyecto ya impide editar si no está "abierto"
  return await actualizarProyectoRepository(id_proyecto, datos);
};

//agregado el cancelar
export const cancelarProyectoService = async (id_proyecto, id_cliente) => {
  const dueño = await obtenerDueñoProyectoRepository(id_proyecto);

  if (!dueño) {
    const error = new Error('Proyecto no encontrado');
    error.status = 404;
    throw error;
  }

  if (dueño.id_cliente !== id_cliente) {
    const error = new Error('Solo el cliente dueño del proyecto puede cancelarlo');
    error.status = 403;
    throw error;
  }

  const proyecto = await cancelarProyectoRepository(id_proyecto);

  if (!proyecto) {
    const error = new Error('El proyecto ya está finalizado o cancelado, no se puede cancelar');
    error.status = 400;
    throw error;
  }

  return proyecto;
};

export const listarMisProyectosService = async (id_cliente) => {
  return await listarProyectosPorClienteRepository(id_cliente);
};
import {
  listarProyectosRepository,
  obtenerProyectoPorIdRepository,
  crearProyectoRepository,
  actualizarProyectoRepository,
  obtenerDueñoProyectoRepository,
  cancelarProyectoRepository,
  listarProyectosPorClienteRepository,
  eliminarProyectoRepository
} from '../repositories/proyecto.repository.js';
import { validarTexto, validarMonto, lanzarError400 } from '../utils/validaciones.util.js';

// Validaciones de contenido de un proyecto (se usan al crear y al editar; mismas reglas del frontend)
const validarDatosProyecto = ({ titulo, descripcion, presupuesto, fecha_entrega }) => {
  const errorCampos = validarTexto(titulo, 'El título', 5, 150)
    || validarTexto(descripcion, 'La descripción', 20, 2000)
    || validarMonto(presupuesto, 'El presupuesto', 1000000);
  
  if (errorCampos) lanzarError400(errorCampos);
  
  // La fecha de entrega no puede estar en el pasado.
  // Render corre en UTC: se acepta desde "ayer UTC" para no rechazar el "hoy" de Ecuador (UTC-5).
  if (fecha_entrega) {
    const limite = new Date();
    limite.setUTCDate(limite.getUTCDate() - 1);
    limite.setUTCHours(0, 0, 0, 0);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_entrega) || new Date(`${fecha_entrega}T00:00:00Z`) < limite) {
      lanzarError400('La fecha de entrega no es válida o ya pasó');
    }
  }
};

export const listarProyectosService = async (filtros) => {
  const { id_categoria, presupuesto_min, presupuesto_max } = filtros;
  
  if (id_categoria && !Number.isInteger(Number(id_categoria))) lanzarError400('id_categoria no es válido');
  
  for (const [nombre, valor] of [['presupuesto_min', presupuesto_min], ['presupuesto_max', presupuesto_max]]) {
    if (valor && (!Number.isFinite(Number(valor)) || Number(valor) < 0)) lanzarError400(`${nombre} no es válido`);
  }
  
  if (presupuesto_min && presupuesto_max && Number(presupuesto_min) > Number(presupuesto_max)) {
    lanzarError400('El presupuesto mínimo no puede ser mayor al máximo');
  }
  
  return await listarProyectosRepository(filtros);
};

export const obtenerProyectoService = async (id) => {
  return await obtenerProyectoPorIdRepository(id);
};

export const crearProyectoService = async (id_cliente, datos) => {
  const { titulo, descripcion, presupuesto, id_categoria, fecha_entrega } = datos;

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
  
  validarDatosProyecto({ titulo, descripcion, presupuesto, fecha_entrega });

  return await crearProyectoRepository({
    id_cliente,
    id_categoria,
    titulo,
    descripcion,
    presupuesto,
    fecha_entrega
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

  // Mismas validaciones de contenido que al publicar
  validarDatosProyecto(datos);

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

export const eliminarProyectoService = async (id_proyecto) => {
  const proyecto = await eliminarProyectoRepository(id_proyecto);
  if (!proyecto) {
    const error = new Error('Proyecto no encontrado');
    error.status = 404;
    throw error;
  }
  return proyecto;
};
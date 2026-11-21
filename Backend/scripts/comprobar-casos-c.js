import { ProyectoSpecification } from '../src/domain/specifications/proyecto-specification.js';
import { ListarProyectos } from '../src/application/use-cases/queries/proyecto/listar-proyectos.js';
import { ObtenerProyecto } from '../src/application/use-cases/queries/proyecto/obtener-proyecto.js';
import { CrearProyecto } from '../src/application/use-cases/commands/proyecto/crear-proyecto.js';
import { ActualizarProyecto } from '../src/application/use-cases/commands/proyecto/actualizar-proyecto.js';
import { CancelarProyecto } from '../src/application/use-cases/commands/proyecto/cancelar-proyecto.js';
import { EliminarProyecto } from '../src/application/use-cases/commands/proyecto/eliminar-proyecto.js';
import { EnviarPropuesta } from '../src/application/use-cases/commands/propuesta/enviar-propuesta.js';
import { RetirarPropuesta } from '../src/application/use-cases/commands/propuesta/retirar-propuesta.js';
import { RechazarPropuesta } from '../src/application/use-cases/commands/propuesta/rechazar-propuesta.js';
import { ListarPropuestasDeProyecto } from '../src/application/use-cases/queries/propuesta/listar-propuestas-de-proyecto.js';

// ---------- fakes en memoria ----------
const proyectosBD = {
  1: { id_proyecto: 1, id_cliente: 7, presupuesto: 500, estado: 'abierto' },
  2: { id_proyecto: 2, id_cliente: 7, presupuesto: 300, estado: 'finalizado' }
};

let especificacionRecibida;
const proyectoRepository = {
  listar: async (esp) => { especificacionRecibida = esp; return []; },
  buscarPorId: async (id) => proyectosBD[id],
  crear: async (d) => ({ id_proyecto: 50, ...d, estado: 'abierto' }),
  actualizar: async (id, d) => ({ id_proyecto: id, ...d }),
  obtenerDueno: async (id) => (proyectosBD[id] ? { id_cliente: proyectosBD[id].id_cliente } : undefined),
  cancelar: async (id) => (proyectosBD[id].estado === 'finalizado' ? null : { ...proyectosBD[id], estado: 'cancelado' }),
  eliminar: async (id) => proyectosBD[id]
};

const propuestaRepository = {
  crear: async (d) => ({ id_propuesta: 80, ...d, estado: 'pendiente' }),
  eliminar: async (id, idFreelancer) => (id === 1 && idFreelancer === 4 ? { id_propuesta: 1 } : undefined),
  rechazar: async (id, idCliente) => (id === 1 && idCliente === 7 ? { id_propuesta: 1, estado: 'rechazada' } : undefined),
  listarPorProyecto: async (id) => [{ id_propuesta: 1, id_proyecto: id }]
};

// ---------- helper ----------
const corto = (r) => (JSON.stringify(r) ?? '').slice(0, 120);
const probar = async (etiqueta, fn) => {
  try {
    console.log('OK   ', etiqueta, '->', corto(await fn()));
  } catch (e) {
    console.log('ERROR', etiqueta, '->', e.constructor.name, e.status, '|', e.message);
  }
};

const futura = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
const datosOk = {
  titulo: 'Landing page nueva',
  descripcion: 'Necesito una landing page responsiva para mi negocio',
  presupuesto: 450.5,
  id_categoria: 1,
  fecha_entrega: futura
};

// ---------- listar proyectos ----------
console.log('--- listar proyectos ---');
const listar = new ListarProyectos(proyectoRepository);
await probar('categoría no numérica (400)', () => listar.execute({ id_categoria: 'abc' }));
await probar('presupuesto_min negativo (400)', () => listar.execute({ presupuesto_min: '-10' }));
await probar('mínimo mayor que máximo (400)', () => listar.execute({ presupuesto_min: '500', presupuesto_max: '100' }));
await probar('filtros válidos (OK)', () => listar.execute({ id_categoria: '2', presupuesto_max: '900' }));
console.log('       el repositorio recibió un ProyectoSpecification:', especificacionRecibida instanceof ProyectoSpecification, corto(especificacionRecibida));

// ---------- proyectos ----------
console.log('--- proyectos ---');
await probar('obtener inexistente (404)', () => new ObtenerProyecto(proyectoRepository).execute(999));
await probar('obtener existente (OK)', () => new ObtenerProyecto(proyectoRepository).execute(1));

const crear = new CrearProyecto(proyectoRepository);
await probar('crear: faltan campos (400)', () => crear.execute(7, { titulo: 'Hola' }));
await probar('crear: presupuesto negativo (400)', () => crear.execute(7, { ...datosOk, presupuesto: -5 }));
await probar('crear: título corto (400)', () => crear.execute(7, { ...datosOk, titulo: 'abc' }));
await probar('crear: descripción corta (400)', () => crear.execute(7, { ...datosOk, descripcion: 'muy corta' }));
await probar('crear: 3 decimales (400)', () => crear.execute(7, { ...datosOk, presupuesto: '10.555' }));
await probar('crear: fecha pasada (400)', () => crear.execute(7, { ...datosOk, fecha_entrega: '2020-01-01' }));
await probar('crear: formato de fecha (400)', () => crear.execute(7, { ...datosOk, fecha_entrega: '30/12/2026' }));
await probar('crear válido (OK)', () => crear.execute(7, datosOk));

const actualizar = new ActualizarProyecto(proyectoRepository);
await probar('actualizar inexistente (404)', () => actualizar.execute(999, 7, datosOk));
await probar('actualizar de otro cliente (403)', () => actualizar.execute(1, 8, datosOk));
await probar('actualizar sin categoría (400)', () => actualizar.execute(1, 7, { ...datosOk, id_categoria: undefined }));
await probar('actualizar válido (OK)', () => actualizar.execute(1, 7, datosOk));

const cancelar = new CancelarProyecto(proyectoRepository);
await probar('cancelar inexistente (404)', () => cancelar.execute(999, 7));
await probar('cancelar de otro cliente (403)', () => cancelar.execute(1, 8));
await probar('cancelar ya finalizado (400)', () => cancelar.execute(2, 7));
await probar('cancelar abierto (OK)', () => cancelar.execute(1, 7));

await probar('eliminar inexistente (404)', () => new EliminarProyecto(proyectoRepository).execute(999));
await probar('eliminar existente (OK)', () => new EliminarProyecto(proyectoRepository).execute(1));

// ---------- propuestas ----------
console.log('--- propuestas ---');
const enviar = new EnviarPropuesta({ propuestaRepository, proyectoRepository });
const propOk = { id_proyecto: 1, mensaje: 'Puedo entregarlo en cinco días con diseño responsivo', monto_propuesto: 400 };

await probar('enviar: faltan campos (400)', () => enviar.execute(4, { id_proyecto: 1 }));
await probar('enviar: monto negativo (400)', () => enviar.execute(4, { ...propOk, monto_propuesto: -1 }));
await probar('enviar: mensaje corto (400)', () => enviar.execute(4, { ...propOk, mensaje: 'hola' }));
await probar('enviar: 3 decimales (400)', () => enviar.execute(4, { ...propOk, monto_propuesto: '10.555' }));
await probar('enviar: proyecto inexistente (404)', () => enviar.execute(4, { ...propOk, id_proyecto: 999 }));
await probar('enviar: monto sobre el presupuesto (400)', () => enviar.execute(4, { ...propOk, monto_propuesto: 900 }));
await probar('enviar válida (OK)', () => enviar.execute(4, propOk));

await probar('retirar ajena (404)', () => new RetirarPropuesta(propuestaRepository).execute(5, 1));
await probar('retirar propia (OK)', () => new RetirarPropuesta(propuestaRepository).execute(4, 1));
await probar('rechazar de otro cliente (404)', () => new RechazarPropuesta(propuestaRepository).execute(8, 1));
await probar('rechazar propia (OK)', () => new RechazarPropuesta(propuestaRepository).execute(7, 1));
await probar('listar propuestas del proyecto (OK)', () => new ListarPropuestasDeProyecto(propuestaRepository).execute(1));
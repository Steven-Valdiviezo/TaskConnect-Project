import { AceptarPropuesta } from '../src/application/use-cases/commands/contrato/aceptar-propuesta.js';
import { CompletarContrato } from '../src/application/use-cases/commands/contrato/completar-contrato.js';
import { CancelarContrato } from '../src/application/use-cases/commands/contrato/cancelar-contrato.js';
import { RegistrarPago } from '../src/application/use-cases/commands/pago/registrar-pago.js';
import { MarcarPagoPagado } from '../src/application/use-cases/commands/pago/marcar-pago-pagado.js';
import { ObtenerPagoDeContrato } from '../src/application/use-cases/queries/pago/obtener-pago-de-contrato.js';
import { EnviarMensaje } from '../src/application/use-cases/commands/mensaje/enviar-mensaje.js';
import { MarcarMensajeLeido } from '../src/application/use-cases/commands/mensaje/marcar-mensaje-leido.js';
import { RegistrarCalificacion } from '../src/application/use-cases/commands/calificacion/registrar-calificacion.js';
import { ObtenerEstadisticasPublicas } from '../src/application/use-cases/queries/estadisticas/obtener-estadisticas-publicas.js';
import { ObtenerEstadisticasAdmin } from '../src/application/use-cases/queries/estadisticas/obtener-estadisticas-admin.js';

// ---------- fakes en memoria ----------
const propuestasBD = {
  1: { id_propuesta: 1, id_proyecto: 1, id_freelancer: 4, estado: 'pendiente', id_cliente: 7, nombre_freelancer: 'LUIS RUIZ', estado_freelancer: 'activo' },
  2: { id_propuesta: 2, id_proyecto: 2, id_freelancer: 4, estado: 'aceptada', id_cliente: 7, nombre_freelancer: 'LUIS RUIZ', estado_freelancer: 'activo' },
  3: { id_propuesta: 3, id_proyecto: 3, id_freelancer: 5, estado: 'pendiente', id_cliente: 7, nombre_freelancer: 'MARIO DIAZ', estado_freelancer: 'inactivo' },
  4: { id_propuesta: 4, id_proyecto: 4, id_freelancer: 4, estado: 'pendiente', id_cliente: 8, nombre_freelancer: 'LUIS RUIZ', estado_freelancer: 'activo' }
};
const contratosBD = {
  1: { id_contrato: 1, estado_contrato: 'activo', id_cliente: 7, nombre_freelancer: 'LUIS RUIZ', estado_freelancer: 'activo' },
  2: { id_contrato: 2, estado_contrato: 'activo', id_cliente: 7, nombre_freelancer: 'MARIO DIAZ', estado_freelancer: 'inactivo' }
};
const contratoRepository = {
  obtenerPropuestaParaContrato: async (id) => propuestasBD[id],
  crear: async (d) => ({ id_contrato: 30, ...d, estado: 'activo' }),
  obtenerConFreelancer: async (id) => contratosBD[id],
  actualizarEstado: async (id, estado, fecha_fin) => ({ id_contrato: id, estado, fecha_fin })
};

const pagosBD = { 1: { id_pago: 1, id_contrato: 1, estado: 'pendiente' }, 2: { id_pago: 2, id_contrato: 1, estado: 'pagado' } };
const pagoRepository = {
  obtenerContratoConCliente: async (id) => (id === 1 ? { id_contrato: 1, estado_contrato: 'activo', id_cliente: 7, presupuesto: 500 } : id === 5 ? { id_contrato: 5, id_cliente: 8 } : undefined),
  crear: async (d) => ({ id_pago: 60, ...d, comision: Number(d.monto) * 0.1, estado: 'pendiente' }),
  buscarPorId: async (id) => pagosBD[id],
  buscarPorContrato: async (id) => (id === 1 ? pagosBD[1] : null),
  marcarPagado: async (id) => ({ ...pagosBD[id], estado: 'pagado' })
};

const mensajeRepository = {
  crear: async (d) => ({ id_mensaje: 70, ...d, leido: false }),
  marcarLeido: async (id, dest) => (id === 1 && dest === 2 ? { id_mensaje: 1, leido: true } : undefined)
};

const calificacionRepository = {
  obtenerContratoParaCalificar: async (id) => (id === 1 ? { id_contrato: 1, estado_contrato: 'completado', id_usuario_cliente: 10, id_usuario_freelancer: 11 } : undefined),
  crear: async (d) => ({ id_calificacion: 90, ...d })
};

const estadisticasRepository = {
  contarUsuariosPorRol: async () => [{ rol: 'cliente', total: 5 }, { rol: 'freelancer', total: 5 }, { rol: 'administrador', total: 5 }],
  contarProyectos: async () => ({ total: 14, total_abiertos: 3, total_finalizados: 9 }),
  contarCategorias: async () => 7,
  contarUsuariosDetallado: async () => [{ rol: 'administrador', estado: 'activo', total: 5 }, { rol: 'freelancer', estado: 'activo', total: 5 }, { rol: 'cliente', estado: 'activo', total: 5 }],
  contarProyectosDetallado: async () => ({ total: 14 }),
  proyectosPorCategoria: async () => [],
  freelancersPorProfesion: async () => [],
  contarPropuestas: async () => ({ total: 13, total_aceptadas: 11 }),
  contarContratos: async () => ({ total: 11, total_activos: 2, total_completados: 9 }),
  sumarPagos: async () => ({ total_pagado: '1430.00', total_comision: '143.00', total_iva: '0.00' })
};

// ---------- helper ----------
const corto = (r) => (JSON.stringify(r) ?? '').slice(0, 130);
const probar = async (etiqueta, fn) => {
  try {
    console.log('OK   ', etiqueta, '->', corto(await fn()));
  } catch (e) {
    console.log('ERROR', etiqueta, '->', e.constructor.name, e.status, '|', e.message);
  }
};

// ---------- contratos ----------
console.log('--- contratos ---');
const aceptar = new AceptarPropuesta(contratoRepository);
await probar('aceptar inexistente (404)', () => aceptar.execute(7, 999));
await probar('aceptar propuesta de otro cliente (403)', () => aceptar.execute(7, 4));
await probar('aceptar ya aceptada (400)', () => aceptar.execute(7, 2));
await probar('aceptar con freelancer inactivo (409)', () => aceptar.execute(7, 3));
await probar('aceptar válida (OK)', () => aceptar.execute(7, 1));

const completar = new CompletarContrato(contratoRepository);
await probar('completar inexistente (404)', () => completar.execute(7, 999));
await probar('completar contrato ajeno (403)', () => completar.execute(8, 1));
await probar('completar con freelancer inactivo (409)', () => completar.execute(7, 2));
await probar('completar propio (OK, con fecha_fin)', () => completar.execute(7, 1));

const cancelar = new CancelarContrato(contratoRepository);
await probar('cancelar inexistente (404)', () => cancelar.execute(7, 999));
await probar('cancelar contrato ajeno (403)', () => cancelar.execute(8, 1));
await probar('cancelar propio (OK)', () => cancelar.execute(7, 1));

// ---------- pagos ----------
console.log('--- pagos ---');
const registrarPago = new RegistrarPago(pagoRepository);
await probar('pago: faltan campos (400)', () => registrarPago.execute(7, { id_contrato: 1 }));
await probar('pago: monto negativo (400)', () => registrarPago.execute(7, { id_contrato: 1, id_metodo_pago: 1, monto: -5 }));
await probar('pago: 3 decimales (400)', () => registrarPago.execute(7, { id_contrato: 1, id_metodo_pago: 1, monto: '10.555' }));
await probar('pago: id no entero (400)', () => registrarPago.execute(7, { id_contrato: 'abc', id_metodo_pago: 1, monto: 100 }));
await probar('pago: contrato inexistente (404)', () => registrarPago.execute(7, { id_contrato: 99, id_metodo_pago: 1, monto: 100 }));
await probar('pago: contrato de otro cliente (403)', () => registrarPago.execute(7, { id_contrato: 5, id_metodo_pago: 1, monto: 100 }));
await probar('pago válido (OK)', () => registrarPago.execute(7, { id_contrato: 1, id_metodo_pago: 1, monto: 280 }));

const marcarPagado = new MarcarPagoPagado(pagoRepository);
await probar('marcar pago inexistente (404)', () => marcarPagado.execute(7, 99));
await probar('marcar pago de otro cliente (403)', () => marcarPagado.execute(8, 1));
await probar('marcar pago ya pagado (400)', () => marcarPagado.execute(7, 2));
await probar('marcar pago pendiente (OK)', () => marcarPagado.execute(7, 1));

const verPago = new ObtenerPagoDeContrato(pagoRepository);
await probar('pago de contrato sin pago (404)', () => verPago.execute(99));
await probar('pago de contrato con pago (OK)', () => verPago.execute(1));

// ---------- mensajes ----------
console.log('--- mensajes ---');
const enviar = new EnviarMensaje(mensajeRepository);
await probar('mensaje vacío (400)', () => enviar.execute(10, { destinatario: 11, contenido: '   ' }));
await probar('mensaje de 1001 caracteres (400)', () => enviar.execute(10, { destinatario: 11, contenido: 'x'.repeat(1001) }));
await probar('destinatario inválido (400)', () => enviar.execute(10, { destinatario: 'abc', contenido: 'Hola' }));
await probar('mensaje a sí mismo (400)', () => enviar.execute(10, { destinatario: 10, contenido: 'Hola' }));
await probar('mensaje válido (OK, sin espacios sobrantes)', () => enviar.execute(10, { destinatario: 11, contenido: '  Hola, ¿cómo vas?  ' }));
await probar('marcar leído ajeno (404)', () => new MarcarMensajeLeido(mensajeRepository).execute(1, 3));
await probar('marcar leído propio (OK)', () => new MarcarMensajeLeido(mensajeRepository).execute(1, 2));

// ---------- calificaciones ----------
console.log('--- calificaciones ---');
const calificar = new RegistrarCalificacion(calificacionRepository);
const cliente = { id_usuario: 10, rol: 'cliente' };
await probar('calificar siendo freelancer (403)', () => calificar.execute({ id_usuario: 11, rol: 'freelancer' }, { id_contrato: 1, puntuacion: 5 }));
await probar('calificar: faltan campos (400)', () => calificar.execute(cliente, { id_contrato: 1 }));
await probar('calificar: puntuación 6 (400)', () => calificar.execute(cliente, { id_contrato: 1, puntuacion: 6 }));
await probar('calificar: puntuación 3.5 (400)', () => calificar.execute(cliente, { id_contrato: 1, puntuacion: 3.5 }));
await probar('calificar: comentario de 501 caracteres (400)', () => calificar.execute(cliente, { id_contrato: 1, puntuacion: 4, comentario: 'x'.repeat(501) }));
await probar('calificar contrato inexistente (404)', () => calificar.execute(cliente, { id_contrato: 99, puntuacion: 4 }));
await probar('calificar contrato de otro cliente (403)', () => calificar.execute({ id_usuario: 99, rol: 'cliente' }, { id_contrato: 1, puntuacion: 4 }));
await probar('calificar válido sin comentario (OK, comentario null)', () => calificar.execute(cliente, { id_contrato: 1, puntuacion: '5', comentario: '   ' }));

// ---------- estadísticas ----------
console.log('--- estadísticas ---');
await probar('públicas', () => new ObtenerEstadisticasPublicas(estadisticasRepository).execute());
await probar('admin (usuarios = clientes + freelancers, montos como número)', () => new ObtenerEstadisticasAdmin(estadisticasRepository).execute());
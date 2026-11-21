import { AppDataSource as ds } from '../src/infrastructure/database/data-source.js';
import { TypeOrmUsuarioRepository } from '../src/infrastructure/repositories/typeorm-usuario-repository.js';
import { TypeOrmProyectoRepository } from '../src/infrastructure/repositories/typeorm-proyecto-repository.js';
import { TypeOrmPropuestaRepository } from '../src/infrastructure/repositories/typeorm-propuesta-repository.js';
import { TypeOrmContratoRepository } from '../src/infrastructure/repositories/typeorm-contrato-repository.js';
import { TypeOrmPagoRepository } from '../src/infrastructure/repositories/typeorm-pago-repository.js';
import { TypeOrmMensajeRepository } from '../src/infrastructure/repositories/typeorm-mensaje-repository.js';
import { TypeOrmCalificacionRepository } from '../src/infrastructure/repositories/typeorm-calificacion-repository.js';
import { TypeOrmAuditoriaRepository } from '../src/infrastructure/repositories/typeorm-auditoria-repository.js';
import { TypeOrmEstadisticasRepository } from '../src/infrastructure/repositories/typeorm-estadisticas-repository.js';

await ds.initialize();

const usuarios = new TypeOrmUsuarioRepository(ds);
const proyectos = new TypeOrmProyectoRepository(ds);
const propuestas = new TypeOrmPropuestaRepository(ds);
const contratos = new TypeOrmContratoRepository(ds);
const pagos = new TypeOrmPagoRepository(ds);
const mensajes = new TypeOrmMensajeRepository(ds);
const calificaciones = new TypeOrmCalificacionRepository(ds);
const auditoria = new TypeOrmAuditoriaRepository(ds);
const estadisticas = new TypeOrmEstadisticasRepository(ds);

const resumen = (lista) => ({ total: lista.length, primero: lista[0] });

// ---- proyectos ----
const todos = await proyectos.listar({});
console.log('\n== PROYECTOS ==\nlistar:', resumen(todos));
console.log('con presupuesto_min=100:', (await proyectos.listar({ presupuesto_min: 100 })).length);
const p = await proyectos.buscarPorId(todos[0].id_proyecto);
console.log('buscarPorId:', p);
console.log('dueño:', await proyectos.obtenerDueno(p.id_proyecto));
console.log('del cliente:', resumen(await proyectos.listarPorCliente(p.id_cliente)));

// ---- propuestas ----
console.log('\n== PROPUESTAS ==');
console.log('del proyecto:', resumen(await propuestas.listarPorProyecto(p.id_proyecto)));
console.log('recibidas por el cliente:', resumen(await propuestas.listarPorCliente(p.id_cliente)));

// ---- freelancer (consultas de la parte A que faltaban) ----
const fl = (await ds.getRepository('Freelancer').find({ take: 1 }))[0];
console.log('\n== FREELANCER ==');
console.log('datos:', await usuarios.obtenerDatosFreelancer(fl.id_usuario));
console.log('perfil público:', await usuarios.obtenerPerfilPublicoFreelancer(fl.id_freelancer));
console.log('perfil con contacto:', await usuarios.obtenerPerfilFreelancerConContacto(fl.id_freelancer));
console.log('propuestas enviadas:', resumen(await propuestas.listarPorFreelancer(fl.id_freelancer)));
console.log('reputación:', await calificaciones.obtenerReputacionFreelancer(fl.id_freelancer));
console.log('calificaciones recibidas:', resumen(await calificaciones.listarDeUsuario(fl.id_usuario)));

// ---- contratos, pagos, mensajes ----
const cliente = await ds.getRepository('Cliente').findOneBy({ id_cliente: p.id_cliente });
const contratosCli = await contratos.listarPorUsuario(cliente.id_usuario, 'cliente');
const contratosFl = await contratos.listarPorUsuario(fl.id_usuario, 'freelancer');
console.log('\n== CONTRATOS ==\ncomo cliente:', resumen(contratosCli));
console.log('como freelancer:', resumen(contratosFl));

if (contratosCli.length) {
  const c = contratosCli[0];
  console.log('con freelancer:', await contratos.obtenerConFreelancer(c.id_contrato));
  console.log('para pago:', await pagos.obtenerContratoConCliente(c.id_contrato));
  console.log('para calificar:', await calificaciones.obtenerContratoParaCalificar(c.id_contrato));
  console.log('pago del contrato:', await pagos.buscarPorContrato(c.id_contrato));
  console.log('conversación:', resumen(await mensajes.obtenerConversacion(cliente.id_usuario, c.id_usuario_contraparte)));
  console.log('existe contrato cliente-freelancer:', await contratos.existeEntreClienteYFreelancer(cliente.id_cliente, c.id_freelancer));
}
console.log('no leídos del cliente:', await mensajes.contarNoLeidos(cliente.id_usuario));
console.log('calificaciones emitidas:', resumen(await calificaciones.listarEmitidasPorUsuario(cliente.id_usuario)));

// ---- auditoría y estadísticas ----
console.log('\n== AUDITORÍA / ESTADÍSTICAS ==');
console.log('auditoría (3):', resumen(await auditoria.listar({ limite: 3 })));
console.log('públicas:', await estadisticas.contarUsuariosPorRol(), await estadisticas.contarProyectos(), await estadisticas.contarCategorias());
console.log('admin:', await estadisticas.contarUsuariosDetallado(), await estadisticas.contarProyectosDetallado(),
  await estadisticas.contarPropuestas(), await estadisticas.contarContratos(), await estadisticas.sumarPagos());

await ds.destroy();
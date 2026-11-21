// ---------- adaptadores de salida: repositorios ----------
import { TypeOrmUsuarioRepository } from '../infrastructure/repositories/typeorm-usuario-repository.js';
import { TypeOrmToken2faRepository } from '../infrastructure/repositories/typeorm-token-2fa-repository.js';
import { TypeOrmProyectoRepository } from '../infrastructure/repositories/typeorm-proyecto-repository.js';
import { TypeOrmPropuestaRepository } from '../infrastructure/repositories/typeorm-propuesta-repository.js';
import { TypeOrmContratoRepository } from '../infrastructure/repositories/typeorm-contrato-repository.js';
import { TypeOrmPagoRepository } from '../infrastructure/repositories/typeorm-pago-repository.js';
import { TypeOrmMensajeRepository } from '../infrastructure/repositories/typeorm-mensaje-repository.js';
import { TypeOrmCalificacionRepository } from '../infrastructure/repositories/typeorm-calificacion-repository.js';
import { TypeOrmCategoriaRepository } from '../infrastructure/repositories/typeorm-categoria-repository.js';
import { TypeOrmProfesionRepository } from '../infrastructure/repositories/typeorm-profesion-repository.js';
import { TypeOrmMetodoPagoRepository } from '../infrastructure/repositories/typeorm-metodo-pago-repository.js';
import { TypeOrmConfiguracionRepository } from '../infrastructure/repositories/typeorm-configuracion-repository.js';
import { TypeOrmAuditoriaRepository } from '../infrastructure/repositories/typeorm-auditoria-repository.js';
import { TypeOrmEstadisticasRepository } from '../infrastructure/repositories/typeorm-estadisticas-repository.js';

// ---------- adaptadores de salida: servicios externos ----------
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenService } from '../infrastructure/security/jwt-token-service.js';
import { BrevoMailSender } from '../infrastructure/mail/brevo-mail-sender.js';
import { DnsDominioCorreoVerificador } from '../infrastructure/dns/dns-dominio-correo-verificador.js';

// ---------- casos de uso: usuario ----------
import { RegistrarUsuario } from '../application/use-cases/commands/usuario/registrar-usuario.js';
import { LoginUsuario } from '../application/use-cases/commands/usuario/login-usuario.js';
import { ConfirmarLogin2FA } from '../application/use-cases/commands/usuario/confirmar-login-2fa.js';
import { LoginPrueba } from '../application/use-cases/commands/usuario/login-prueba.js';
import { ActualizarPerfil } from '../application/use-cases/commands/usuario/actualizar-perfil.js';
import { ObtenerPerfil } from '../application/use-cases/queries/usuario/obtener-perfil.js';
import { ObtenerPerfilPublicoFreelancer } from '../application/use-cases/queries/usuario/obtener-perfil-publico-freelancer.js';
import { ObtenerPerfilFreelancerConContacto } from '../application/use-cases/queries/usuario/obtener-perfil-freelancer-con-contacto.js';

// ---------- casos de uso: proyecto ----------
import { CrearProyecto } from '../application/use-cases/commands/proyecto/crear-proyecto.js';
import { ActualizarProyecto } from '../application/use-cases/commands/proyecto/actualizar-proyecto.js';
import { CancelarProyecto } from '../application/use-cases/commands/proyecto/cancelar-proyecto.js';
import { EliminarProyecto } from '../application/use-cases/commands/proyecto/eliminar-proyecto.js';
import { ListarProyectos } from '../application/use-cases/queries/proyecto/listar-proyectos.js';
import { ObtenerProyecto } from '../application/use-cases/queries/proyecto/obtener-proyecto.js';
import { ListarMisProyectos } from '../application/use-cases/queries/proyecto/listar-mis-proyectos.js';

// ---------- casos de uso: propuesta ----------
import { EnviarPropuesta } from '../application/use-cases/commands/propuesta/enviar-propuesta.js';
import { RetirarPropuesta } from '../application/use-cases/commands/propuesta/retirar-propuesta.js';
import { RechazarPropuesta } from '../application/use-cases/commands/propuesta/rechazar-propuesta.js';
import { ListarPropuestasDeProyecto } from '../application/use-cases/queries/propuesta/listar-propuestas-de-proyecto.js';
import { ListarPropuestasDelCliente } from '../application/use-cases/queries/propuesta/listar-propuestas-del-cliente.js';
import { ListarPropuestasDelFreelancer } from '../application/use-cases/queries/propuesta/listar-propuestas-del-freelancer.js';

// ---------- casos de uso: contrato, pago, mensaje, calificación ----------
import { AceptarPropuesta } from '../application/use-cases/commands/contrato/aceptar-propuesta.js';
import { CompletarContrato } from '../application/use-cases/commands/contrato/completar-contrato.js';
import { CancelarContrato } from '../application/use-cases/commands/contrato/cancelar-contrato.js';
import { ListarMisContratos } from '../application/use-cases/queries/contrato/listar-mis-contratos.js';
import { RegistrarPago } from '../application/use-cases/commands/pago/registrar-pago.js';
import { MarcarPagoPagado } from '../application/use-cases/commands/pago/marcar-pago-pagado.js';
import { ObtenerPagoDeContrato } from '../application/use-cases/queries/pago/obtener-pago-de-contrato.js';
import { EnviarMensaje } from '../application/use-cases/commands/mensaje/enviar-mensaje.js';
import { MarcarMensajeLeido } from '../application/use-cases/commands/mensaje/marcar-mensaje-leido.js';
import { ObtenerConversacion } from '../application/use-cases/queries/mensaje/obtener-conversacion.js';
import { ContarMensajesNoLeidos } from '../application/use-cases/queries/mensaje/contar-mensajes-no-leidos.js';
import { RegistrarCalificacion } from '../application/use-cases/commands/calificacion/registrar-calificacion.js';
import { ListarCalificacionesRecibidas } from '../application/use-cases/queries/calificacion/listar-calificaciones-recibidas.js';
import { ListarCalificacionesEmitidas } from '../application/use-cases/queries/calificacion/listar-calificaciones-emitidas.js';
import { ObtenerReputacion } from '../application/use-cases/queries/calificacion/obtener-reputacion.js';

// ---------- casos de uso: catálogo, administración, estadísticas ----------
import { ListarCategorias } from '../application/use-cases/queries/catalogo/listar-categorias.js';
import { CrearCategoria } from '../application/use-cases/commands/catalogo/crear-categoria.js';
import { ActualizarCategoria } from '../application/use-cases/commands/catalogo/actualizar-categoria.js';
import { EliminarCategoria } from '../application/use-cases/commands/catalogo/eliminar-categoria.js';
import { ListarProfesiones } from '../application/use-cases/queries/catalogo/listar-profesiones.js';
import { CrearProfesion } from '../application/use-cases/commands/catalogo/crear-profesion.js';
import { ActualizarProfesion } from '../application/use-cases/commands/catalogo/actualizar-profesion.js';
import { EliminarProfesion } from '../application/use-cases/commands/catalogo/eliminar-profesion.js';
import { ListarMetodosPago } from '../application/use-cases/queries/catalogo/listar-metodos-pago.js';
import { CrearMetodoPago } from '../application/use-cases/commands/catalogo/crear-metodo-pago.js';
import { ActualizarMetodoPago } from '../application/use-cases/commands/catalogo/actualizar-metodo-pago.js';
import { EliminarMetodoPago } from '../application/use-cases/commands/catalogo/eliminar-metodo-pago.js';
import { ObtenerTarifaIva } from '../application/use-cases/queries/catalogo/obtener-tarifa-iva.js';
import { ListarUsuarios } from '../application/use-cases/queries/admin/listar-usuarios.js';
import { ListarAuditoria } from '../application/use-cases/queries/admin/listar-auditoria.js';
import { DesactivarUsuario } from '../application/use-cases/commands/admin/desactivar-usuario.js';
import { ReactivarUsuario } from '../application/use-cases/commands/admin/reactivar-usuario.js';
import { ObtenerEstadisticasPublicas } from '../application/use-cases/queries/estadisticas/obtener-estadisticas-publicas.js';
import { ObtenerEstadisticasAdmin } from '../application/use-cases/queries/estadisticas/obtener-estadisticas-admin.js';

// ---------- controllers ----------
import { UsuarioController } from '../presentation/controllers/usuario.controller.js';
import { ProyectoController } from '../presentation/controllers/proyecto.controller.js';
import { PropuestaController } from '../presentation/controllers/propuesta.controller.js';
import { ContratoController } from '../presentation/controllers/contrato.controller.js';
import { PagoController } from '../presentation/controllers/pago.controller.js';
import { MensajeController } from '../presentation/controllers/mensaje.controller.js';
import { CalificacionController } from '../presentation/controllers/calificacion.controller.js';
import { CatalogoController } from '../presentation/controllers/catalogo.controller.js';
import { AdminController } from '../presentation/controllers/admin.controller.js';
import { EstadisticasController } from '../presentation/controllers/estadisticas.controller.js';

export const crearContenedor = ({ dataSource, config }) => {
  // ===== repositorios =====
  const usuarioRepository = new TypeOrmUsuarioRepository(dataSource);
  const token2faRepository = new TypeOrmToken2faRepository(dataSource);
  const proyectoRepository = new TypeOrmProyectoRepository(dataSource);
  const propuestaRepository = new TypeOrmPropuestaRepository(dataSource);
  const contratoRepository = new TypeOrmContratoRepository(dataSource);
  const pagoRepository = new TypeOrmPagoRepository(dataSource);
  const mensajeRepository = new TypeOrmMensajeRepository(dataSource);
  const calificacionRepository = new TypeOrmCalificacionRepository(dataSource);
  const categoriaRepository = new TypeOrmCategoriaRepository(dataSource);
  const profesionRepository = new TypeOrmProfesionRepository(dataSource);
  const metodoPagoRepository = new TypeOrmMetodoPagoRepository(dataSource);
  const configuracionRepository = new TypeOrmConfiguracionRepository(dataSource);
  const auditoriaRepository = new TypeOrmAuditoriaRepository(dataSource);
  const estadisticasRepository = new TypeOrmEstadisticasRepository(dataSource);

  // ===== servicios externos =====
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(config.jwt);
  const mailSender = new BrevoMailSender(config.brevo);
  const dominioCorreoVerificador = new DnsDominioCorreoVerificador();

  // ===== controllers (cada uno con sus casos de uso) =====
  const usuario = new UsuarioController({
    registrarUsuario: new RegistrarUsuario({
      usuarioRepository, passwordHasher, dominioCorreoVerificador, verificarDns: config.verificarDnsCorreo
    }),
    loginUsuario: new LoginUsuario({
      usuarioRepository, token2faRepository, passwordHasher, mailSender,
      config: { frontendUrl: config.frontendUrl, minutosExpiracion: config.magicLink.minutosExpiracion }
    }),
    confirmarLogin2FA: new ConfirmarLogin2FA({ usuarioRepository, token2faRepository, tokenService }),
    loginPrueba: new LoginPrueba({
      usuarioRepository, passwordHasher, tokenService, permitirLoginPrueba: config.permitirLoginPrueba
    }),
    obtenerPerfil: new ObtenerPerfil(usuarioRepository),
    actualizarPerfil: new ActualizarPerfil(usuarioRepository),
    obtenerPerfilPublicoFreelancer: new ObtenerPerfilPublicoFreelancer(usuarioRepository),
    obtenerPerfilFreelancerConContacto: new ObtenerPerfilFreelancerConContacto({ usuarioRepository, contratoRepository })
  });

  const proyecto = new ProyectoController({
    listarProyectos: new ListarProyectos(proyectoRepository),
    obtenerProyecto: new ObtenerProyecto(proyectoRepository),
    crearProyecto: new CrearProyecto(proyectoRepository),
    actualizarProyecto: new ActualizarProyecto(proyectoRepository),
    cancelarProyecto: new CancelarProyecto(proyectoRepository),
    listarMisProyectos: new ListarMisProyectos(proyectoRepository),
    eliminarProyecto: new EliminarProyecto(proyectoRepository)
  });

  const propuesta = new PropuestaController({
    listarPropuestasDeProyecto: new ListarPropuestasDeProyecto(propuestaRepository),
    listarPropuestasDelCliente: new ListarPropuestasDelCliente(propuestaRepository),
    listarPropuestasDelFreelancer: new ListarPropuestasDelFreelancer(propuestaRepository),
    enviarPropuesta: new EnviarPropuesta({ propuestaRepository, proyectoRepository }),
    retirarPropuesta: new RetirarPropuesta(propuestaRepository),
    rechazarPropuesta: new RechazarPropuesta(propuestaRepository)
  });

  const contrato = new ContratoController({
    aceptarPropuesta: new AceptarPropuesta(contratoRepository),
    listarMisContratos: new ListarMisContratos(contratoRepository),
    completarContrato: new CompletarContrato(contratoRepository),
    cancelarContrato: new CancelarContrato(contratoRepository)
  });

  const pago = new PagoController({
    registrarPago: new RegistrarPago(pagoRepository),
    marcarPagoPagado: new MarcarPagoPagado(pagoRepository),
    obtenerPagoDeContrato: new ObtenerPagoDeContrato(pagoRepository)
  });

  const mensaje = new MensajeController({
    enviarMensaje: new EnviarMensaje(mensajeRepository),
    obtenerConversacion: new ObtenerConversacion(mensajeRepository),
    marcarMensajeLeido: new MarcarMensajeLeido(mensajeRepository),
    contarMensajesNoLeidos: new ContarMensajesNoLeidos(mensajeRepository)
  });

  const calificacion = new CalificacionController({
    registrarCalificacion: new RegistrarCalificacion(calificacionRepository),
    listarCalificacionesRecibidas: new ListarCalificacionesRecibidas(calificacionRepository),
    listarCalificacionesEmitidas: new ListarCalificacionesEmitidas(calificacionRepository),
    obtenerReputacion: new ObtenerReputacion(calificacionRepository)
  });

  const catalogo = new CatalogoController({
    listarCategorias: new ListarCategorias(categoriaRepository),
    crearCategoria: new CrearCategoria(categoriaRepository),
    actualizarCategoria: new ActualizarCategoria(categoriaRepository),
    eliminarCategoria: new EliminarCategoria(categoriaRepository),
    listarProfesiones: new ListarProfesiones(profesionRepository),
    crearProfesion: new CrearProfesion(profesionRepository),
    actualizarProfesion: new ActualizarProfesion(profesionRepository),
    eliminarProfesion: new EliminarProfesion(profesionRepository),
    listarMetodosPago: new ListarMetodosPago(metodoPagoRepository),
    crearMetodoPago: new CrearMetodoPago(metodoPagoRepository),
    actualizarMetodoPago: new ActualizarMetodoPago(metodoPagoRepository),
    eliminarMetodoPago: new EliminarMetodoPago(metodoPagoRepository),
    obtenerTarifaIva: new ObtenerTarifaIva(configuracionRepository)
  });

  const admin = new AdminController({
    listarUsuarios: new ListarUsuarios(usuarioRepository),
    desactivarUsuario: new DesactivarUsuario(usuarioRepository),
    reactivarUsuario: new ReactivarUsuario(usuarioRepository),
    listarAuditoria: new ListarAuditoria(auditoriaRepository),
    obtenerEstadisticasAdmin: new ObtenerEstadisticasAdmin(estadisticasRepository)
  });

  const estadisticas = new EstadisticasController({
    obtenerEstadisticasPublicas: new ObtenerEstadisticasPublicas(estadisticasRepository)
  });

  return {
    tokenService,
    controllers: { usuario, proyecto, propuesta, contrato, pago, mensaje, calificacion, catalogo, admin, estadisticas }
  };
};
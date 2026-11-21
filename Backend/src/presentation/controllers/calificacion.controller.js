export class CalificacionController {
  // casos: { registrarCalificacion, listarCalificacionesRecibidas, obtenerReputacion, listarCalificacionesEmitidas }
  constructor(casos) {
    this.casos = casos;
  }

  registrar = async (req, res) => {
    const calificacion = await this.casos.registrarCalificacion.execute(req.usuario, req.body);
    res.status(201).json({ mensaje: 'Calificación registrada correctamente', calificacion });
  };

  listarRecibidas = async (req, res) => {
    const calificaciones = await this.casos.listarCalificacionesRecibidas.execute(Number(req.params.idUsuario));
    res.json({ mensaje: 'Calificaciones recibidas', total: calificaciones.length, calificaciones });
  };

  obtenerReputacion = async (req, res) => {
    const reputacion = await this.casos.obtenerReputacion.execute(Number(req.params.idFreelancer));
    res.json({ mensaje: 'Reputación del freelancer', reputacion });
  };

  listarEmitidas = async (req, res) => {
    const calificaciones = await this.casos.listarCalificacionesEmitidas.execute(req.usuario.id_usuario);
    res.json({ mensaje: 'Calificaciones emitidas', total: calificaciones.length, calificaciones });
  };
}
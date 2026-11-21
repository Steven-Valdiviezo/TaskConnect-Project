export class PropuestaController {
  // casos: { listarPropuestasDeProyecto, listarPropuestasDelCliente, listarPropuestasDelFreelancer,
  //          enviarPropuesta, retirarPropuesta, rechazarPropuesta }
  constructor(casos) {
    this.casos = casos;
  }

  listarDeProyecto = async (req, res) => {
    const propuestas = await this.casos.listarPropuestasDeProyecto.execute(Number(req.params.idProyecto));
    res.json({ mensaje: 'Propuestas del proyecto', total: propuestas.length, propuestas });
  };

  listarRecibidas = async (req, res) => {
    const propuestas = await this.casos.listarPropuestasDelCliente.execute(req.usuario.id_cliente);
    res.json({ mensaje: 'Propuestas recibidas en todos tus proyectos', total: propuestas.length, propuestas });
  };

  listarEnviadas = async (req, res) => {
    const propuestas = await this.casos.listarPropuestasDelFreelancer.execute(req.usuario.id_freelancer);
    res.json({ mensaje: 'Mis propuestas enviadas', total: propuestas.length, propuestas });
  };

  enviar = async (req, res) => {
    const propuesta = await this.casos.enviarPropuesta.execute(req.usuario.id_freelancer, req.body);
    res.status(201).json({ mensaje: 'Propuesta enviada correctamente', propuesta });
  };

  retirar = async (req, res) => {
    const propuesta = await this.casos.retirarPropuesta.execute(req.usuario.id_freelancer, Number(req.params.id));
    res.json({ mensaje: 'Propuesta retirada correctamente', propuesta });
  };

  rechazar = async (req, res) => {
    const propuesta = await this.casos.rechazarPropuesta.execute(req.usuario.id_cliente, Number(req.params.id));
    res.json({ mensaje: 'Propuesta rechazada correctamente', propuesta });
  };
}
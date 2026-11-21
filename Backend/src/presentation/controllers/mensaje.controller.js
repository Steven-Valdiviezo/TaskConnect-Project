export class MensajeController {
  // casos: { enviarMensaje, obtenerConversacion, marcarMensajeLeido, contarMensajesNoLeidos }
  constructor(casos) {
    this.casos = casos;
  }

  enviar = async (req, res) => {
    const mensaje = await this.casos.enviarMensaje.execute(req.usuario.id_usuario, req.body);
    res.status(201).json({ mensaje: 'Mensaje enviado', datos: mensaje });
  };

  obtenerConversacion = async (req, res) => {
    const conversacion = await this.casos.obtenerConversacion.execute(req.usuario.id_usuario, Number(req.params.idUsuario));
    res.json({ mensaje: 'Conversación', total: conversacion.length, conversacion });
  };

  marcarLeido = async (req, res) => {
    const mensaje = await this.casos.marcarMensajeLeido.execute(Number(req.params.id), req.usuario.id_usuario);
    res.json({ mensaje: 'Mensaje marcado como leído', datos: mensaje });
  };

  contarNoLeidos = async (req, res) => {
    const total = await this.casos.contarMensajesNoLeidos.execute(req.usuario.id_usuario);
    res.json({ mensaje: 'Mensajes no leídos', total });
  };
}
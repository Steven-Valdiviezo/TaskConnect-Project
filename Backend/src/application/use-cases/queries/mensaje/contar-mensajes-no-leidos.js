export class ContarMensajesNoLeidos {
  constructor(mensajeRepository) {
    this.mensajes = mensajeRepository;
  }

  async execute(id_usuario) {
    return this.mensajes.contarNoLeidos(id_usuario);
  }
}
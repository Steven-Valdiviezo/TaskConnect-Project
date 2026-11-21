import { NoEncontrado } from '../../../errors/errores.js';

export class MarcarMensajeLeido {
  constructor(mensajeRepository) {
    this.mensajes = mensajeRepository;
  }

  async execute(id_mensaje, destinatario) {
    const mensaje = await this.mensajes.marcarLeido(id_mensaje, destinatario);
    if (!mensaje) throw new NoEncontrado('Mensaje no encontrado o no eres el destinatario');
    return mensaje;
  }
}
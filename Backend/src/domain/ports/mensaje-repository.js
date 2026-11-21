import { noImplementado } from './no-implementado.js';

const P = 'MensajeRepository';

export class MensajeRepository {
  async crear(_datos) { noImplementado(P, 'crear'); }
  async obtenerConversacion(_usuarioA, _usuarioB) { noImplementado(P, 'obtenerConversacion'); }
  async marcarLeido(_id_mensaje, _destinatario) { noImplementado(P, 'marcarLeido'); }
  async contarNoLeidos(_id_usuario) { noImplementado(P, 'contarNoLeidos'); }
}
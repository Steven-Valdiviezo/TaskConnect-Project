import { noImplementado } from './no-implementado.js';

const P = 'PropuestaRepository';

export class PropuestaRepository {
  async listarPorProyecto(_id_proyecto) { noImplementado(P, 'listarPorProyecto'); }
  async listarPorCliente(_id_cliente) { noImplementado(P, 'listarPorCliente'); }
  async listarPorFreelancer(_id_freelancer) { noImplementado(P, 'listarPorFreelancer'); }
  async crear(_datos) { noImplementado(P, 'crear'); }
  async eliminar(_id_propuesta, _id_freelancer) { noImplementado(P, 'eliminar'); }   // retirar
  async rechazar(_id_propuesta, _id_cliente) { noImplementado(P, 'rechazar'); }
}
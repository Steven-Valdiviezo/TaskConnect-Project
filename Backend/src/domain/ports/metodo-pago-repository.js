import { noImplementado } from './no-implementado.js';

const P = 'MetodoPagoRepository';

export class MetodoPagoRepository {
  async listar() { noImplementado(P, 'listar'); }
  async buscarPorId(_id) { noImplementado(P, 'buscarPorId'); }
  async buscarPorNombre(_nombre) { noImplementado(P, 'buscarPorNombre'); }
  async crear(_datos) { noImplementado(P, 'crear'); }
  async actualizar(_id, _datos) { noImplementado(P, 'actualizar'); }
  async contarPagos(_id) { noImplementado(P, 'contarPagos'); }
  async eliminar(_id) { noImplementado(P, 'eliminar'); }
}
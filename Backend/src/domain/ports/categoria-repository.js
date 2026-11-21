import { noImplementado } from './no-implementado.js';

const P = 'CategoriaRepository';

export class CategoriaRepository {
  async listar() { noImplementado(P, 'listar'); }
  async buscarPorId(_id) { noImplementado(P, 'buscarPorId'); }
  async buscarPorNombre(_nombre) { noImplementado(P, 'buscarPorNombre'); }
  async crear(_nombre_categoria) { noImplementado(P, 'crear'); }
  async actualizar(_id, _nombre_categoria) { noImplementado(P, 'actualizar'); }
  async contarProyectos(_id) { noImplementado(P, 'contarProyectos'); }
  async eliminar(_id) { noImplementado(P, 'eliminar'); }
}
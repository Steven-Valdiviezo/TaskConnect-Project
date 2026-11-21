import { noImplementado } from './no-implementado.js';

const P = 'ProfesionRepository';

export class ProfesionRepository {
  async listar() { noImplementado(P, 'listar'); }
  async buscarPorId(_id) { noImplementado(P, 'buscarPorId'); }
  async buscarPorNombre(_nombre) { noImplementado(P, 'buscarPorNombre'); }
  async crear(_datos) { noImplementado(P, 'crear'); }          // { nombre, descripcion }
  async actualizar(_id, _datos) { noImplementado(P, 'actualizar'); }
  async contarFreelancers(_id) { noImplementado(P, 'contarFreelancers'); }
  async eliminar(_id) { noImplementado(P, 'eliminar'); }
}
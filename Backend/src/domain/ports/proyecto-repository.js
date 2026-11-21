import { noImplementado } from './no-implementado.js';

const P = 'ProyectoRepository';

export class ProyectoRepository {
  async listar(_especificacion) { noImplementado(P, 'listar'); }   // recibe un ProyectoSpecification
  async buscarPorId(_id) { noImplementado(P, 'buscarPorId'); }
  async crear(_datos) { noImplementado(P, 'crear'); }
  async actualizar(_id, _datos) { noImplementado(P, 'actualizar'); }
  async obtenerDueno(_id_proyecto) { noImplementado(P, 'obtenerDueno'); }   // { id_cliente }
  async cancelar(_id_proyecto) { noImplementado(P, 'cancelar'); }           // transaccional: proyecto + contrato + propuestas
  async listarPorCliente(_id_cliente) { noImplementado(P, 'listarPorCliente'); }
  async eliminar(_id_proyecto) { noImplementado(P, 'eliminar'); }
}
import { noImplementado } from './no-implementado.js';

const P = 'ContratoRepository';

export class ContratoRepository {
  async obtenerPropuestaParaContrato(_id_propuesta) { noImplementado(P, 'obtenerPropuestaParaContrato'); }
  async crear(_datos) { noImplementado(P, 'crear'); }   // { id_proyecto, id_freelancer, fecha_inicio }
  async listarPorUsuario(_id_usuario, _rol) { noImplementado(P, 'listarPorUsuario'); }
  async actualizarEstado(_id_contrato, _estado, _fecha_fin) { noImplementado(P, 'actualizarEstado'); }
  async obtenerConFreelancer(_id_contrato) { noImplementado(P, 'obtenerConFreelancer'); }
  async existeEntreClienteYFreelancer(_id_cliente, _id_freelancer) { noImplementado(P, 'existeEntreClienteYFreelancer'); }
}
import { noImplementado } from './no-implementado.js';

const P = 'PagoRepository';

export class PagoRepository {
  async obtenerContratoConCliente(_id_contrato) { noImplementado(P, 'obtenerContratoConCliente'); }
  async crear(_datos) { noImplementado(P, 'crear'); }   // { id_contrato, id_metodo_pago, monto }; comisión e IVA los calcula el trigger
  async buscarPorId(_id_pago) { noImplementado(P, 'buscarPorId'); }
  async buscarPorContrato(_id_contrato) { noImplementado(P, 'buscarPorContrato'); }
  async marcarPagado(_id_pago) { noImplementado(P, 'marcarPagado'); }
}
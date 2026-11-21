import { NoEncontrado, Prohibido, ErrorValidacion } from '../../../errors/errores.js';

export class MarcarPagoPagado {
  constructor(pagoRepository) {
    this.pagos = pagoRepository;
  }

  async execute(id_cliente, id_pago) {
    const pago = await this.pagos.buscarPorId(id_pago);
    if (!pago) throw new NoEncontrado('Pago no encontrado');

    const contrato = await this.pagos.obtenerContratoConCliente(pago.id_contrato);
    if (contrato.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del contrato puede confirmar este pago');
    }

    if (pago.estado === 'pagado') {
      throw new ErrorValidacion('Este pago ya fue marcado como pagado');
    }

    return this.pagos.marcarPagado(id_pago);
  }
}
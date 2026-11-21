import { NoEncontrado } from '../../../errors/errores.js';

export class ObtenerPagoDeContrato {
  constructor(pagoRepository) {
    this.pagos = pagoRepository;
  }

  async execute(id_contrato) {
    const pago = await this.pagos.buscarPorContrato(id_contrato);
    if (!pago) throw new NoEncontrado('Este contrato aún no tiene pago registrado');
    return pago;
  }
}
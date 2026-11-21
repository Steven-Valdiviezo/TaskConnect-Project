import { RegistrarPagoDto } from '../../../dtos/registrar-pago.dto.js';
import { NoEncontrado, Prohibido } from '../../../errors/errores.js';

export class RegistrarPago {
  constructor(pagoRepository) {
    this.pagos = pagoRepository;
  }

  async execute(id_cliente, datos) {
    const dto = new RegistrarPagoDto(datos).validar();

    const contrato = await this.pagos.obtenerContratoConCliente(dto.id_contrato);
    if (!contrato) throw new NoEncontrado('Contrato no encontrado');

    if (contrato.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del contrato puede registrar el pago');
    }

    // trg_validar_contrato_pago bloquea si el contrato está cancelado
    // trg_validar_pago_contrato bloquea si el monto supera el presupuesto
    // los triggers de comisión e IVA llenan esos campos automáticamente
    return this.pagos.crear({
      id_contrato: dto.id_contrato,
      id_metodo_pago: dto.id_metodo_pago,
      monto: dto.monto
    });
  }
}
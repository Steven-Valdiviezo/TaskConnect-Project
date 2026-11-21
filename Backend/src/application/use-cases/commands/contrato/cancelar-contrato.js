import { NoEncontrado, Prohibido } from '../../../errors/errores.js';

export class CancelarContrato {
  constructor(contratoRepository) {
    this.contratos = contratoRepository;
  }

  async execute(id_cliente, id_contrato) {
    const contrato = await this.contratos.obtenerConFreelancer(id_contrato);
    if (!contrato) throw new NoEncontrado('Contrato no encontrado');

    if (contrato.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del contrato puede cancelarlo');
    }

    // trg_validar_cancelacion_contrato impide cancelar uno ya completado
    return this.contratos.actualizarEstado(id_contrato, 'cancelado', null);
  }
}
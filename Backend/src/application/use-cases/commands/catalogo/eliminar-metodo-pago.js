import { NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class EliminarMetodoPago {
  constructor(metodoPagoRepository) {
    this.metodos = metodoPagoRepository;
  }

  async execute(id_metodo_pago) {
    if (!(await this.metodos.buscarPorId(id_metodo_pago))) {
      throw new NoEncontrado('Método de pago no encontrado');
    }

    const enUso = await this.metodos.contarPagos(id_metodo_pago);
    if (enUso > 0) {
      throw new Conflicto(`No se puede eliminar: ${enUso} pago(s) usan este método`);
    }

    return this.metodos.eliminar(id_metodo_pago);
  }
}
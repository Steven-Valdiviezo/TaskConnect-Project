import { validarMonto } from '../validations/validaciones.js';
import { ErrorValidacion } from '../errors/errores.js';

export class RegistrarPagoDto {
  constructor(datos = {}) {
    this.id_contrato = datos.id_contrato;
    this.id_metodo_pago = datos.id_metodo_pago;
    this.monto = datos.monto;
  }

  validar() {
    if (!this.id_contrato || !this.id_metodo_pago || !this.monto) {
      throw new ErrorValidacion('id_contrato, id_metodo_pago y monto son obligatorios');
    }

    if (Number(this.monto) <= 0) throw new ErrorValidacion('El monto debe ser mayor a 0');

    // Máximo 2 decimales y tope coherente con el presupuesto máximo de un proyecto
    const errorMonto = validarMonto(this.monto, 'El monto', 1000000);
    if (errorMonto) throw new ErrorValidacion(errorMonto);

    if (!Number.isInteger(Number(this.id_contrato)) || !Number.isInteger(Number(this.id_metodo_pago))) {
      throw new ErrorValidacion('id_contrato e id_metodo_pago deben ser números enteros');
    }

    return this;
  }
}
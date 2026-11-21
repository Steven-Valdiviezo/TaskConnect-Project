import { validarTexto, validarMonto } from '../validations/validaciones.js';
import { ErrorValidacion } from '../errors/errores.js';

export class EnviarPropuestaDto {
  constructor(datos = {}) {
    this.id_proyecto = datos.id_proyecto;
    this.mensaje = datos.mensaje;
    this.monto_propuesto = datos.monto_propuesto;
  }

  validar() {
    if (!this.id_proyecto || !this.mensaje || !this.monto_propuesto) {
      throw new ErrorValidacion('id_proyecto, mensaje y monto_propuesto son obligatorios');
    }

    if (Number(this.monto_propuesto) <= 0) {
      throw new ErrorValidacion('El monto propuesto debe ser mayor a 0');
    }

    const errorCampos = validarTexto(this.mensaje, 'El mensaje', 20, 1000)
      || validarMonto(this.monto_propuesto, 'El monto propuesto', 1000000);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    return this;
  }
}
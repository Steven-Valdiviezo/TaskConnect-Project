import { validarNombreYDescripcion } from '../../../validations/validaciones.js';
import { ErrorValidacion, Conflicto } from '../../../errors/errores.js';

export class CrearMetodoPago {
  constructor(metodoPagoRepository) {
    this.metodos = metodoPagoRepository;
  }

  async execute({ nombre, descripcion }) {
    const errorCampos = validarNombreYDescripcion(nombre, descripcion, 'El nombre del método de pago', 50);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    const datos = { nombre: String(nombre).trim(), descripcion: String(descripcion).trim() };

    if (await this.metodos.buscarPorNombre(datos.nombre)) {
      throw new Conflicto('Ya existe un método de pago con ese nombre');
    }

    return this.metodos.crear(datos);
  }
}
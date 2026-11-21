import { validarNombreYDescripcion } from '../../../validations/validaciones.js';
import { ErrorValidacion, NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class ActualizarMetodoPago {
  constructor(metodoPagoRepository) {
    this.metodos = metodoPagoRepository;
  }

  async execute(id_metodo_pago, { nombre, descripcion }) {
    const errorCampos = validarNombreYDescripcion(nombre, descripcion, 'El nombre del método de pago', 50);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    if (!(await this.metodos.buscarPorId(id_metodo_pago))) {
      throw new NoEncontrado('Método de pago no encontrado');
    }

    const datos = { nombre: String(nombre).trim(), descripcion: String(descripcion).trim() };
    const duplicado = await this.metodos.buscarPorNombre(datos.nombre);
    if (duplicado && duplicado.id_metodo_pago !== id_metodo_pago) {
      throw new Conflicto('Ya existe otro método de pago con ese nombre');
    }

    return this.metodos.actualizar(id_metodo_pago, datos);
  }
}
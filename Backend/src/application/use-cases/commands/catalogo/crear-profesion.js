import { validarNombreYDescripcion } from '../../../validations/validaciones.js';
import { ErrorValidacion, Conflicto } from '../../../errors/errores.js';

export class CrearProfesion {
  constructor(profesionRepository) {
    this.profesiones = profesionRepository;
  }

  async execute({ nombre, descripcion }) {
    const errorCampos = validarNombreYDescripcion(nombre, descripcion, 'El nombre de la profesión', 30);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    const datos = { nombre: String(nombre).trim(), descripcion: String(descripcion).trim() };

    if (await this.profesiones.buscarPorNombre(datos.nombre)) {
      throw new Conflicto('Ya existe una profesión con ese nombre');
    }

    return this.profesiones.crear(datos);
  }
}
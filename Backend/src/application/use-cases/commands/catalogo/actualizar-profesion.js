import { validarNombreYDescripcion } from '../../../validations/validaciones.js';
import { ErrorValidacion, NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class ActualizarProfesion {
  constructor(profesionRepository) {
    this.profesiones = profesionRepository;
  }

  async execute(id_profesion, { nombre, descripcion }) {
    const errorCampos = validarNombreYDescripcion(nombre, descripcion, 'El nombre de la profesión', 30);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    if (!(await this.profesiones.buscarPorId(id_profesion))) {
      throw new NoEncontrado('Profesión no encontrada');
    }

    const datos = { nombre: String(nombre).trim(), descripcion: String(descripcion).trim() };
    const duplicada = await this.profesiones.buscarPorNombre(datos.nombre);
    if (duplicada && duplicada.id_profesion !== id_profesion) {
      throw new Conflicto('Ya existe otra profesión con ese nombre');
    }

    return this.profesiones.actualizar(id_profesion, datos);
  }
}
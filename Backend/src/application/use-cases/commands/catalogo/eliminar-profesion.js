import { NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class EliminarProfesion {
  constructor(profesionRepository) {
    this.profesiones = profesionRepository;
  }

  async execute(id_profesion) {
    if (!(await this.profesiones.buscarPorId(id_profesion))) {
      throw new NoEncontrado('Profesión no encontrada');
    }

    const enUso = await this.profesiones.contarFreelancers(id_profesion);
    if (enUso > 0) {
      throw new Conflicto(`No se puede eliminar: ${enUso} freelancer(s) tienen esta profesión`);
    }

    return this.profesiones.eliminar(id_profesion);
  }
}
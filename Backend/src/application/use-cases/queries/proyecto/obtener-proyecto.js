import { NoEncontrado } from '../../../errors/errores.js';

export class ObtenerProyecto {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_proyecto) {
    const proyecto = await this.proyectos.buscarPorId(id_proyecto);
    if (!proyecto) throw new NoEncontrado('Proyecto no encontrado');
    return proyecto;
  }
}
import { NoEncontrado } from '../../../errors/errores.js';

// Solo el administrador (lo controla la ruta)
export class EliminarProyecto {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_proyecto) {
    const proyecto = await this.proyectos.eliminar(id_proyecto);
    if (!proyecto) throw new NoEncontrado('Proyecto no encontrado');
    return proyecto;
  }
}
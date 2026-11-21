import { NoEncontrado, Prohibido, ErrorValidacion } from '../../../errors/errores.js';

export class CancelarProyecto {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_proyecto, id_cliente) {
    const dueno = await this.proyectos.obtenerDueno(id_proyecto);
    if (!dueno) throw new NoEncontrado('Proyecto no encontrado');
    if (dueno.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del proyecto puede cancelarlo');
    }

    // el repositorio cancela proyecto + contrato + propuestas en una transacción
    const proyecto = await this.proyectos.cancelar(id_proyecto);
    if (!proyecto) {
      throw new ErrorValidacion('El proyecto ya está finalizado o cancelado, no se puede cancelar');
    }

    return proyecto;
  }
}
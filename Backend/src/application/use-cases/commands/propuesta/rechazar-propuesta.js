import { NoEncontrado } from '../../../errors/errores.js';

export class RechazarPropuesta {
  constructor(propuestaRepository) {
    this.propuestas = propuestaRepository;
  }

  async execute(id_cliente, id_propuesta) {
    const propuesta = await this.propuestas.rechazar(id_propuesta, id_cliente);
    if (!propuesta) {
      throw new NoEncontrado('Propuesta no encontrada, no pertenece a uno de tus proyectos, o ya no está pendiente');
    }
    return propuesta;
  }
}
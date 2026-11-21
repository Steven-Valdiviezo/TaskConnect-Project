import { NoEncontrado } from '../../../errors/errores.js';

export class RetirarPropuesta {
  constructor(propuestaRepository) {
    this.propuestas = propuestaRepository;
  }

  async execute(id_freelancer, id_propuesta) {
    const propuesta = await this.propuestas.eliminar(id_propuesta, id_freelancer);
    if (!propuesta) {
      throw new NoEncontrado('Propuesta no encontrada, no te pertenece, o ya no se puede retirar (estado aceptada)');
    }
    return propuesta;
  }
}
import { ProyectoSpecification } from '../../../../domain/specifications/proyecto-specification.js';
import { ErrorValidacion } from '../../../errors/errores.js';

export class ListarProyectos {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(filtros = {}) {
    const { id_categoria, presupuesto_min, presupuesto_max } = filtros;

    if (id_categoria && !Number.isInteger(Number(id_categoria))) {
      throw new ErrorValidacion('id_categoria no es válido');
    }

    for (const [nombre, valor] of [['presupuesto_min', presupuesto_min], ['presupuesto_max', presupuesto_max]]) {
      if (valor && (!Number.isFinite(Number(valor)) || Number(valor) < 0)) {
        throw new ErrorValidacion(`${nombre} no es válido`);
      }
    }

    if (presupuesto_min && presupuesto_max && Number(presupuesto_min) > Number(presupuesto_max)) {
      throw new ErrorValidacion('El presupuesto mínimo no puede ser mayor al máximo');
    }

    return this.proyectos.listar(new ProyectoSpecification(filtros));
  }
}
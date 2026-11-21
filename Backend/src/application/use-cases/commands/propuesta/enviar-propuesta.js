import { EnviarPropuestaDto } from '../../../dtos/enviar-propuesta.dto.js';
import { NoEncontrado, ErrorValidacion } from '../../../errors/errores.js';

export class EnviarPropuesta {
  constructor({ propuestaRepository, proyectoRepository }) {
    this.propuestas = propuestaRepository;
    this.proyectos = proyectoRepository;
  }

  async execute(id_freelancer, datos) {
    const dto = new EnviarPropuestaDto(datos).validar();

    // la oferta no puede superar el presupuesto del proyecto
    const proyecto = await this.proyectos.buscarPorId(dto.id_proyecto);
    if (!proyecto) throw new NoEncontrado('El proyecto especificado no existe');

    if (Number(dto.monto_propuesto) > Number(proyecto.presupuesto)) {
      throw new ErrorValidacion(
        `El monto propuesto ($${dto.monto_propuesto}) no puede ser mayor al presupuesto del proyecto ($${proyecto.presupuesto})`
      );
    }

    // "proyecto abierto", "no auto-postulación" y "sin propuesta activa duplicada"
    // los validan los triggers de la base (trg_no_propuesta_proyecto_cerrado,
    // trg_validar_propuesta_propio_proyecto y trg_validar_propuesta_activa)
    return this.propuestas.crear({
      id_proyecto: dto.id_proyecto,
      id_freelancer,
      mensaje: dto.mensaje,
      monto_propuesto: dto.monto_propuesto
    });
  }
}
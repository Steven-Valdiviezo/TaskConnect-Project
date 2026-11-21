import { RegistrarCalificacionDto } from '../../../dtos/registrar-calificacion.dto.js';
import { NoEncontrado, Prohibido } from '../../../errors/errores.js';

export class RegistrarCalificacion {
  constructor(calificacionRepository) {
    this.calificaciones = calificacionRepository;
  }

  async execute(usuarioActual, datos) {
    if (usuarioActual.rol !== 'cliente') {
      throw new Prohibido('Solo los clientes pueden calificar. El sistema de reputación es unidireccional (cliente → freelancer)');
    }

    const dto = new RegistrarCalificacionDto(datos).validar();

    const contrato = await this.calificaciones.obtenerContratoParaCalificar(dto.id_contrato);
    if (!contrato) throw new NoEncontrado('Contrato no encontrado');

    if (contrato.id_usuario_cliente !== usuarioActual.id_usuario) {
      throw new Prohibido('Solo el cliente dueño de este contrato puede calificarlo');
    }

    // trg_validar_calificacion exige que el contrato esté 'completado'
    // uq_calificacion impide repetir la calificación del mismo contrato
    return this.calificaciones.crear({
      id_contrato: dto.id_contrato,
      id_calificador: usuarioActual.id_usuario,
      id_calificado: contrato.id_usuario_freelancer,
      puntuacion: Number(dto.puntuacion),
      comentario: dto.comentario || null
    });
  }
}
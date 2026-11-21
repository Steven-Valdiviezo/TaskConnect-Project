import { NoEncontrado, Prohibido, ErrorValidacion, Conflicto } from '../../../errors/errores.js';

// Aceptar una propuesta genera el contrato
export class AceptarPropuesta {
  constructor(contratoRepository) {
    this.contratos = contratoRepository;
  }

  async execute(id_cliente, id_propuesta) {
    const propuesta = await this.contratos.obtenerPropuestaParaContrato(id_propuesta);
    if (!propuesta) throw new NoEncontrado('Propuesta no encontrada');

    if (propuesta.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del proyecto puede aceptar esta propuesta');
    }

    if (propuesta.estado !== 'pendiente') {
      throw new ErrorValidacion('Solo se pueden aceptar propuestas en estado pendiente');
    }

    // el freelancer debe seguir activo
    if (propuesta.estado_freelancer !== 'activo') {
      throw new Conflicto(`No es posible aceptar la propuesta porque el freelancer "${propuesta.nombre_freelancer}" se encuentra inactivo.`);
    }

    // Al insertar, los triggers se encargan de:
    // - validar que el proyecto esté abierto (trg_validar_estado_proyecto)
    // - impedir auto-contratación (trg_validar_contrato_propio)
    // - pasar el proyecto a 'ejecucion' (trg_proyecto_en_progreso)
    // - marcar esta propuesta como 'aceptada' y rechazar las demás
    //   (trg_aceptar_propuesta, trg_cerrar_propuestas)
    return this.contratos.crear({
      id_proyecto: propuesta.id_proyecto,
      id_freelancer: propuesta.id_freelancer,
      fecha_inicio: new Date()
    });
  }
}
import { NoEncontrado, Prohibido, Conflicto } from '../../../errors/errores.js';

export class CompletarContrato {
  constructor(contratoRepository) {
    this.contratos = contratoRepository;
  }

  async execute(id_cliente, id_contrato) {
    const contrato = await this.contratos.obtenerConFreelancer(id_contrato);
    if (!contrato) throw new NoEncontrado('Contrato no encontrado');

    // solo el cliente dueño del contrato puede completarlo
    if (contrato.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del contrato puede completarlo');
    }

    if (contrato.estado_freelancer !== 'activo') {
      throw new Conflicto(`No es posible marcar el contrato como completado porque el freelancer "${contrato.nombre_freelancer}" se encuentra inactivo.`);
    }

    // el trigger trg_proyecto_finalizado marca el proyecto como finalizado
    return this.contratos.actualizarEstado(id_contrato, 'completado', new Date());
  }
}
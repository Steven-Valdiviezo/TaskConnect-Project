import { MensajeRepository } from '../../domain/ports/mensaje-repository.js';

export class TypeOrmMensajeRepository extends MensajeRepository {
  constructor(dataSource) {
    super();
    this.repo = dataSource.getRepository('Mensaje');
  }

  // trg_validar_mensaje_contrato exige un contrato activo entre los dos usuarios
  async crear({ remitente, destinatario, contenido }) {
    const r = await this.repo.insert({ remitente, destinatario, contenido });
    return this.repo.findOneBy({ id_mensaje: r.identifiers[0].id_mensaje });
  }

  // Un array en "where" funciona como OR: (A->B) o (B->A)
  async obtenerConversacion(usuarioA, usuarioB) {
    return this.repo.find({
      where: [
        { remitente: usuarioA, destinatario: usuarioB },
        { remitente: usuarioB, destinatario: usuarioA }
      ],
      order: { fecha_envio: 'ASC' }
    });
  }

  // Solo el destinatario puede marcarlo como leído
  async marcarLeido(id_mensaje, destinatario) {
    const r = await this.repo.update({ id_mensaje, destinatario }, { leido: true });
    if (!r.affected) return undefined;
    return this.repo.findOneBy({ id_mensaje });
  }

  async contarNoLeidos(id_usuario) {
    return this.repo.countBy({ destinatario: id_usuario, leido: false });
  }
}
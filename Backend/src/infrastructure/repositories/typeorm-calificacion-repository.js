import { CalificacionRepository } from '../../domain/ports/calificacion-repository.js';

export class TypeOrmCalificacionRepository extends CalificacionRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Calificacion');
  }

  async obtenerContratoParaCalificar(id_contrato) {
    return this.dataSource
      .getRepository('Contrato')
      .createQueryBuilder('c')
      .innerJoin('c.proyecto', 'p')
      .innerJoin('p.cliente', 'cl')
      .innerJoin('c.freelancer', 'fl')
      .select([
        'c.id_contrato AS id_contrato', 'c.estado AS estado_contrato',
        'cl.id_usuario AS id_usuario_cliente', 'fl.id_usuario AS id_usuario_freelancer'
      ])
      .where('c.id_contrato = :id_contrato', { id_contrato })
      .getRawOne();
  }

  // trg_validar_calificacion exige contrato completado; uq_calificacion evita repetir
  async crear({ id_contrato, id_calificador, id_calificado, puntuacion, comentario }) {
    const r = await this.repo.insert({ id_contrato, id_calificador, id_calificado, puntuacion, comentario });
    return this.repo.findOneBy({ id_calificacion: r.identifiers[0].id_calificacion });
  }

  async listarDeUsuario(id_usuario_calificado) {
    return this.repo
      .createQueryBuilder('cal')
      .innerJoin('cal.calificador', 'u')
      .select([
        'cal.id_calificacion AS id_calificacion', 'cal.id_contrato AS id_contrato',
        'cal.id_calificador AS id_calificador', 'cal.id_calificado AS id_calificado',
        'cal.puntuacion AS puntuacion', 'cal.comentario AS comentario', 'cal.fecha AS fecha',
        'u.nombre AS nombre_calificador'
      ])
      .where('cal.id_calificado = :id', { id: id_usuario_calificado })
      .orderBy('cal.fecha', 'DESC')
      .getRawMany();
  }

  async listarEmitidasPorUsuario(id_calificador) {
    return this.repo.find({ where: { id_calificador } });
  }

  // La reputación la calcula la función de PostgreSQL fn_calcular_reputacion
  async obtenerReputacionFreelancer(id_freelancer) {
    const filas = await this.dataSource.query(
      'SELECT fn_calcular_reputacion($1) AS reputacion',
      [id_freelancer]
    );
    return filas[0].reputacion;
  }
}
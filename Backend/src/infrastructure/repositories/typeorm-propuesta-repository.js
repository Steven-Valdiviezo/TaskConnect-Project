import { PropuestaRepository } from '../../domain/ports/propuesta-repository.js';

const COLUMNAS_PROPUESTA = [
  'pr.id_propuesta AS id_propuesta', 'pr.id_proyecto AS id_proyecto', 'pr.id_freelancer AS id_freelancer',
  'pr.mensaje AS mensaje', 'pr.monto_propuesto AS monto_propuesto',
  'pr.fecha_propuesta AS fecha_propuesta', 'pr.estado AS estado'
];

export class TypeOrmPropuestaRepository extends PropuestaRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Propuesta');
  }

  // Propuesta + nombre y estado del freelancer, la más reciente primero
  _consultaConFreelancer() {
    return this.repo
      .createQueryBuilder('pr')
      .innerJoin('pr.freelancer', 'f')
      .innerJoin('f.usuario', 'u')
      .select([...COLUMNAS_PROPUESTA, 'u.nombre AS nombre_freelancer', 'u.estado AS estado_freelancer'])
      .orderBy('pr.fecha_propuesta', 'DESC');
  }

  async listarPorProyecto(id_proyecto) {
    return this._consultaConFreelancer().where('pr.id_proyecto = :id_proyecto', { id_proyecto }).getRawMany();
  }

  async listarPorCliente(id_cliente) {
    return this._consultaConFreelancer()
      .innerJoin('pr.proyecto', 'p')
      .addSelect('p.titulo', 'titulo_proyecto')
      .where('p.id_cliente = :id_cliente', { id_cliente })
      .getRawMany();
  }

  async listarPorFreelancer(id_freelancer) {
    return this.repo
      .createQueryBuilder('pr')
      .innerJoin('pr.proyecto', 'p')
      .select([...COLUMNAS_PROPUESTA, 'p.titulo AS titulo_proyecto', 'p.presupuesto AS presupuesto_proyecto'])
      .where('pr.id_freelancer = :id_freelancer', { id_freelancer })
      .orderBy('pr.fecha_propuesta', 'DESC')
      .getRawMany();
  }

  // Los triggers validan: proyecto abierto, no auto-postulación y sin propuesta activa duplicada
  async crear({ id_proyecto, id_freelancer, mensaje, monto_propuesto }) {
    const r = await this.repo.insert({ id_proyecto, id_freelancer, mensaje, monto_propuesto });
    return this.repo.findOneBy({ id_propuesta: r.identifiers[0].id_propuesta });
  }

  // Retirar: solo el freelancer dueño; devuelve la fila eliminada
  async eliminar(id_propuesta, id_freelancer) {
    const fila = await this.repo.findOneBy({ id_propuesta, id_freelancer });
    if (!fila) return undefined;
    await this.repo.delete({ id_propuesta, id_freelancer });
    return fila;
  }

  // Rechazar: solo si el proyecto es del cliente y la propuesta sigue pendiente (una sola sentencia)
    // Rechazar: solo si el proyecto es del cliente y la propuesta sigue pendiente
  async rechazar(id_propuesta, id_cliente) {
    // 1) la propuesta debe pertenecer a un proyecto de este cliente
    const esDelCliente = await this.repo
      .createQueryBuilder('pr')
      .innerJoin('pr.proyecto', 'p')
      .where('pr.id_propuesta = :id_propuesta AND p.id_cliente = :id_cliente', { id_propuesta, id_cliente })
      .getCount();
    if (!esDelCliente) return undefined;

    // 2) el UPDATE solo afecta a la fila si sigue pendiente (así no se rechaza dos veces)
    const r = await this.repo.update({ id_propuesta, estado: 'pendiente' }, { estado: 'rechazada' });
    if (!r.affected) return undefined;

    return this.repo.findOneBy({ id_propuesta });
  }
}
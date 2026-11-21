import { ProyectoRepository } from '../../domain/ports/proyecto-repository.js';

// Las mismas columnas que devolvía el "SELECT p.*" de antes
const COLUMNAS_PROYECTO = [
  'p.id_proyecto AS id_proyecto', 'p.id_cliente AS id_cliente', 'p.id_categoria AS id_categoria',
  'p.titulo AS titulo', 'p.descripcion AS descripcion', 'p.presupuesto AS presupuesto',
  'p.estado AS estado', 'p.fecha_publicacion AS fecha_publicacion', 'p.fecha_entrega AS fecha_entrega'
];

export class TypeOrmProyectoRepository extends ProyectoRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Proyecto');
  }

  // Proyecto + nombre de la categoría + nombre del cliente
  _consultaConJoins() {
    return this.repo
      .createQueryBuilder('p')
      .innerJoin('p.categoria', 'c')
      .innerJoin('p.cliente', 'cl')
      .innerJoin('cl.usuario', 'u')
      .select([...COLUMNAS_PROYECTO, 'c.nombre_categoria AS nombre_categoria', 'u.nombre AS nombre_cliente']);
  }

  // Fila simple del proyecto (lo que antes era el RETURNING *)
  _fila(id_proyecto, manager = this.dataSource.manager) {
    return manager
      .getRepository('Proyecto')
      .createQueryBuilder('p')
      .select(COLUMNAS_PROYECTO)
      .where('p.id_proyecto = :id_proyecto', { id_proyecto })
      .getRawOne();
  }

  async listar(especificacion = {}) {
    const { id_categoria, presupuesto_min, presupuesto_max } = especificacion;
    const qb = this._consultaConJoins().orderBy('p.fecha_publicacion', 'DESC');

    if (id_categoria) qb.andWhere('p.id_categoria = :id_categoria', { id_categoria });
    if (presupuesto_min) qb.andWhere('p.presupuesto >= :presupuesto_min', { presupuesto_min });
    if (presupuesto_max) qb.andWhere('p.presupuesto <= :presupuesto_max', { presupuesto_max });

    return qb.getRawMany();
  }

  async buscarPorId(id_proyecto) {
    return this._consultaConJoins().where('p.id_proyecto = :id_proyecto', { id_proyecto }).getRawOne();
  }

  async crear({ id_cliente, id_categoria, titulo, descripcion, presupuesto, fecha_entrega }) {
    const r = await this.repo.insert({
      id_cliente, id_categoria, titulo, descripcion, presupuesto,
      fecha_entrega: fecha_entrega ?? null,
      estado: 'abierto'
    });
    return this._fila(r.identifiers[0].id_proyecto);
  }

  // Si el proyecto ya no está abierto, el trigger trg_validar_modificacion_proyecto lanza el error
  async actualizar(id_proyecto, { titulo, descripcion, presupuesto, id_categoria, fecha_entrega }) {
    await this.repo.update(
      { id_proyecto },
      { titulo, descripcion, presupuesto, id_categoria, fecha_entrega: fecha_entrega ?? null }
    );
    return this._fila(id_proyecto);
  }

  async obtenerDueno(id_proyecto) {
    return this.repo.findOne({ where: { id_proyecto }, select: { id_cliente: true } });
  }

  // El orden de los 3 UPDATE importa: primero proyecto, después contrato (por trg_contrato_reabrir_proyecto).
  // Todo en una transacción: si algo falla, no queda nada a medias.
  async cancelar(id_proyecto) {
    return this.dataSource.transaction(async (manager) => {
      const r = await manager
        .createQueryBuilder()
        .update('Proyecto')
        .set({ estado: 'cancelado' })
        .where('id_proyecto = :id_proyecto', { id_proyecto })
        .andWhere('estado IN (:...estados)', { estados: ['abierto', 'ejecucion'] })
        .execute();

      if (!r.affected) return null; // ya estaba finalizado o cancelado

      await manager.update('Contrato', { id_proyecto, estado: 'activo' }, { estado: 'cancelado' });
      await manager.update('Propuesta', { id_proyecto, estado: 'pendiente' }, { estado: 'rechazada' });

      return this._fila(id_proyecto, manager);
    });
  }

  async listarPorCliente(id_cliente) {
    return this.repo
      .createQueryBuilder('p')
      .innerJoin('p.categoria', 'c')
      .select([...COLUMNAS_PROYECTO, 'c.nombre_categoria AS nombre_categoria'])
      .addSelect(
        (sub) => sub.select('COUNT(*)::int').from('Propuesta', 'pr').where('pr.id_proyecto = p.id_proyecto'),
        'total_propuestas'
      )
      .where('p.id_cliente = :id_cliente', { id_cliente })
      .orderBy('p.fecha_publicacion', 'DESC')
      .getRawMany();
  }

  async eliminar(id_proyecto) {
    const fila = await this._fila(id_proyecto);
    if (!fila) return undefined;
    await this.repo.delete({ id_proyecto });
    return fila;
  }
}
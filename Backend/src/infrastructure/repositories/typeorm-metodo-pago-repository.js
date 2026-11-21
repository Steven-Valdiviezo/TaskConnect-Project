import { MetodoPagoRepository } from '../../domain/ports/metodo-pago-repository.js';

export class TypeOrmMetodoPagoRepository extends MetodoPagoRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('MetodoPago');
  }

  async listar() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async buscarPorId(id) {
    return this.repo.findOneBy({ id_metodo_pago: id });
  }

  async buscarPorNombre(nombre) {
    return this.repo
      .createQueryBuilder('m')
      .where('LOWER(m.nombre) = LOWER(:nombre)', { nombre })
      .getOne();
  }

  async crear({ nombre, descripcion }) {
    return this.repo.save(this.repo.create({ nombre, descripcion }));
  }

  async actualizar(id, { nombre, descripcion }) {
    await this.repo.update({ id_metodo_pago: id }, { nombre, descripcion });
    return this.buscarPorId(id);
  }

  async contarPagos(id) {
    return this.dataSource.getRepository('Pago').countBy({ id_metodo_pago: id });
  }

  async eliminar(id) {
    const existente = await this.buscarPorId(id);
    if (!existente) return undefined;
    await this.repo.delete({ id_metodo_pago: id });
    return existente;
  }
}
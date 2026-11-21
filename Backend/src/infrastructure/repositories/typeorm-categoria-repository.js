import { CategoriaRepository } from '../../domain/ports/categoria-repository.js';

export class TypeOrmCategoriaRepository extends CategoriaRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Categoria');
  }

  async listar() {
    return this.repo.find({ order: { nombre_categoria: 'ASC' } });
  }

  async buscarPorId(id) {
    return this.repo.findOneBy({ id_categoria: id });
  }

  // comparación sin distinguir mayúsculas, igual que el LOWER() de antes
  async buscarPorNombre(nombre) {
    return this.repo
      .createQueryBuilder('c')
      .where('LOWER(c.nombre_categoria) = LOWER(:nombre)', { nombre })
      .getOne();
  }

  async crear(nombre_categoria) {
    return this.repo.save(this.repo.create({ nombre_categoria }));
  }

  async actualizar(id, nombre_categoria) {
    await this.repo.update({ id_categoria: id }, { nombre_categoria });
    return this.buscarPorId(id);
  }

  async contarProyectos(id) {
    return this.dataSource.getRepository('Proyecto').countBy({ id_categoria: id });
  }

  // devuelve la fila eliminada (antes era DELETE ... RETURNING *)
  async eliminar(id) {
    const existente = await this.buscarPorId(id);
    if (!existente) return undefined;
    await this.repo.delete({ id_categoria: id });
    return existente;
  }
}
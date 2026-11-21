import { ProfesionRepository } from '../../domain/ports/profesion-repository.js';

export class TypeOrmProfesionRepository extends ProfesionRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Profesion');
  }

  async listar() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async buscarPorId(id) {
    return this.repo.findOneBy({ id_profesion: id });
  }

  async buscarPorNombre(nombre) {
    return this.repo
      .createQueryBuilder('p')
      .where('LOWER(p.nombre) = LOWER(:nombre)', { nombre })
      .getOne();
  }

  async crear({ nombre, descripcion }) {
    return this.repo.save(this.repo.create({ nombre, descripcion }));
  }

  async actualizar(id, { nombre, descripcion }) {
    await this.repo.update({ id_profesion: id }, { nombre, descripcion });
    return this.buscarPorId(id);
  }

  async contarFreelancers(id) {
    return this.dataSource.getRepository('Freelancer').countBy({ id_profesion: id });
  }

  async eliminar(id) {
    const existente = await this.buscarPorId(id);
    if (!existente) return undefined;
    await this.repo.delete({ id_profesion: id });
    return existente;
  }
}
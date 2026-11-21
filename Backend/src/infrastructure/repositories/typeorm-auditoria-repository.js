import { AuditoriaRepository } from '../../domain/ports/auditoria-repository.js';

export class TypeOrmAuditoriaRepository extends AuditoriaRepository {
  constructor(dataSource) {
    super();
    this.repo = dataSource.getRepository('Auditoria');
  }

  async listar({ tabla, limite } = {}) {
    return this.repo.find({
      where: tabla ? { tabla } : {},
      order: { fecha: 'DESC' },
      take: limite || 100
    });
  }
}
import { ConfiguracionRepository } from '../../domain/ports/configuracion-repository.js';

export class TypeOrmConfiguracionRepository extends ConfiguracionRepository {
  constructor(dataSource) {
    super();
    this.repo = dataSource.getRepository('Configuracion');
  }

  // el transformer de la schema ya lo entrega como número
  async obtenerTarifaIva() {
    const fila = await this.repo.findOneBy({ clave: 'tarifa_iva' });
    return fila?.valor;
  }
}
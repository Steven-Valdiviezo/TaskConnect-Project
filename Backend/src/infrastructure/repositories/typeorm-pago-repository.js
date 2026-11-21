import { PagoRepository } from '../../domain/ports/pago-repository.js';

export class TypeOrmPagoRepository extends PagoRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Pago');
  }

  async obtenerContratoConCliente(id_contrato) {
    return this.dataSource
      .getRepository('Contrato')
      .createQueryBuilder('c')
      .innerJoin('c.proyecto', 'p')
      .select([
        'c.id_contrato AS id_contrato', 'c.estado AS estado_contrato',
        'p.id_cliente AS id_cliente', 'p.presupuesto AS presupuesto'
      ])
      .where('c.id_contrato = :id_contrato', { id_contrato })
      .getRawOne();
  }

  // comision, tarifa_iva e iva los calculan los triggers, por eso se vuelve a leer la fila completa
  async crear({ id_contrato, id_metodo_pago, monto }) {
    const r = await this.repo.insert({ id_contrato, id_metodo_pago, monto });
    return this.repo.findOneBy({ id_pago: r.identifiers[0].id_pago });
  }

  async buscarPorId(id_pago) {
    return this.repo.findOneBy({ id_pago });
  }

  async buscarPorContrato(id_contrato) {
    return this.repo.findOneBy({ id_contrato });
  }

  // estado y fecha_pago van en el mismo UPDATE, así se cumple el CHECK chk_pago_fecha_pago
  async marcarPagado(id_pago) {
    await this.repo.update({ id_pago }, { estado: 'pagado', fecha_pago: () => 'CURRENT_TIMESTAMP' });
    return this.repo.findOneBy({ id_pago });
  }
}
import { ContratoRepository } from '../../domain/ports/contrato-repository.js';

const COLUMNAS_CONTRATO = [
  'c.id_contrato AS id_contrato', 'c.id_proyecto AS id_proyecto', 'c.id_freelancer AS id_freelancer',
  'c.fecha_inicio AS fecha_inicio', 'c.fecha_fin AS fecha_fin', 'c.estado AS estado'
];

export class TypeOrmContratoRepository extends ContratoRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Contrato');
  }

  _fila(id_contrato) {
    return this.repo
      .createQueryBuilder('c')
      .select(COLUMNAS_CONTRATO)
      .where('c.id_contrato = :id_contrato', { id_contrato })
      .getRawOne();
  }

  async obtenerPropuestaParaContrato(id_propuesta) {
    return this.dataSource
      .getRepository('Propuesta')
      .createQueryBuilder('pr')
      .innerJoin('pr.proyecto', 'py')
      .innerJoin('pr.freelancer', 'f')
      .innerJoin('f.usuario', 'u')
      .select([
        'pr.id_propuesta AS id_propuesta', 'pr.id_proyecto AS id_proyecto',
        'pr.id_freelancer AS id_freelancer', 'pr.estado AS estado',
        'py.id_cliente AS id_cliente',
        'u.nombre AS nombre_freelancer', 'u.estado AS estado_freelancer'
      ])
      .where('pr.id_propuesta = :id_propuesta', { id_propuesta })
      .getRawOne();
  }

  // Al insertar, los triggers hacen todo el trabajo: validan, pasan el proyecto a 'ejecucion',
  // aceptan esta propuesta y rechazan las demás
  async crear({ id_proyecto, id_freelancer, fecha_inicio }) {
    const r = await this.repo.insert({ id_proyecto, id_freelancer, fecha_inicio });
    return this._fila(r.identifiers[0].id_contrato);
  }

  // La "contraparte" es el freelancer si el que consulta es cliente, y el cliente si consulta el freelancer
  async listarPorUsuario(id_usuario, rol) {
    const qb = this.repo
      .createQueryBuilder('c')
      .innerJoin('c.proyecto', 'p')
      .innerJoin('p.cliente', 'cl')
      .innerJoin('c.freelancer', 'f')
      .leftJoin('Propuesta', 'pr', "pr.id_proyecto = c.id_proyecto AND pr.id_freelancer = c.id_freelancer AND pr.estado = 'aceptada'")
      .select([
        ...COLUMNAS_CONTRATO,
        'p.titulo AS titulo_proyecto', 'p.presupuesto AS presupuesto',
        'pr.monto_propuesto AS monto_propuesto'
      ])
      .orderBy('c.fecha_inicio', 'DESC');

    if (rol === 'cliente') {
      return qb
        .innerJoin('f.usuario', 'fu')
        .addSelect('fu.id_usuario', 'id_usuario_contraparte')
        .addSelect('fu.nombre', 'nombre_contraparte')
        .addSelect('fu.estado', 'estado_contraparte')
        .where('cl.id_usuario = :id_usuario', { id_usuario })
        .getRawMany();
    }

    // rol freelancer
    return qb
      .innerJoin('cl.usuario', 'cu')
      .addSelect('cu.id_usuario', 'id_usuario_contraparte')
      .addSelect('cu.nombre', 'nombre_contraparte')
      .where('f.id_usuario = :id_usuario', { id_usuario })
      .getRawMany();
  }

  // fecha_fin solo se toca si viene (antes era COALESCE($2, fecha_fin))
  async actualizarEstado(id_contrato, estado, fecha_fin) {
    const cambios = { estado };
    if (fecha_fin) cambios.fecha_fin = fecha_fin;

    await this.repo.update({ id_contrato }, cambios);
    return this._fila(id_contrato);
  }

    // Incluye id_cliente (dueño del proyecto) para poder verificar quién actúa sobre el contrato
  async obtenerConFreelancer(id_contrato) {
    return this.repo
      .createQueryBuilder('c')
      .innerJoin('c.proyecto', 'p')
      .innerJoin('c.freelancer', 'f')
      .innerJoin('f.usuario', 'u')
      .select([
        'c.id_contrato AS id_contrato', 'c.estado AS estado_contrato',
        'p.id_cliente AS id_cliente',
        'u.nombre AS nombre_freelancer', 'u.estado AS estado_freelancer'
      ])
      .where('c.id_contrato = :id_contrato', { id_contrato })
      .getRawOne();
  }

  // Viene de usuario.repository: sirve para saber si el cliente puede ver el contacto del freelancer
  async existeEntreClienteYFreelancer(id_cliente, id_freelancer) {
    const total = await this.repo
      .createQueryBuilder('c')
      .innerJoin('c.proyecto', 'p')
      .where('c.id_freelancer = :id_freelancer AND p.id_cliente = :id_cliente', { id_freelancer, id_cliente })
      .getCount();

    return total > 0;
  }
}
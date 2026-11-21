import { UsuarioRepository } from '../../domain/ports/usuario-repository.js';

// Columnas que pueden salir hacia afuera (nunca la contraseña)
const COLUMNAS_PUBLICAS = {
  id_usuario: true, nombre: true, correo: true, telefono: true,
  rol: true, estado: true, fecha_registro: true
};

export class TypeOrmUsuarioRepository extends UsuarioRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
    this.repo = dataSource.getRepository('Usuario');
  }

  // Devuelve la fila completa, con el hash: la usa el login
  async buscarPorCorreo(correo) {
    return this.repo
      .createQueryBuilder('u')
      .where('LOWER(u.correo) = LOWER(:correo)', { correo })
      .getOne();
  }

  async buscarPorId(id_usuario) {
    return this.repo.findOne({ where: { id_usuario }, select: COLUMNAS_PUBLICAS });
  }

  // Registro transaccional: usuario + (cliente | freelancer)
  async registrar({ nombre, correo, contrasenaHash, telefono, rol, perfil }) {
    return this.dataSource.transaction(async (manager) => {
      const resUsuario = await manager.insert('Usuario', {
        nombre, correo, contrasena: contrasenaHash, telefono, rol
      });
      const id_usuario = resUsuario.identifiers[0].id_usuario;

      let perfilCreado = null;

      if (rol === 'cliente') {
        const empresa = perfil?.empresa || null;
        const direccion = perfil?.direccion || null;
        const r = await manager.insert('Cliente', { id_usuario, empresa, direccion });
        perfilCreado = { id_cliente: r.identifiers[0].id_cliente, empresa, direccion };
      }

      if (rol === 'freelancer') {
        const { id_profesion, descripcion, experiencia } = perfil;
        const r = await manager.insert('Freelancer', { id_usuario, id_profesion, descripcion, experiencia });
        perfilCreado = { id_freelancer: r.identifiers[0].id_freelancer, id_profesion, descripcion, experiencia };
      }

      // Se vuelve a leer porque el trigger trg_mayusculas_usuario cambia el nombre a mayúsculas
      const usuario = await manager.findOne('Usuario', { where: { id_usuario }, select: COLUMNAS_PUBLICAS });
      return { usuario, perfil: perfilCreado };
    });
  }

  // { id_cliente } | { id_freelancer } | null (el administrador no tiene perfil)
  async obtenerIdsPerfil(id_usuario, rol) {
    if (rol === 'cliente') {
      return this.dataSource.getRepository('Cliente')
        .findOne({ where: { id_usuario }, select: { id_cliente: true } });
    }
    if (rol === 'freelancer') {
      return this.dataSource.getRepository('Freelancer')
        .findOne({ where: { id_usuario }, select: { id_freelancer: true } });
    }
    return null;
  }

  async obtenerDatosCliente(id_usuario) {
    return this.dataSource.getRepository('Cliente').findOne({
      where: { id_usuario },
      select: { id_cliente: true, empresa: true, direccion: true }
    });
  }

  // Aquí sí hay JOIN con profesion, por eso se arma el objeto con los mismos alias de antes
  async obtenerDatosFreelancer(id_usuario) {
    return this.dataSource.getRepository('Freelancer')
      .createQueryBuilder('f')
      .innerJoin('f.profesion', 'p')
      .select([
        'f.id_freelancer AS id_freelancer',
        'f.descripcion AS descripcion',
        'f.experiencia AS experiencia',
        'p.id_profesion AS id_profesion',
        'p.nombre AS profesion'
      ])
      .where('f.id_usuario = :id_usuario', { id_usuario })
      .getRawOne();
  }

  async actualizarPerfilUsuario(id_usuario, { nombre, telefono }) {
    await this.repo.update({ id_usuario }, { nombre, telefono });
    return this.buscarPorId(id_usuario); // se relee: el trigger vuelve a poner el nombre en mayúsculas
  }

  async actualizarCliente(id_usuario, { empresa, direccion }) {
    await this.dataSource.getRepository('Cliente').update({ id_usuario }, { empresa, direccion });
    return this.obtenerDatosCliente(id_usuario);
  }

  async actualizarFreelancer(id_usuario, { id_profesion, descripcion, experiencia }) {
    const repoFreelancer = this.dataSource.getRepository('Freelancer');
    await repoFreelancer.update({ id_usuario }, { id_profesion, descripcion, experiencia });
    return repoFreelancer.findOne({
      where: { id_usuario },
      select: { id_freelancer: true, id_profesion: true, descripcion: true, experiencia: true }
    });
  }

  // Consulta base del perfil público; el perfil con contacto solo le suma correo y teléfono
  _consultaPerfilFreelancer(id_freelancer) {
    return this.dataSource.getRepository('Freelancer')
      .createQueryBuilder('f')
      .innerJoin('f.usuario', 'u')
      .innerJoin('f.profesion', 'p')
      .select([
        'f.id_freelancer AS id_freelancer',
        'u.nombre AS nombre',
        'u.fecha_registro AS fecha_registro',
        'p.nombre AS profesion',
        'f.descripcion AS descripcion',
        'f.experiencia AS experiencia'
      ])
      .addSelect(
        (sub) => sub
          .select('COUNT(*)::int')
          .from('Contrato', 'c')
          .where("c.id_freelancer = f.id_freelancer AND c.estado = 'completado'"),
        'contratos_completados'
      )
      .where('f.id_freelancer = :id_freelancer', { id_freelancer });
  }

  async obtenerPerfilPublicoFreelancer(id_freelancer) {
    return this._consultaPerfilFreelancer(id_freelancer).getRawOne();
  }

  async obtenerPerfilFreelancerConContacto(id_freelancer) {
    return this._consultaPerfilFreelancer(id_freelancer)
      .addSelect('u.correo', 'correo')
      .addSelect('u.telefono', 'telefono')
      .getRawOne();
  }

  // ----- administración de cuentas -----
  async listar({ rol, estado } = {}) {
    const where = {};
    if (rol) where.rol = rol;
    if (estado) where.estado = estado;

    return this.repo.find({ where, select: COLUMNAS_PUBLICAS, order: { fecha_registro: 'DESC' } });
  }

  async desactivar(id_usuario) {
    return this._cambiarEstado(id_usuario, 'activo', 'inactivo');
  }

  async reactivar(id_usuario) {
    return this._cambiarEstado(id_usuario, 'inactivo', 'activo');
  }

  // Solo cambia si el usuario está en el estado esperado; si no, devuelve undefined (el servicio responde 404)
  async _cambiarEstado(id_usuario, desde, hacia) {
    const r = await this.repo.update({ id_usuario, estado: desde }, { estado: hacia });
    if (!r.affected) return undefined;

    return this.repo.findOne({
      where: { id_usuario },
      select: { id_usuario: true, nombre: true, correo: true, rol: true, estado: true }
    });
  }
}
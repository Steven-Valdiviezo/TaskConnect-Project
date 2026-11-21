export class AdminController {
  // casos: { listarUsuarios, desactivarUsuario, reactivarUsuario, listarAuditoria, obtenerEstadisticasAdmin }
  constructor(casos) {
    this.casos = casos;
  }

  listarUsuarios = async (req, res) => {
    const { rol, estado } = req.query;
    const usuarios = await this.casos.listarUsuarios.execute({ rol, estado });
    res.json({ mensaje: 'Listado de usuarios', total: usuarios.length, usuarios });
  };

  desactivarUsuario = async (req, res) => {
    const usuario = await this.casos.desactivarUsuario.execute(req.usuario, Number(req.params.id));
    res.json({ mensaje: 'Usuario desactivado correctamente', usuario });
  };

  reactivarUsuario = async (req, res) => {
    const usuario = await this.casos.reactivarUsuario.execute(Number(req.params.id));
    res.json({ mensaje: 'Usuario reactivado correctamente', usuario });
  };

  listarAuditoria = async (req, res) => {
    const { tabla, limite } = req.query;
    const registros = await this.casos.listarAuditoria.execute({ tabla, limite: Number(limite) || undefined });
    res.json({ mensaje: 'Registros de auditoría', total: registros.length, registros });
  };

  estadisticas = async (req, res) => {
    const estadisticas = await this.casos.obtenerEstadisticasAdmin.execute();
    res.json({ mensaje: 'Estadísticas administrativas', estadisticas });
  };
}
export class ProyectoController {
  // casos: { listarProyectos, obtenerProyecto, crearProyecto, actualizarProyecto,
  //          cancelarProyecto, listarMisProyectos, eliminarProyecto }
  constructor(casos) {
    this.casos = casos;
  }

  listar = async (req, res) => {
    const { id_categoria, presupuesto_min, presupuesto_max } = req.query;
    const proyectos = await this.casos.listarProyectos.execute({ id_categoria, presupuesto_min, presupuesto_max });
    res.json({ mensaje: 'Listado de proyectos', total: proyectos.length, proyectos });
  };

  obtener = async (req, res) => {
    const proyecto = await this.casos.obtenerProyecto.execute(Number(req.params.id));
    res.json({ mensaje: 'Proyecto encontrado', proyecto });
  };

  crear = async (req, res) => {
    const proyecto = await this.casos.crearProyecto.execute(req.usuario.id_cliente, req.body);
    res.status(201).json({ mensaje: 'Proyecto publicado correctamente', proyecto });
  };

  editar = async (req, res) => {
    const proyecto = await this.casos.actualizarProyecto.execute(Number(req.params.id), req.usuario.id_cliente, req.body);
    res.json({ mensaje: 'Proyecto actualizado correctamente', proyecto });
  };

  cancelar = async (req, res) => {
    const proyecto = await this.casos.cancelarProyecto.execute(Number(req.params.id), req.usuario.id_cliente);
    res.json({ mensaje: 'Proyecto cancelado correctamente', proyecto });
  };

  listarMios = async (req, res) => {
    const proyectos = await this.casos.listarMisProyectos.execute(req.usuario.id_cliente);
    res.json({ mensaje: 'Mis proyectos', total: proyectos.length, proyectos });
  };

  eliminar = async (req, res) => {
    const proyecto = await this.casos.eliminarProyecto.execute(Number(req.params.id));
    res.json({ mensaje: 'Proyecto eliminado correctamente', proyecto });
  };
}
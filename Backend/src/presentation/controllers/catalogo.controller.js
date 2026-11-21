export class CatalogoController {
  // casos: { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  //          listarProfesiones, crearProfesion, actualizarProfesion, eliminarProfesion,
  //          listarMetodosPago, crearMetodoPago, actualizarMetodoPago, eliminarMetodoPago, obtenerTarifaIva }
  constructor(casos) {
    this.casos = casos;
  }

  // ---- Categoría ----
  listarCategorias = async (req, res) => {
    const categorias = await this.casos.listarCategorias.execute();
    res.json({ mensaje: 'Listado de categorías', categorias });
  };

  crearCategoria = async (req, res) => {
    const categoria = await this.casos.crearCategoria.execute(req.body.nombre_categoria);
    res.status(201).json({ mensaje: 'Categoría creada correctamente', categoria });
  };

  actualizarCategoria = async (req, res) => {
    const categoria = await this.casos.actualizarCategoria.execute(Number(req.params.id), req.body.nombre_categoria);
    res.json({ mensaje: 'Categoría actualizada correctamente', categoria });
  };

  eliminarCategoria = async (req, res) => {
    const categoria = await this.casos.eliminarCategoria.execute(Number(req.params.id));
    res.json({ mensaje: 'Categoría eliminada correctamente', categoria });
  };

  // ---- Profesión ----
  listarProfesiones = async (req, res) => {
    const profesiones = await this.casos.listarProfesiones.execute();
    res.json({ mensaje: 'Listado de profesiones', profesiones });
  };

  crearProfesion = async (req, res) => {
    const profesion = await this.casos.crearProfesion.execute(req.body);
    res.status(201).json({ mensaje: 'Profesión creada correctamente', profesion });
  };

  actualizarProfesion = async (req, res) => {
    const profesion = await this.casos.actualizarProfesion.execute(Number(req.params.id), req.body);
    res.json({ mensaje: 'Profesión actualizada correctamente', profesion });
  };

  eliminarProfesion = async (req, res) => {
    const profesion = await this.casos.eliminarProfesion.execute(Number(req.params.id));
    res.json({ mensaje: 'Profesión eliminada correctamente', profesion });
  };

  // ---- Método de pago ----
  listarMetodosPago = async (req, res) => {
    const metodos = await this.casos.listarMetodosPago.execute();
    res.json({ mensaje: 'Listado de métodos de pago', metodos });
  };

  crearMetodoPago = async (req, res) => {
    const metodo = await this.casos.crearMetodoPago.execute(req.body);
    res.status(201).json({ mensaje: 'Método de pago creado correctamente', metodo });
  };

  actualizarMetodoPago = async (req, res) => {
    const metodo = await this.casos.actualizarMetodoPago.execute(Number(req.params.id), req.body);
    res.json({ mensaje: 'Método de pago actualizado correctamente', metodo });
  };

  eliminarMetodoPago = async (req, res) => {
    const metodo = await this.casos.eliminarMetodoPago.execute(Number(req.params.id));
    res.json({ mensaje: 'Método de pago eliminado correctamente', metodo });
  };

  // ---- Configuración pública (tarifa del IVA) ----
  obtenerConfiguracion = async (req, res) => {
    const tarifa_iva = await this.casos.obtenerTarifaIva.execute();
    res.json({ mensaje: 'Configuración pública', tarifa_iva });
  };
}
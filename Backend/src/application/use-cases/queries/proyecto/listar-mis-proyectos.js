export class ListarMisProyectos {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_cliente) {
    return this.proyectos.listarPorCliente(id_cliente);
  }
}
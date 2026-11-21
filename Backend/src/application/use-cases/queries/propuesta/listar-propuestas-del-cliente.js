export class ListarPropuestasDelCliente {
  constructor(propuestaRepository) {
    this.propuestas = propuestaRepository;
  }

  async execute(id_cliente) {
    return this.propuestas.listarPorCliente(id_cliente);
  }
}
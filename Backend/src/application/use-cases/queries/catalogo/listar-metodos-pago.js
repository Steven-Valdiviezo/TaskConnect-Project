export class ListarMetodosPago {
  constructor(metodoPagoRepository) {
    this.metodos = metodoPagoRepository;
  }

  async execute() {
    return this.metodos.listar();
  }
}
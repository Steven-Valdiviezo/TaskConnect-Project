export class ListarCategorias {
  constructor(categoriaRepository) {
    this.categorias = categoriaRepository;
  }

  async execute() {
    return this.categorias.listar();
  }
}
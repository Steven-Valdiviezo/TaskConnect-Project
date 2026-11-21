export class ListarMisContratos {
  constructor(contratoRepository) {
    this.contratos = contratoRepository;
  }

  async execute(id_usuario, rol) {
    return this.contratos.listarPorUsuario(id_usuario, rol);
  }
}
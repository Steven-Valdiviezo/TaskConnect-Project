export class ListarUsuarios {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  async execute(filtros) {
    return this.usuarios.listar(filtros); // { rol, estado }
  }
}
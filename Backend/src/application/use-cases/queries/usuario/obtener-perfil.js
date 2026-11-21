export class ObtenerPerfil {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  // Devuelve el usuario y, según su rol, los datos de cliente o de freelancer
  async execute(id_usuario) {
    const usuario = await this.usuarios.buscarPorId(id_usuario);
    if (!usuario) return null;

    let perfil = null;
    if (usuario.rol === 'cliente') perfil = await this.usuarios.obtenerDatosCliente(id_usuario);
    if (usuario.rol === 'freelancer') perfil = await this.usuarios.obtenerDatosFreelancer(id_usuario);

    return { usuario, perfil };
  }
}
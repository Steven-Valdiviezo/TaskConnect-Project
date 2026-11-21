import { NoEncontrado } from '../../../errors/errores.js';

export class ReactivarUsuario {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  async execute(id_usuario) {
    const usuario = await this.usuarios.reactivar(id_usuario);
    if (!usuario) throw new NoEncontrado('Usuario no encontrado o ya estaba activo');

    return usuario;
  }
}
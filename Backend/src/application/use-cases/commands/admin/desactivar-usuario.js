import { ErrorValidacion, NoEncontrado } from '../../../errors/errores.js';

export class DesactivarUsuario {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  async execute(adminActual, id_usuario) {
    if (adminActual.id_usuario === id_usuario) {
      throw new ErrorValidacion('No puedes desactivar tu propia cuenta de administrador');
    }

    const usuario = await this.usuarios.desactivar(id_usuario);
    if (!usuario) throw new NoEncontrado('Usuario no encontrado o ya estaba inactivo');

    return usuario;
  }
}
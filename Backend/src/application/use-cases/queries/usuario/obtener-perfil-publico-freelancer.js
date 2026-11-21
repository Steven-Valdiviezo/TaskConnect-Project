import { NoEncontrado } from '../../../errors/errores.js';

export class ObtenerPerfilPublicoFreelancer {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  async execute(id_freelancer) {
    const perfil = await this.usuarios.obtenerPerfilPublicoFreelancer(id_freelancer);
    if (!perfil) throw new NoEncontrado('Freelancer no encontrado');
    return perfil;
  }
}
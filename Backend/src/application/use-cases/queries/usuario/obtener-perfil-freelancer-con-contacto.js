import { Prohibido, NoEncontrado } from '../../../errors/errores.js';

// El contacto del freelancer solo lo ve un cliente que ya tiene contrato con él
export class ObtenerPerfilFreelancerConContacto {
  constructor({ usuarioRepository, contratoRepository }) {
    this.usuarios = usuarioRepository;
    this.contratos = contratoRepository;
  }

  async execute(usuarioActual, id_freelancer) {
    if (usuarioActual.rol !== 'cliente') {
      throw new Prohibido('Solo un cliente puede ver el contacto de un freelancer');
    }

    const tieneContrato = await this.contratos.existeEntreClienteYFreelancer(usuarioActual.id_cliente, id_freelancer);
    if (!tieneContrato) {
      throw new Prohibido('Solo puedes ver el contacto de freelancers con los que ya tienes un contrato');
    }

    const perfil = await this.usuarios.obtenerPerfilFreelancerConContacto(id_freelancer);
    if (!perfil) throw new NoEncontrado('Freelancer no encontrado');

    return perfil;
  }
}
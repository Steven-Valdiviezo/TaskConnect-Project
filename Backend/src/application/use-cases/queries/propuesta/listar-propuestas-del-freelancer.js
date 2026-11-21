export class ListarPropuestasDelFreelancer {
  constructor(propuestaRepository) {
    this.propuestas = propuestaRepository;
  }

  async execute(id_freelancer) {
    return this.propuestas.listarPorFreelancer(id_freelancer);
  }
}
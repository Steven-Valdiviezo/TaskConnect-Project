export class ListarPropuestasDeProyecto {
  constructor(propuestaRepository) {
    this.propuestas = propuestaRepository;
  }

  async execute(id_proyecto) {
    return this.propuestas.listarPorProyecto(id_proyecto);
  }
}
export class ObtenerReputacion {
  constructor(calificacionRepository) {
    this.calificaciones = calificacionRepository;
  }

  // promedio calculado por la función fn_calcular_reputacion de la BD
  async execute(id_freelancer) {
    return this.calificaciones.obtenerReputacionFreelancer(id_freelancer);
  }
}
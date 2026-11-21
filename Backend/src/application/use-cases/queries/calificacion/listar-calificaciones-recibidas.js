export class ListarCalificacionesRecibidas {
  constructor(calificacionRepository) {
    this.calificaciones = calificacionRepository;
  }

  async execute(id_usuario) {
    return this.calificaciones.listarDeUsuario(id_usuario);
  }
}
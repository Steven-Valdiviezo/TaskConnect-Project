export class ListarCalificacionesEmitidas {
  constructor(calificacionRepository) {
    this.calificaciones = calificacionRepository;
  }

  async execute(id_usuario) {
    return this.calificaciones.listarEmitidasPorUsuario(id_usuario);
  }
}
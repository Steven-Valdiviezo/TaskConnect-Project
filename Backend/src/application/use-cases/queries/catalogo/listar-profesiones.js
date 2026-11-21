export class ListarProfesiones {
  constructor(profesionRepository) {
    this.profesiones = profesionRepository;
  }

  async execute() {
    return this.profesiones.listar();
  }
}
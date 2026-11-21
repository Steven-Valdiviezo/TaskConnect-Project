import { ProyectoDto } from '../../../dtos/proyecto.dto.js';

export class CrearProyecto {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_cliente, datos) {
    const dto = new ProyectoDto(datos).validar();
    return this.proyectos.crear({ id_cliente, ...dto });
  }
}
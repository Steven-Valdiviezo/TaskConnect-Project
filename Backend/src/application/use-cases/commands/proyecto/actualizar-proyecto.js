import { ProyectoDto } from '../../../dtos/proyecto.dto.js';
import { NoEncontrado, Prohibido } from '../../../errors/errores.js';

export class ActualizarProyecto {
  constructor(proyectoRepository) {
    this.proyectos = proyectoRepository;
  }

  async execute(id_proyecto, id_cliente, datos) {
    const dueno = await this.proyectos.obtenerDueno(id_proyecto);
    if (!dueno) throw new NoEncontrado('Proyecto no encontrado');
    if (dueno.id_cliente !== id_cliente) {
      throw new Prohibido('Solo el cliente dueño del proyecto puede modificarlo');
    }

    // mismas validaciones de contenido que al publicar
    const dto = new ProyectoDto(datos).validar();

    // si el proyecto ya no está abierto, el trigger trg_validar_modificacion_proyecto lo rechaza
    return this.proyectos.actualizar(id_proyecto, dto);
  }
}
import { NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class EliminarCategoria {
  constructor(categoriaRepository) {
    this.categorias = categoriaRepository;
  }

  async execute(id_categoria) {
    if (!(await this.categorias.buscarPorId(id_categoria))) {
      throw new NoEncontrado('Categoría no encontrada');
    }

    // no se elimina una categoría que todavía tiene proyectos
    const enUso = await this.categorias.contarProyectos(id_categoria);
    if (enUso > 0) {
      throw new Conflicto(`No se puede eliminar: ${enUso} proyecto(s) usan esta categoría`);
    }

    return this.categorias.eliminar(id_categoria);
  }
}
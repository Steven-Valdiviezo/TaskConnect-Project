import { validarTexto } from '../../../validations/validaciones.js';
import { ErrorValidacion, NoEncontrado, Conflicto } from '../../../errors/errores.js';

export class ActualizarCategoria {
  constructor(categoriaRepository) {
    this.categorias = categoriaRepository;
  }

  async execute(id_categoria, nombre_categoria) {
    const errorNombre = validarTexto(nombre_categoria, 'El nombre de la categoría', 3, 100);
    if (errorNombre) throw new ErrorValidacion(errorNombre);

    if (!(await this.categorias.buscarPorId(id_categoria))) {
      throw new NoEncontrado('Categoría no encontrada');
    }

    const nombre = String(nombre_categoria).trim();
    const duplicada = await this.categorias.buscarPorNombre(nombre);
    if (duplicada && duplicada.id_categoria !== id_categoria) {
      throw new Conflicto('Ya existe otra categoría con ese nombre');
    }

    return this.categorias.actualizar(id_categoria, nombre);
  }
}
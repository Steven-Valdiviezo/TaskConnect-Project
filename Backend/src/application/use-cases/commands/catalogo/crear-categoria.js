import { validarTexto } from '../../../validations/validaciones.js';
import { ErrorValidacion, Conflicto } from '../../../errors/errores.js';

export class CrearCategoria {
  constructor(categoriaRepository) {
    this.categorias = categoriaRepository;
  }

  async execute(nombre_categoria) {
    const errorNombre = validarTexto(nombre_categoria, 'El nombre de la categoría', 3, 100);
    if (errorNombre) throw new ErrorValidacion(errorNombre);

    const nombre = String(nombre_categoria).trim();

    if (await this.categorias.buscarPorNombre(nombre)) {
      throw new Conflicto('Ya existe una categoría con ese nombre');
    }

    return this.categorias.crear(nombre);
  }
}
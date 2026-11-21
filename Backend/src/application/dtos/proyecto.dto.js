import { validarTexto, validarMonto } from '../validations/validaciones.js';
import { ErrorValidacion } from '../errors/errores.js';

// La fecha de entrega no puede estar en el pasado.
// Render corre en UTC: se acepta desde "ayer UTC" para no rechazar el "hoy" de Ecuador (UTC-5).
const fechaEntregaValida = (fecha) => {
  const limite = new Date();
  limite.setUTCDate(limite.getUTCDate() - 1);
  limite.setUTCHours(0, 0, 0, 0);
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && new Date(`${fecha}T00:00:00Z`) >= limite;
};

// Sirve para publicar y para editar un proyecto (mismas reglas que el frontend)
export class ProyectoDto {
  constructor(datos = {}) {
    this.titulo = datos.titulo;
    this.descripcion = datos.descripcion;
    this.presupuesto = datos.presupuesto;
    this.id_categoria = datos.id_categoria;
    this.fecha_entrega = datos.fecha_entrega;
  }

  validar() {
    if (!this.titulo || !this.descripcion || !this.presupuesto || !this.id_categoria) {
      throw new ErrorValidacion('titulo, descripcion, presupuesto e id_categoria son obligatorios');
    }

    if (Number(this.presupuesto) <= 0) {
      throw new ErrorValidacion('El presupuesto debe ser mayor a 0');
    }

    const errorCampos = validarTexto(this.titulo, 'El título', 5, 150)
      || validarTexto(this.descripcion, 'La descripción', 20, 2000)
      || validarMonto(this.presupuesto, 'El presupuesto', 1000000);
    if (errorCampos) throw new ErrorValidacion(errorCampos);

    if (this.fecha_entrega && !fechaEntregaValida(this.fecha_entrega)) {
      throw new ErrorValidacion('La fecha de entrega no es válida o ya pasó');
    }

    return this;
  }
}
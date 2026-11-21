import { ErrorValidacion } from '../errors/errores.js';

export class RegistrarCalificacionDto {
  constructor(datos = {}) {
    this.id_contrato = datos.id_contrato;
    this.puntuacion = datos.puntuacion;
    this.comentario = String(datos.comentario ?? '').trim();
  }

  validar() {
    if (!this.id_contrato || !this.puntuacion) {
      throw new ErrorValidacion('id_contrato y puntuacion son obligatorios');
    }

    if (!Number.isInteger(Number(this.puntuacion)) || this.puntuacion < 1 || this.puntuacion > 5) {
      throw new ErrorValidacion('La puntuación debe ser un número entero entre 1 y 5');
    }

    // El comentario es opcional, pero con máximo 500 caracteres
    if (this.comentario.length > 500) {
      throw new ErrorValidacion('El comentario no puede superar los 500 caracteres');
    }

    return this;
  }
}
import { validarTexto } from '../../../validations/validaciones.js';
import { ErrorValidacion } from '../../../errors/errores.js';

export class EnviarMensaje {
  constructor(mensajeRepository) {
    this.mensajes = mensajeRepository;
  }

  async execute(remitente, { destinatario, contenido }) {
    const errorContenido = validarTexto(contenido, 'El mensaje', 1, 1000);
    if (errorContenido) throw new ErrorValidacion(errorContenido);

    if (!destinatario || !Number.isInteger(Number(destinatario))) {
      throw new ErrorValidacion('El destinatario no es válido');
    }

    if (Number(destinatario) === Number(remitente)) {
      throw new ErrorValidacion('No puedes enviarte mensajes a ti mismo');
    }

    // trg_validar_mensaje_contrato exige un contrato activo entre ambos usuarios
    return this.mensajes.crear({ remitente, destinatario, contenido: String(contenido).trim() });
  }
}
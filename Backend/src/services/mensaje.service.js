import {
  crearMensajeRepository,
  obtenerConversacionRepository,
  marcarMensajeLeidoRepository,
  contarMensajesNoLeidosRepository
} from '../repositories/mensaje.repository.js';
import { validarTexto, lanzarError400 } from '../utils/validaciones.util.js';

export const enviarMensajeService = async (remitente, datos) => {
  const { destinatario, contenido } = datos;

  const errorContenido = validarTexto(contenido, 'El mensaje', 1, 1000);
  if (errorContenido) lanzarError400(errorContenido);

  if (!Number.isInteger(Number(destinatario))) lanzarError400('El destinatario no es válido');

  if (Number(destinatario) === Number(remitente)) {
    const error = new Error('No puedes enviarte mensajes a ti mismo');
    error.status = 400;
    throw error;
  }

  // trg_validar_mensaje_contrato exige un contrato activo entre ambos usuarios
  return await crearMensajeRepository({ remitente, destinatario, contenido: String(contenido).trim() });
};

export const obtenerConversacionService = async (usuarioActual, otroUsuario) => {
  return await obtenerConversacionRepository(usuarioActual, otroUsuario);
};

export const marcarLeidoService = async (id_mensaje, destinatario) => {
  const mensaje = await marcarMensajeLeidoRepository(id_mensaje, destinatario);

  if (!mensaje) {
    const error = new Error('Mensaje no encontrado o no eres el destinatario');
    error.status = 404;
    throw error;
  }

  return mensaje;
};

export const contarNoLeidosService = async (id_usuario) => {
  return await contarMensajesNoLeidosRepository(id_usuario);
};
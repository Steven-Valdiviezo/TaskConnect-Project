import {
  crearMensajeRepository,
  obtenerConversacionRepository,
  marcarMensajeLeidoRepository,
  contarMensajesNoLeidosRepository
} from '../repositories/mensaje.repository.js';

export const enviarMensajeService = async (remitente, datos) => {
  const { destinatario, contenido } = datos;

  if (!destinatario || !contenido) {
    const error = new Error('destinatario y contenido son obligatorios');
    error.status = 400;
    throw error;
  }

  if (Number(destinatario) === Number(remitente)) {
    const error = new Error('No puedes enviarte mensajes a ti mismo');
    error.status = 400;
    throw error;
  }

  // trg_validar_mensaje_contrato exige un contrato activo entre ambos usuarios
  return await crearMensajeRepository({ remitente, destinatario, contenido });
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
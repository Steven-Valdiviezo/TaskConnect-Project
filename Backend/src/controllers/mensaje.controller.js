import { enviarMensajeService, obtenerConversacionService, 
  marcarLeidoService, contarNoLeidosService
 } from '../services/mensaje.service.js';

export const enviarMensaje = async (req, res, next) => {
  try {
    const mensaje = await enviarMensajeService(req.usuario.id_usuario, req.body);
    res.status(201).json({ mensaje: 'Mensaje enviado', datos: mensaje });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const obtenerConversacion = async (req, res, next) => {
  try {
    const conversacion = await obtenerConversacionService(req.usuario.id_usuario, Number(req.params.idUsuario));
    res.json({ mensaje: 'Conversación', total: conversacion.length, conversacion });
  } catch (error) {
    next(error);
  }
};

export const marcarLeido = async (req, res, next) => {
  try {
    const mensaje = await marcarLeidoService(Number(req.params.id), req.usuario.id_usuario);
    res.json({ mensaje: 'Mensaje marcado como leído', datos: mensaje });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const contarNoLeidos = async (req, res, next) => {
  try {
    const total = await contarNoLeidosService(req.usuario.id_usuario);
    res.json({ mensaje: 'Mensajes no leídos', total });
  } catch (error) {
    next(error);
  }
};
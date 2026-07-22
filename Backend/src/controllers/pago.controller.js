import {
  registrarPagoService,
  marcarPagoPagadoService,
  obtenerPagoDeContratoService
} from '../services/pago.service.js';

export const registrarPago = async (req, res, next) => {
  try {
    const pago = await registrarPagoService(req.usuario.id_cliente, req.body);
    res.status(201).json({ mensaje: 'Pago registrado correctamente', pago });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const marcarPagoPagado = async (req, res, next) => {
  try {
    const pago = await marcarPagoPagadoService(req.usuario.id_cliente, Number(req.params.id));
    res.json({ mensaje: 'Pago confirmado como pagado', pago });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const obtenerPagoDeContrato = async (req, res, next) => {
  try {
    const pago = await obtenerPagoDeContratoService(Number(req.params.idContrato));
    if (!pago) return res.status(404).json({ mensaje: 'Este contrato aún no tiene pago registrado' });
    res.json({ mensaje: 'Pago del contrato', pago });
  } catch (error) {
    next(error);
  }
};
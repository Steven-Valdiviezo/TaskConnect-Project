import {
  aceptarPropuestaYCrearContratoService,
  listarMisContratosService,
  completarContratoService,
  cancelarContratoService
} from '../services/contrato.service.js';

export const aceptarPropuesta = async (req, res, next) => {
  try {
    const contrato = await aceptarPropuestaYCrearContratoService(
      req.usuario.id_cliente,
      Number(req.params.idPropuesta)
    );
    res.status(201).json({ mensaje: 'Contrato generado correctamente', contrato });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const listarMisContratos = async (req, res, next) => {
  try {
    const contratos = await listarMisContratosService(req.usuario.id_usuario, req.usuario.rol);
    res.json({ mensaje: 'Contratos del usuario', total: contratos.length, contratos });
  } catch (error) {
    next(error);
  }
};

export const completarContrato = async (req, res, next) => {
  try {
    const contrato = await completarContratoService(Number(req.params.id));
    res.json({ mensaje: 'Contrato marcado como completado', contrato });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    next(error);
  }
};

export const cancelarContrato = async (req, res, next) => {
  try {
    const contrato = await cancelarContratoService(Number(req.params.id));
    res.json({ mensaje: 'Contrato cancelado', contrato });
  } catch (error) {
    next(error);
  }
};
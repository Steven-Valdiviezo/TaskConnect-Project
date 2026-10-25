import {
  obtenerContratoConClienteRepository,
  crearPagoRepository,
  obtenerPagoPorIdRepository,
  obtenerPagoPorContratoRepository,
  marcarPagoComoPagadoRepository
} from '../repositories/pago.repository.js';
import { validarMonto, lanzarError400 } from '../utils/validaciones.util.js';

export const registrarPagoService = async (id_cliente, datos) => {
  const { id_contrato, id_metodo_pago, monto } = datos;

  if (!id_contrato || !id_metodo_pago || !monto) {
    const error = new Error('id_contrato, id_metodo_pago y monto son obligatorios');
    error.status = 400;
    throw error;
  }

  if (Number(monto) <= 0) {
    const error = new Error('El monto debe ser mayor a 0');
    error.status = 400;
    throw error;
  }

  // Máximo 2 decimales y tope coherente con el presupuesto máximo de un proyecto
  const errorMonto = validarMonto(monto, 'El monto', 1000000);
  if (errorMonto) lanzarError400(errorMonto);

  if (!Number.isInteger(Number(id_contrato)) || !Number.isInteger(Number(id_metodo_pago))) {
    lanzarError400('id_contrato e id_metodo_pago deben ser números enteros');
  }

  const contrato = await obtenerContratoConClienteRepository(id_contrato);

  if (!contrato) {
    const error = new Error('Contrato no encontrado');
    error.status = 404;
    throw error;
  }

  if (contrato.id_cliente !== id_cliente) {
    const error = new Error('Solo el cliente dueño del contrato puede registrar el pago');
    error.status = 403;
    throw error;
  }

  // trg_validar_contrato_pago bloquea si el contrato está cancelado
  // trg_validar_pago_contrato bloquea si el monto supera el presupuesto
  // trg_calcular_comision llena la comisión automáticamente (10%)
  return await crearPagoRepository({ id_contrato, id_metodo_pago, monto });
};

export const marcarPagoPagadoService = async (id_cliente, id_pago) => {
  const pago = await obtenerPagoPorIdRepository(id_pago);

  if (!pago) {
    const error = new Error('Pago no encontrado');
    error.status = 404;
    throw error;
  }

  const contrato = await obtenerContratoConClienteRepository(pago.id_contrato);

  if (contrato.id_cliente !== id_cliente) {
    const error = new Error('Solo el cliente dueño del contrato puede confirmar este pago');
    error.status = 403;
    throw error;
  }

  if (pago.estado === 'pagado') {
    const error = new Error('Este pago ya fue marcado como pagado');
    error.status = 400;
    throw error;
  }

  return await marcarPagoComoPagadoRepository(id_pago);
};

export const obtenerPagoDeContratoService = async (id_contrato) => {
  return await obtenerPagoPorContratoRepository(id_contrato);
};
export type EstadoPago = 'pendiente' | 'pagado';

export interface Pago {
  id_pago: number;
  id_contrato: number;
  id_metodo_pago: number;
  monto: number;
  comision: number;
  tarifa_iva: number;   // tarifa usada al momento del pago (ej. 0.15)
  iva: number;
  fecha_solicitud: string;
  fecha_pago?: string;
  estado: EstadoPago;
}
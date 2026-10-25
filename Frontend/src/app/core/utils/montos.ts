import type { Pago } from '../../models/pago.model';

/** Redondea a 2 decimales evitando errores de punto flotante */
export const redondear2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/** IVA = monto x tarifa, redondeado igual que el trigger de la BD (ROUND de PostgreSQL).
 *  Se calcula en centavos para que no haya diferencias de 1 centavo entre la vista previa y el pago real. */
export function calcularIva(monto: number, tarifa: number): number {
  const centavos = Math.round(monto * 100);
  const puntosBase = Math.round(tarifa * 10000);
  return Math.round((centavos * puntosBase) / 10000) / 100;
}

/** Lo que paga el cliente: servicio + IVA + su mitad (5%) de la comisión */
export const totalCliente = (p: Pago): number =>
  redondear2(Number(p.monto) + Number(p.iva ?? 0) + Number(p.comision) / 2);

/** Ingreso neto del freelancer: servicio - su mitad (5%) de la comisión (el IVA no es ingreso, se declara al SRI) */
export const netoFreelancer = (p: Pago): number =>
  redondear2(Number(p.monto) - Number(p.comision) / 2);
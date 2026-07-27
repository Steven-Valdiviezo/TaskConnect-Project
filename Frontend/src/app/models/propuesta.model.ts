export type EstadoPropuesta = 'pendiente' | 'aceptada' | 'rechazada';

export interface Propuesta {
  id_propuesta: number;
  id_proyecto: number;
  id_freelancer: number;
  nombre_freelancer?: string;
  titulo_proyecto?: string;
  mensaje: string;
  monto_propuesto: number;
  fecha_propuesta: string;
  estado: EstadoPropuesta;
  presupuesto_proyecto?: number;
}
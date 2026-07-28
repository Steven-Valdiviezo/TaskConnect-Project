export type EstadoContrato = 'activo' | 'completado' | 'cancelado';

export interface Contrato {
  id_contrato: number;
  id_proyecto: number;
  id_freelancer: number;
  titulo_proyecto?: string;
  id_usuario_contraparte?: number;
  nombre_contraparte?: string;
  // Agregao para activos
  estado_contraparte?: 'activo' | 'inactivo';
  presupuesto?: number;
  monto_propuesto?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: EstadoContrato;
}
export type EstadoContrato = 'activo' | 'completado' | 'cancelado';

export interface Contrato {
  id_contrato: number;
  id_proyecto: number;
  id_freelancer: number;
  titulo_proyecto?: string;
  id_usuario_contraparte?: number;
  nombre_contraparte?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: EstadoContrato;
}
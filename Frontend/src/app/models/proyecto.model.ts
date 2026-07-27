// Actualizacion del modelo de proyecto 
export type EstadoProyecto = 'abierto' | 'ejecucion' | 'finalizado' | 'cancelado';

export interface Proyecto {
  id_proyecto: number;
  id_cliente: number;
  id_categoria: number;
  nombre_categoria?: string;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  estado: EstadoProyecto;
  fecha_publicacion: string;
  total_propuestas?: number;
  fecha_entrega?: string;
  nombre_cliente?: string;
}

export interface NuevoProyecto {
  titulo: string;
  descripcion: string;
  presupuesto: number;
  id_categoria: number;
  fecha_entrega?: string;
}

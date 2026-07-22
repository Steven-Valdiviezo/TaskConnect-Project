// Modelo de referencia (sin conexión a BD aún) basado en la tabla "proyecto"
export type EstadoProyecto = 'abierto' | 'en_progreso' | 'finalizado';

export interface Proyecto {
  idProyecto: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  presupuesto: number;
  estado: EstadoProyecto;
  fechaPublicacion: string;
}

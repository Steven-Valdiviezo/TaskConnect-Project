export interface Calificacion {
  id_calificacion: number;
  id_contrato: number;
  id_calificador: number;
  id_calificado: number;
  puntuacion: number;
  comentario?: string;
  fecha: string;
}
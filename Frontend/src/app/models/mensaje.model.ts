export interface Mensaje {
  id_mensaje: number;
  remitente: number;
  destinatario: number;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
}
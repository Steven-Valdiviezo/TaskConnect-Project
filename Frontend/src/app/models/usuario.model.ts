// Modelo de referencia (sin conexión a BD aún) basado en la tabla "usuario"
export type RolUsuario = 'cliente' | 'freelancer' | 'administrador';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  telefono?: string;
  fechaRegistro: Date;
}

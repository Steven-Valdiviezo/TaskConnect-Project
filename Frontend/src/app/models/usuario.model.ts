// Actualizando de modelo de usuario
export type RolUsuario = 'cliente' | 'freelancer' | 'administrador';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string;
  rol: RolUsuario;
  estado: 'activo' | 'inactivo';
  fecha_registro: string;
}

export interface PerfilCliente {
  id_cliente: number;
  empresa?: string;
  direccion?: string;
}

export interface PerfilFreelancer {
  id_freelancer: number;
  id_profesion: number;
  profesion?: string;
  descripcion: string;
  experiencia: number;
}

export interface SesionUsuario {
  id_usuario: number;
  nombre: string;
  rol: RolUsuario;
  id_cliente?: number;
  id_freelancer?: number;
}

export interface RegistroClientePayload {
  nombre: string; correo: string; contrasena: string; telefono?: string;
  rol: 'cliente';
  perfil: { empresa?: string; direccion?: string };
}

export interface RegistroFreelancerPayload {
  nombre: string; correo: string; contrasena: string; telefono?: string;
  rol: 'freelancer';
  perfil: { id_profesion: number; descripcion: string; experiencia: number };
}

export interface PerfilPublicoFreelancer {
  id_freelancer: number;
  nombre: string;
  fecha_registro: string;
  profesion: string;
  descripcion: string;
  experiencia: number;
  contratos_completados: number;
  correo?: string;
  telefono?: string;
}

export type RegistroPayload = RegistroClientePayload | RegistroFreelancerPayload;
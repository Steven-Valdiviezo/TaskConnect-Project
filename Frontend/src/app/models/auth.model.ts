import { SesionUsuario } from './usuario.model';

export interface LoginPaso1Respuesta {
  mensaje: string;
  requiere2fa: true;
  preAuthToken: string;
  correo: string;
}

export interface LoginConfirmadoRespuesta {
  mensaje: string;
  token: string;
  usuario: SesionUsuario;
}
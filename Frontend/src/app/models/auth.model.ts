import { SesionUsuario } from './usuario.model';

export interface LoginPaso1Respuesta {
  mensaje: string;
  requiere2fa: true;
  correo: string;
}

export interface LoginConfirmadoRespuesta {
  mensaje: string;
  token: string;
  usuario: SesionUsuario;
}
import { ErrorValidacion, NoAutorizado } from '../../../errors/errores.js';
import { hashearToken } from '../../../utils/token-seguro.js';
import { armarPayload } from '../../../utils/sesion.js';

// Paso 2 del login: consume el magic link y emite el JWT real
export class ConfirmarLogin2FA {
  constructor({ usuarioRepository, token2faRepository, tokenService }) {
    this.usuarios = usuarioRepository;
    this.tokens = token2faRepository;
    this.tokenService = tokenService;
  }

  async execute({ token }) {
    if (!token) throw new ErrorValidacion('El token de verificación es obligatorio');

    // consumo atómico: sirve una sola vez y solo si no ha expirado
    const registro = await this.tokens.consumir(hashearToken(token));
    if (!registro) throw new NoAutorizado('El enlace es inválido, expiró o ya fue utilizado');

    const usuario = await this.usuarios.buscarPorId(registro.id_usuario);
    if (!usuario || usuario.estado !== 'activo') throw new NoAutorizado('Usuario no válido');

    const idsPerfil = await this.usuarios.obtenerIdsPerfil(usuario.id_usuario, usuario.rol);
    const payload = armarPayload(usuario, idsPerfil);

    return { token: this.tokenService.generar(payload), usuario: payload };
  }
}
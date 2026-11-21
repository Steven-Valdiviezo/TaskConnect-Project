import { NoAutorizado, Prohibido } from '../../../errors/errores.js';
import { generarTokenAleatorio, hashearToken } from '../../../utils/token-seguro.js';

// Paso 1 del login: valida credenciales y envía el magic link por correo
export class LoginUsuario {
  constructor({ usuarioRepository, token2faRepository, passwordHasher, mailSender, config }) {
    this.usuarios = usuarioRepository;
    this.tokens = token2faRepository;
    this.hasher = passwordHasher;
    this.mail = mailSender;
    this.config = config; // { frontendUrl, minutosExpiracion }
  }

  async execute({ correo, contrasena }) {
    const usuario = await this.usuarios.buscarPorCorreo(correo);
    if (!usuario) throw new NoAutorizado('Credenciales inválidas');
    if (usuario.estado !== 'activo') throw new Prohibido('El usuario está inactivo');

    const coincide = await this.hasher.comparar(contrasena, usuario.contrasena);
    if (!coincide) throw new NoAutorizado('Credenciales inválidas');

    // Al correo va el token; a la BD solo su hash
    const token = generarTokenAleatorio();
    const minutos = this.config.minutosExpiracion ?? 10;
    await this.tokens.crear({ id_usuario: usuario.id_usuario, token_hash: hashearToken(token), minutos });

    const enlace = `${this.config.frontendUrl}/login/verificar-correo?token=${token}`;

    await this.mail.enviar({
      para: usuario.correo,
      nombrePara: usuario.nombre,
      asunto: 'Verifica tu inicio de sesión en TaskConnect',
      html: `
            <p>Hola ${usuario.nombre},</p>
            <p>Haz clic en el botón para completar tu inicio de sesión. El enlace expira en ${minutos} minutos y solo puede usarse una vez.</p>
            <p><a href="${enlace}" style="background:#0d6efd;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Verificar inicio de sesión</a></p>
            <p>Si no fuiste tú, ignora este mensaje.</p>`
    });

    return { requiere2fa: true, correo: usuario.correo };
  }
}
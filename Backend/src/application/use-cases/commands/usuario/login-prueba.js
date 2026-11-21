import { NoEncontrado, NoAutorizado, Prohibido } from '../../../errors/errores.js';
import { armarPayload } from '../../../utils/sesion.js';

// SOLO PARA DESARROLLO/TESTING: login sin el paso del correo
export class LoginPrueba {
  constructor({ usuarioRepository, passwordHasher, tokenService, permitirLoginPrueba = false }) {
    this.usuarios = usuarioRepository;
    this.hasher = passwordHasher;
    this.tokenService = tokenService;
    this.permitido = permitirLoginPrueba; // viene de PERMITIR_LOGIN_PRUEBA
  }

  async execute({ correo, contrasena }) {
    if (!this.permitido) throw new NoEncontrado('Ruta no disponible');

    const usuario = await this.usuarios.buscarPorCorreo(correo);
    if (!usuario) throw new NoAutorizado('Credenciales inválidas');
    if (usuario.estado !== 'activo') throw new Prohibido('El usuario está inactivo');

    if (!(await this.hasher.comparar(contrasena, usuario.contrasena))) {
      throw new NoAutorizado('Credenciales inválidas');
    }

    const idsPerfil = await this.usuarios.obtenerIdsPerfil(usuario.id_usuario, usuario.rol);
    const payload = armarPayload(usuario, idsPerfil);

    return { token: this.tokenService.generar(payload), usuario: payload };
  }
}
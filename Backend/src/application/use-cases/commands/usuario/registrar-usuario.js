import { RegistrarUsuarioDto } from '../../../dtos/registrar-usuario.dto.js';
import { revisarDominioCorreo } from '../../../validations/validaciones.js';
import { ErrorValidacion, Conflicto } from '../../../errors/errores.js';

export class RegistrarUsuario {
  constructor({ usuarioRepository, passwordHasher, dominioCorreoVerificador, verificarDns = true }) {
    this.usuarios = usuarioRepository;
    this.hasher = passwordHasher;
    this.dominios = dominioCorreoVerificador;
    this.verificarDns = verificarDns; // en desarrollo sin internet se apaga con VERIFICAR_DNS_CORREO=false
  }

  async execute(datos) {
    const dto = new RegistrarUsuarioDto(datos).validar();

    // 1) lista de dominios de prueba, desechables y errores de tipeo (sin red)
    const errorDominio = revisarDominioCorreo(dto.correo);
    if (errorDominio) throw new ErrorValidacion(errorDominio);

    // 2) consulta DNS: ¿el dominio puede recibir correo?
    if (this.verificarDns) {
      const dominio = dto.correo.split('@')[1];
      if (!(await this.dominios.recibeCorreo(dominio))) {
        throw new ErrorValidacion(`El dominio "${dominio}" no existe o no recibe correos`);
      }
    }

    if (await this.usuarios.buscarPorCorreo(dto.correo)) {
      throw new Conflicto('Ya existe un usuario registrado con ese correo');
    }

    const contrasenaHash = await this.hasher.hash(dto.contrasena);

    // devuelve { usuario, perfil }
    return this.usuarios.registrar({
      nombre: dto.nombre,
      correo: dto.correo,
      contrasenaHash,
      telefono: dto.telefono,
      rol: dto.rol,
      perfil: dto.perfil
    });
  }
}
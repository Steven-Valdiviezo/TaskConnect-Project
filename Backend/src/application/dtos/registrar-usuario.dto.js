import {
  normalizarEspacios, normalizarTelefono, validarNombreCompleto, validarCorreo,
  validarTelefono, validarContrasena, validarPerfilPorRol
} from '../validations/validaciones.js';
import { ErrorValidacion } from '../errors/errores.js';

export class RegistrarUsuarioDto {
  constructor(datos = {}) {
    // se limpian los datos con las mismas reglas del frontend
    this.nombre = normalizarEspacios(datos.nombre);
    this.correo = String(datos.correo ?? '').trim().toLowerCase();
    this.telefono = normalizarTelefono(datos.telefono);
    this.contrasena = datos.contrasena;
    this.rol = datos.rol;
    this.perfil = datos.perfil ?? {};
  }

  // Valida todo lo que no necesita red ni base de datos; el DNS y el correo repetido los revisa el caso de uso
  validar() {
    if (!this.nombre || !this.correo || !this.contrasena || !this.rol) {
      throw new ErrorValidacion('nombre, correo, contrasena y rol son obligatorios');
    }

    if (!['cliente', 'freelancer'].includes(this.rol)) {
      throw new ErrorValidacion('El rol de registro público solo puede ser cliente o freelancer');
    }

    const errorBasico = validarNombreCompleto(this.nombre)
      || validarCorreo(this.correo)
      || validarTelefono(this.telefono);
    if (errorBasico) throw new ErrorValidacion(errorBasico);

    const fallas = validarContrasena(this.contrasena, { correo: this.correo, nombre: this.nombre });
    if (fallas.length) throw new ErrorValidacion(`Contraseña no válida: ${fallas.join('; ')}.`);

    validarPerfilPorRol(this.rol, this.perfil); // lanza 400 si algo del perfil no cumple
    return this;
  }
}
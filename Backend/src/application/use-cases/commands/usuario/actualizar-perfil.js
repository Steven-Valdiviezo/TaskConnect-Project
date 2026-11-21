import {
  normalizarEspacios, normalizarTelefono, validarNombreCompleto, validarTelefono, validarPerfilPorRol
} from '../../../validations/validaciones.js';
import { ErrorValidacion } from '../../../errors/errores.js';

export class ActualizarPerfil {
  constructor(usuarioRepository) {
    this.usuarios = usuarioRepository;
  }

  async execute(usuarioActual, datos) {
    const { telefono, empresa, direccion, id_profesion, descripcion, experiencia } = datos;
    const nombre = normalizarEspacios(datos.nombre);

    // El administrador conserva su nombre libre; clientes y freelancers: 2 nombres y 2 apellidos
    const errorNombre = usuarioActual.rol === 'administrador'
      ? (!nombre ? 'El nombre es obligatorio' : null)
      : validarNombreCompleto(nombre);
    if (errorNombre) throw new ErrorValidacion(errorNombre);

    const errorTel = validarTelefono(telefono);
    if (errorTel) throw new ErrorValidacion(errorTel);

    validarPerfilPorRol(usuarioActual.rol, { empresa, direccion, id_profesion, descripcion, experiencia });

    const usuario = await this.usuarios.actualizarPerfilUsuario(usuarioActual.id_usuario, {
      nombre,
      telefono: normalizarTelefono(telefono)
    });

    let perfil = null;
    if (usuarioActual.rol === 'cliente') {
      perfil = await this.usuarios.actualizarCliente(usuarioActual.id_usuario, {
        empresa: empresa ?? null,
        direccion: direccion ?? null
      });
    }
    if (usuarioActual.rol === 'freelancer') {
      perfil = await this.usuarios.actualizarFreelancer(usuarioActual.id_usuario, {
        id_profesion, descripcion, experiencia: experiencia ?? 0
      });
    }

    return { usuario, perfil };
  }
}
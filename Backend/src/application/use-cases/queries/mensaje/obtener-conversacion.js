export class ObtenerConversacion {
  constructor(mensajeRepository) {
    this.mensajes = mensajeRepository;
  }

  // Siempre entre el usuario autenticado y otro: nadie puede leer chats ajenos
  async execute(usuarioActual, otroUsuario) {
    return this.mensajes.obtenerConversacion(usuarioActual, otroUsuario);
  }
}
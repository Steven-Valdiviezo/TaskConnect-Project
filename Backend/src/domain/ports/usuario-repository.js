import { noImplementado } from './no-implementado.js';

const P = 'UsuarioRepository';

export class UsuarioRepository {
  async buscarPorCorreo(_correo) { noImplementado(P, 'buscarPorCorreo'); }   // fila completa, incluye el hash
  async buscarPorId(_id) { noImplementado(P, 'buscarPorId'); }               // sin contrasena
  async registrar(_datos) { noImplementado(P, 'registrar'); }                // transaccional: usuario + perfil -> { usuario, perfil }
  async obtenerIdsPerfil(_id_usuario, _rol) { noImplementado(P, 'obtenerIdsPerfil'); }
  async obtenerDatosCliente(_id_usuario) { noImplementado(P, 'obtenerDatosCliente'); }
  async obtenerDatosFreelancer(_id_usuario) { noImplementado(P, 'obtenerDatosFreelancer'); }
  async actualizarPerfilUsuario(_id_usuario, _datos) { noImplementado(P, 'actualizarPerfilUsuario'); }
  async actualizarCliente(_id_usuario, _datos) { noImplementado(P, 'actualizarCliente'); }
  async actualizarFreelancer(_id_usuario, _datos) { noImplementado(P, 'actualizarFreelancer'); }
  async obtenerPerfilPublicoFreelancer(_id_freelancer) { noImplementado(P, 'obtenerPerfilPublicoFreelancer'); }
  async obtenerPerfilFreelancerConContacto(_id_freelancer) { noImplementado(P, 'obtenerPerfilFreelancerConContacto'); }
  // administración de cuentas
  async listar(_filtros) { noImplementado(P, 'listar'); }
  async desactivar(_id_usuario) { noImplementado(P, 'desactivar'); }
  async reactivar(_id_usuario) { noImplementado(P, 'reactivar'); }
}
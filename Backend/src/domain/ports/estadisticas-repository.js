import { noImplementado } from './no-implementado.js';

const P = 'EstadisticasRepository';

export class EstadisticasRepository {
  // públicas (landing)
  async contarUsuariosPorRol() { noImplementado(P, 'contarUsuariosPorRol'); }
  async contarProyectos() { noImplementado(P, 'contarProyectos'); }
  async contarCategorias() { noImplementado(P, 'contarCategorias'); }
  // panel del administrador
  async contarUsuariosDetallado() { noImplementado(P, 'contarUsuariosDetallado'); }
  async contarProyectosDetallado() { noImplementado(P, 'contarProyectosDetallado'); }
  async proyectosPorCategoria() { noImplementado(P, 'proyectosPorCategoria'); }
  async freelancersPorProfesion() { noImplementado(P, 'freelancersPorProfesion'); }
  async contarPropuestas() { noImplementado(P, 'contarPropuestas'); }
  async contarContratos() { noImplementado(P, 'contarContratos'); }
  async sumarPagos() { noImplementado(P, 'sumarPagos'); }
}
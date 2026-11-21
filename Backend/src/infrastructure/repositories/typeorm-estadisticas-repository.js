import { EstadisticasRepository } from '../../domain/ports/estadisticas-repository.js';

export class TypeOrmEstadisticasRepository extends EstadisticasRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  // ---------- públicas (landing) ----------
  async contarUsuariosPorRol() {
    return this.dataSource.query(
      `SELECT rol, COUNT(*)::int AS total FROM usuario WHERE estado = 'activo' GROUP BY rol`
    );
  }

  async contarProyectos() {
    const filas = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE estado = 'abierto')::int AS total_abiertos,
              COUNT(*) FILTER (WHERE estado = 'finalizado')::int AS total_finalizados
       FROM proyecto`
    );
    return filas[0];
  }

  async contarCategorias() {
    const filas = await this.dataSource.query('SELECT COUNT(*)::int AS total FROM categoria');
    return filas[0].total;
  }

  // ---------- panel del administrador ----------
  async contarUsuariosDetallado() {
    return this.dataSource.query(
      `SELECT rol, estado, COUNT(*)::INT AS total FROM usuario GROUP BY rol, estado`
    );
  }

  async contarProyectosDetallado() {
    const filas = await this.dataSource.query(
      `SELECT COUNT(*)::INT AS total,
              COUNT(*) FILTER (WHERE estado = 'abierto')::INT AS total_abiertos,
              COUNT(*) FILTER (WHERE estado = 'ejecucion')::INT AS total_ejecucion,
              COUNT(*) FILTER (WHERE estado = 'finalizado')::INT AS total_finalizados,
              COUNT(*) FILTER (WHERE estado = 'cancelado')::INT AS total_cancelados
       FROM proyecto`
    );
    return filas[0];
  }

  async proyectosPorCategoria() {
    return this.dataSource.query(
      `SELECT c.id_categoria, c.nombre_categoria, COUNT(p.id_proyecto)::INT AS total
       FROM categoria c LEFT JOIN proyecto p ON p.id_categoria = c.id_categoria
       GROUP BY c.id_categoria, c.nombre_categoria
       ORDER BY total DESC`
    );
  }

  async freelancersPorProfesion() {
    return this.dataSource.query(
      `SELECT p.id_profesion, p.nombre, COUNT(f.id_freelancer)::INT AS total
       FROM profesion p LEFT JOIN freelancer f ON f.id_profesion = p.id_profesion
       GROUP BY p.id_profesion, p.nombre
       ORDER BY total DESC`
    );
  }

  async contarPropuestas() {
    const filas = await this.dataSource.query(
      `SELECT COUNT(*)::INT AS total,
              COUNT(*) FILTER (WHERE estado = 'aceptada')::INT AS total_aceptadas
       FROM propuesta`
    );
    return filas[0];
  }

  async contarContratos() {
    const filas = await this.dataSource.query(
      `SELECT COUNT(*)::INT AS total,
              COUNT(*) FILTER (WHERE estado = 'activo')::INT AS total_activos,
              COUNT(*) FILTER (WHERE estado = 'completado')::INT AS total_completados
       FROM contrato`
    );
    return filas[0];
  }

  async sumarPagos() {
    const filas = await this.dataSource.query(
      `SELECT COALESCE(SUM(monto),0)::NUMERIC(12,2) AS total_pagado,
              COALESCE(SUM(comision),0)::NUMERIC(12,2) AS total_comision,
              COALESCE(SUM(iva),0)::NUMERIC(12,2) AS total_iva
       FROM pago WHERE estado = 'pagado'`
    );
    return filas[0];
  }
}
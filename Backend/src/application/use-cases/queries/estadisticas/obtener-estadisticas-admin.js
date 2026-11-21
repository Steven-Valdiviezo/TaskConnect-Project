export class ObtenerEstadisticasAdmin {
  constructor(estadisticasRepository) {
    this.estadisticas = estadisticasRepository;
  }

  async execute() {
    const [usuariosDetalle, proyectos, categorias, profesiones, propuestas, contratos, pagos] = await Promise.all([
      this.estadisticas.contarUsuariosDetallado(),
      this.estadisticas.contarProyectosDetallado(),
      this.estadisticas.proyectosPorCategoria(),
      this.estadisticas.freelancersPorProfesion(),
      this.estadisticas.contarPropuestas(),
      this.estadisticas.contarContratos(),
      this.estadisticas.sumarPagos()
    ]);

    const sumarRol = (rol) => usuariosDetalle.filter((u) => u.rol === rol).reduce((a, u) => a + u.total, 0);
    const totalClientes = sumarRol('cliente');
    const totalFreelancers = sumarRol('freelancer');

    return {
      total_usuarios: totalClientes + totalFreelancers,
      total_clientes: totalClientes,
      total_freelancers: totalFreelancers,
      proyectos,
      proyectos_por_categoria: categorias,
      freelancers_por_profesion: profesiones,
      propuestas,
      contratos,
      monto_total_pagado: Number(pagos.total_pagado),
      comision_total: Number(pagos.total_comision),
      iva_total: Number(pagos.total_iva)
    };
  }
}
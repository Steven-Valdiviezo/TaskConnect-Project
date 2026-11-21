// Conteos agregados para la página de inicio; no incluye ningún dato sensible
export class ObtenerEstadisticasPublicas {
  constructor(estadisticasRepository) {
    this.estadisticas = estadisticasRepository;
  }

  async execute() {
    const [usuariosPorRol, proyectos, totalCategorias] = await Promise.all([
      this.estadisticas.contarUsuariosPorRol(),
      this.estadisticas.contarProyectos(),
      this.estadisticas.contarCategorias()
    ]);

    const totalClientes = usuariosPorRol.find((u) => u.rol === 'cliente')?.total ?? 0;
    const totalFreelancers = usuariosPorRol.find((u) => u.rol === 'freelancer')?.total ?? 0;

    return {
      total_clientes: totalClientes,
      total_freelancers: totalFreelancers,
      total_usuarios: totalClientes + totalFreelancers,
      total_proyectos: proyectos.total,
      total_proyectos_abiertos: proyectos.total_abiertos,
      total_proyectos_finalizados: proyectos.total_finalizados,
      total_categorias: totalCategorias
    };
  }
}
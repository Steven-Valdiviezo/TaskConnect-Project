export class EstadisticasController {
  // casos: { obtenerEstadisticasPublicas }
  constructor(casos) {
    this.casos = casos;
  }

  publicas = async (req, res) => {
    const estadisticas = await this.casos.obtenerEstadisticasPublicas.execute();
    res.json({ mensaje: 'Estadísticas públicas de la plataforma', estadisticas });
  };
}
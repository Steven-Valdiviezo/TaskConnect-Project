export class ObtenerTarifaIva {
  constructor(configuracionRepository) {
    this.configuracion = configuracionRepository;
  }

  // 15% si por algún motivo no existe la fila en la tabla configuracion
  async execute() {
    return (await this.configuracion.obtenerTarifaIva()) ?? 0.15;
  }
}
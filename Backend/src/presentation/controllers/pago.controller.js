export class PagoController {
  // casos: { registrarPago, marcarPagoPagado, obtenerPagoDeContrato }
  constructor(casos) {
    this.casos = casos;
  }

  registrar = async (req, res) => {
    const pago = await this.casos.registrarPago.execute(req.usuario.id_cliente, req.body);
    res.status(201).json({ mensaje: 'Pago registrado correctamente', pago });
  };

  marcarPagado = async (req, res) => {
    const pago = await this.casos.marcarPagoPagado.execute(req.usuario.id_cliente, Number(req.params.id));
    res.json({ mensaje: 'Pago confirmado como pagado', pago });
  };

  obtenerDeContrato = async (req, res) => {
    const pago = await this.casos.obtenerPagoDeContrato.execute(Number(req.params.idContrato));
    res.json({ mensaje: 'Pago del contrato', pago });
  };
}
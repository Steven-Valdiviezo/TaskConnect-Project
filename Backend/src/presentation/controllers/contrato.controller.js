export class ContratoController {
  // casos: { aceptarPropuesta, listarMisContratos, completarContrato, cancelarContrato }
  constructor(casos) {
    this.casos = casos;
  }

  aceptar = async (req, res) => {
    const contrato = await this.casos.aceptarPropuesta.execute(req.usuario.id_cliente, Number(req.params.idPropuesta));
    res.status(201).json({ mensaje: 'Contrato generado correctamente', contrato });
  };

  listarMios = async (req, res) => {
    const contratos = await this.casos.listarMisContratos.execute(req.usuario.id_usuario, req.usuario.rol);
    res.json({ mensaje: 'Contratos del usuario', total: contratos.length, contratos });
  };

  // ahora reciben el id_cliente para comprobar que el contrato sea suyo
  completar = async (req, res) => {
    const contrato = await this.casos.completarContrato.execute(req.usuario.id_cliente, Number(req.params.id));
    res.json({ mensaje: 'Contrato marcado como completado', contrato });
  };

  cancelar = async (req, res) => {
    const contrato = await this.casos.cancelarContrato.execute(req.usuario.id_cliente, Number(req.params.id));
    res.json({ mensaje: 'Contrato cancelado', contrato });
  };
}
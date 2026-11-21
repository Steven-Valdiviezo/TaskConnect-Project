export class ListarAuditoria {
  constructor(auditoriaRepository) {
    this.auditoria = auditoriaRepository;
  }

  async execute(filtros) {
    return this.auditoria.listar(filtros); // { tabla, limite }
  }
}
export class ProyectoSpecification {
  constructor({ id_categoria, presupuesto_min, presupuesto_max } = {}) {
    this.id_categoria = id_categoria;
    this.presupuesto_min = presupuesto_min;
    this.presupuesto_max = presupuesto_max;
  }

  hasFilters() {
    return Object.values(this).some((v) => v !== undefined && v !== null && v !== '');
  }
}
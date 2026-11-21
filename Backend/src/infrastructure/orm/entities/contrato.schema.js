import { EntitySchema } from 'typeorm';

export const ContratoSchema = new EntitySchema({
  name: 'Contrato',
  tableName: 'contrato',
  columns: {
    id_contrato: { type: 'int', primary: true, generated: true },
    id_proyecto: { type: 'int' },
    id_freelancer: { type: 'int' },
    fecha_inicio: { type: 'date' },
    fecha_fin: { type: 'date', nullable: true },
    estado: { type: 'varchar', length: 20, default: 'activo' }
  },
  relations: {
    proyecto: { type: 'many-to-one', target: 'Proyecto', joinColumn: { name: 'id_proyecto' } },
    freelancer: { type: 'many-to-one', target: 'Freelancer', joinColumn: { name: 'id_freelancer' } }
  }
});
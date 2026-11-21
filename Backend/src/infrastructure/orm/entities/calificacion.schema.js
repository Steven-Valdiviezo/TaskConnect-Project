import { EntitySchema } from 'typeorm';

export const CalificacionSchema = new EntitySchema({
  name: 'Calificacion',
  tableName: 'calificacion',
  columns: {
    id_calificacion: { type: 'int', primary: true, generated: true },
    id_contrato: { type: 'int' },
    id_calificador: { type: 'int' },
    id_calificado: { type: 'int' },
    puntuacion: { type: 'int' },
    comentario: { type: 'text', nullable: true },
    fecha: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }
  },
  relations: {
    contrato: { type: 'many-to-one', target: 'Contrato', joinColumn: { name: 'id_contrato' } },
    calificador: { type: 'many-to-one', target: 'Usuario', joinColumn: { name: 'id_calificador' } },
    calificado: { type: 'many-to-one', target: 'Usuario', joinColumn: { name: 'id_calificado' } }
  }
});
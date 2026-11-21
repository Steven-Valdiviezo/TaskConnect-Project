import { EntitySchema } from 'typeorm';

export const FreelancerSchema = new EntitySchema({
  name: 'Freelancer',
  tableName: 'freelancer',
  columns: {
    id_freelancer: { type: 'int', primary: true, generated: true },
    id_usuario: { type: 'int' },
    id_profesion: { type: 'int' },
    descripcion: { type: 'text' },
    experiencia: { type: 'int' }
  },
  relations: {
    usuario: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'id_usuario' }
    },
    profesion: {
      type: 'many-to-one',
      target: 'Profesion',
      joinColumn: { name: 'id_profesion' }
    }
  }
});
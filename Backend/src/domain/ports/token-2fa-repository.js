import { noImplementado } from './no-implementado.js';

const P = 'Token2faRepository';

export class Token2faRepository {
  async crear(_datos) { noImplementado(P, 'crear'); }          // { id_usuario, token_hash, minutos }; invalida los anteriores
  async consumir(_token_hash) { noImplementado(P, 'consumir'); } // atómico: devuelve { id_usuario } o undefined
}
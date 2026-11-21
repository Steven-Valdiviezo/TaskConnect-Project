import { noImplementado } from './no-implementado.js';

export class PasswordHasher {
  async hash(_plano) { noImplementado('PasswordHasher', 'hash'); }
  async comparar(_plano, _hash) { noImplementado('PasswordHasher', 'comparar'); }
}
import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../domain/ports/password-hasher.js';

export class BcryptPasswordHasher extends PasswordHasher {
  async hash(plano) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plano, salt);
  }

  async comparar(plano, hash) {
    return bcrypt.compare(plano, hash);
  }
}
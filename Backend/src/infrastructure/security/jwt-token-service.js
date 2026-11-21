import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/ports/token-service.js';

export class JwtTokenService extends TokenService {
  constructor({ secreto, expiraEn }) {
    super();
    this.secreto = secreto;
    this.expiraEn = expiraEn;
  }

  generar(payload) {
    return jwt.sign(payload, this.secreto, { expiresIn: this.expiraEn });
  }

  // lanza error si el token es inválido o expiró (el middleware lo convierte en 401)
  verificar(token) {
    return jwt.verify(token, this.secreto);
  }
}
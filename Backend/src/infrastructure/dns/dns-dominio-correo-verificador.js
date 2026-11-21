import { promises as dns } from 'node:dns';
import { DominioCorreoVerificador } from '../../domain/ports/dominio-correo-verificador.js';

// Solo se rechaza si el DNS dice claramente que NO existe. Si el DNS falla o tarda, se deja pasar
// para no bloquear a un usuario real por un problema de red.
const SIN_REGISTROS = ['ENOTFOUND', 'ENODATA'];

const conLimite = (promesa, ms) => {
  let timer;
  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), ms);
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(timer));
};

export class DnsDominioCorreoVerificador extends DominioCorreoVerificador {
  constructor({ resolver = dns, timeoutMs = 3000 } = {}) {
    super();
    this.resolver = resolver;
    this.timeoutMs = timeoutMs;
  }

  // ¿El dominio puede recibir correo? (registro MX; si no hay, el estándar permite A/AAAA)
  async recibeCorreo(dominio) {
    try {
      const mx = await conLimite(this.resolver.resolveMx(dominio), this.timeoutMs);
      // MX nulo (RFC 7505): el dominio declara que NO recibe correo
      if (mx.length === 1 && (mx[0].exchange === '' || mx[0].exchange === '.')) return false;
      if (mx.length) return true;
    } catch (e) {
      if (!SIN_REGISTROS.includes(e.code)) return true; // fallo de red/DNS: no bloquear
    }

    for (const tipo of ['resolve4', 'resolve6']) {
      try {
        const r = await conLimite(this.resolver[tipo](dominio), this.timeoutMs);
        if (r.length) return true;
      } catch (e) {
        if (!SIN_REGISTROS.includes(e.code)) return true;
      }
    }
    return false;
  }
}
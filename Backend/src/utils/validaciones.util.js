// Validaciones compartidas del backend. Replican las reglas del frontend
// (core/validators/validadores.ts) para que no se puedan saltar llamando a la API directo.
import { promises as dns } from 'node:dns';
export const CONTRASENA_MIN = 8;
export const CONTRASENA_MAX = 64;
const LONG_SECUENCIA = 3;

const REGEX_PALABRA = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}$/;
const REGEX_CORREO = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const COMUNES = ['password', 'contrasena', 'qwerty', 'asdfgh', 'zxcvbn', 'admin',
                 'welcome', 'letmein', 'iloveyou', 'taskconnect', 'freelancer', 'ecuador'];

export const normalizarEspacios = (t) => String(t ?? '').trim().replace(/\s+/g, ' ');
const sinTildes = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Lanza un error 400 que los controllers ya saben convertir en respuesta HTTP
export const lanzarError400 = (mensaje) => {
  const error = new Error(mensaje);
  error.status = 400;
  throw error;
};

// Cada validador devuelve un texto de error o null si todo está bien
export const validarNombreCompleto = (nombre) => {
  const v = normalizarEspacios(nombre);
  if (!v) return 'El nombre es obligatorio';
  if (v.length > 100) return 'El nombre no puede superar los 100 caracteres';
  const palabras = v.split(' ');
  if (palabras.length !== 4) return 'El nombre debe tener exactamente 2 nombres y 2 apellidos';
  if (!palabras.every(p => REGEX_PALABRA.test(p))) return 'El nombre solo puede contener letras (mínimo 2 por palabra)';
  return null;
};

export const validarCorreo = (correo) => {
  const v = String(correo ?? '').trim();
  if (!v) return 'El correo es obligatorio';
  const local = v.split('@')[0];
  if (v.length > 100 || local.length > 64 || v.includes('..') || local.startsWith('.') ||
      local.endsWith('.') || !REGEX_CORREO.test(v)) return 'El formato del correo no es válido';
  return null;
};

// Teléfono opcional (Ecuador). Si viene vacío, está bien.
export const validarTelefono = (telefono) => {
  const v = String(telefono ?? '').replace(/[\s-]/g, '');
  if (!v) return null;
  return /^(\+5939\d{8}|09\d{8}|(\+593|0)[2-7]\d{7})$/.test(v) ? null : 'El teléfono no es válido (ej. 0991234567)';
};

export const normalizarTelefono = (telefono) => {
  const v = String(telefono ?? '').replace(/[\s-]/g, '');
  return v || null;
};

const tieneSecuencia = (texto) => {
  const t = texto.toLowerCase();
  let asc = 1, desc = 1;
  for (let i = 1; i < t.length; i++) {
    const alnum = /[a-z0-9]/.test(t[i]) && /[a-z0-9]/.test(t[i - 1]);
    const dif = t.charCodeAt(i) - t.charCodeAt(i - 1);
    asc = alnum && dif === 1 ? asc + 1 : 1;
    desc = alnum && dif === -1 ? desc + 1 : 1;
    if (asc >= LONG_SECUENCIA || desc >= LONG_SECUENCIA) return true;
  }
  return false;
};

const contieneDatosPersonales = (clave, correo, nombre) => {
  const c = sinTildes(clave);
  const local = sinTildes(String(correo ?? '').split('@')[0]);
  const partesCorreo = local.split(/[._+-]/).filter(p => p.length >= 4);
  const partesNombre = sinTildes(normalizarEspacios(nombre)).split(' ').filter(p => p.length >= 4);
  if (local.length >= 3 && c.includes(local)) return true;
  return [...partesCorreo, ...partesNombre].some(p => c.includes(p));
};

// Devuelve la lista de reglas que NO se cumplen (vacía = contraseña aceptada)
export const validarContrasena = (contrasena, { correo = '', nombre = '' } = {}) => {
  const c = String(contrasena ?? '');
  const fallas = [];
  if (c.length < CONTRASENA_MIN || c.length > CONTRASENA_MAX) fallas.push(`debe tener entre ${CONTRASENA_MIN} y ${CONTRASENA_MAX} caracteres`);
  if (!/\p{Lu}/u.test(c)) fallas.push('debe tener una letra mayúscula');
  if (!/\p{Ll}/u.test(c)) fallas.push('debe tener una letra minúscula');
  if (!/\d/.test(c)) fallas.push('debe tener un número');
  if (!/[^\p{L}\p{N}\s]/u.test(c)) fallas.push('debe tener un carácter especial');
  if (/\s/.test(c)) fallas.push('no puede tener espacios');
  if (tieneSecuencia(c) || /(.)\1{2,}/i.test(c)) fallas.push('no puede tener secuencias (123, abc) ni caracteres repetidos (aaa)');
  if (COMUNES.some(p => sinTildes(c).includes(p))) fallas.push('no puede contener palabras comunes');
  if (contieneDatosPersonales(c, correo, nombre)) fallas.push('no puede contener tu nombre ni tu correo');
  return fallas;
};

// Texto obligatorio con largo mínimo y máximo (títulos, descripciones, mensajes)
export const validarTexto = (valor, etiqueta, min, max) => {
  const v = String(valor ?? '').trim();
  if (!v) return `${etiqueta} es obligatorio`;
  if (v.length < min) return `${etiqueta} debe tener al menos ${min} caracteres`;
  if (v.length > max) return `${etiqueta} no puede superar los ${max} caracteres`;
  return null;
};

// Dinero positivo, máximo 2 decimales y tope superior
export const validarMonto = (valor, etiqueta, max) => {
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) return `${etiqueta} debe ser mayor a 0`;
  if (n > max) return `${etiqueta} no puede superar $${max}`;
  if (!/^\d+(\.\d{1,2})?$/.test(String(valor))) return `${etiqueta} admite máximo 2 decimales`;
  return null;
};

// ===== Verificación de correos reales =====

// Mismas listas que el frontend (core/validators/validadores.ts)
const DOMINIOS_FALSOS = new Set(['example.com', 'example.org', 'example.net', 'test.com', 'ejemplo.com', 'prueba.com',
  'correo.com', 'micorreo.com', 'tucorreo.com', 'dominio.com', 'domain.com']);
const TLD_RESERVADOS = ['test', 'example', 'invalid', 'localhost', 'local'];
const DOMINIOS_DESECHABLES = new Set(['mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com']);
const ERRORES_TIPEO = { 'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com', 'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'icloud.con': 'icloud.com' };

// Revisión rápida (sin red) del dominio: devuelve el error o null
export const revisarDominioCorreo = (correo) => {
  const dominio = String(correo ?? '').split('@')[1]?.toLowerCase() ?? '';
  if (!dominio) return null;
  if (ERRORES_TIPEO[dominio]) return `Revisa el dominio, ¿quisiste decir ${ERRORES_TIPEO[dominio]}?`;
  const partes = dominio.split('.');
  const padres = partes.map((_, i) => partes.slice(i).join('.'));
  if (padres.some(d => DOMINIOS_FALSOS.has(d)) || TLD_RESERVADOS.includes(partes[partes.length - 1])) {
    return 'Usa un correo real: los dominios de prueba (example.com, correo.com...) no se aceptan';
  }
  if (padres.some(d => DOMINIOS_DESECHABLES.has(d))) return 'No se aceptan correos temporales o desechables';
  return null;
};

// Consulta DNS: ¿el dominio puede recibir correo? (registro MX; si no hay, el estándar permite A/AAAA)
// Solo se rechaza si el DNS dice claramente que NO existe. Si el DNS falla o tarda, se deja pasar
// para no bloquear a un usuario real por un problema de red.
const SIN_REGISTROS = ['ENOTFOUND', 'ENODATA'];

const consultar = (promesa, ms) => {
  let timer;
  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), ms);
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(timer));
};

export const dominioRecibeCorreo = async (dominio, { resolver = dns, timeoutMs = 3000 } = {}) => {
  try {
    const mx = await consultar(resolver.resolveMx(dominio), timeoutMs);
    // MX nulo (RFC 7505): el dominio declara que NO recibe correo
    if (mx.length === 1 && (mx[0].exchange === '' || mx[0].exchange === '.')) return false;
    if (mx.length) return true;
  } catch (e) {
    if (!SIN_REGISTROS.includes(e.code)) return true; // fallo de red/DNS: no bloquear
  }
  for (const tipo of ['resolve4', 'resolve6']) {
    try {
      const r = await consultar(resolver[tipo](dominio), timeoutMs);
      if (r.length) return true;
    } catch (e) {
      if (!SIN_REGISTROS.includes(e.code)) return true;
    }
  }
  return false;
};

// Validación completa para el registro. Se puede apagar con VERIFICAR_DNS_CORREO=false (ej. desarrollo sin internet)
export const validarCorreoReal = async (correo, opciones) => {
  const errorLista = revisarDominioCorreo(correo);
  if (errorLista) return errorLista;
  if (process.env.VERIFICAR_DNS_CORREO === 'false') return null;
  const dominio = String(correo).split('@')[1].toLowerCase();
  return (await dominioRecibeCorreo(dominio, opciones)) ? null : `El dominio "${dominio}" no existe o no recibe correos`;
};
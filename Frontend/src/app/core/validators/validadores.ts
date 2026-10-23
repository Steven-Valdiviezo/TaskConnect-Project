import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ===== Constantes: si el docente pide otros límites, se cambian solo aquí =====
export const CONTRASENA_MIN = 8;
export const CONTRASENA_MAX = 64;
const LONG_SECUENCIA = 3; // "123", "abc", "cba" ya cuentan como secuencia

const REGEX_PALABRA = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}$/;
const REGEX_CORREO = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Palabras que no deben aparecer dentro de una contraseña
const COMUNES = [
  'password', 'contrasena', 'qwerty', 'asdfgh', 'zxcvbn', 'admin',
  'welcome', 'letmein', 'iloveyou', 'taskconnect', 'freelancer', 'ecuador'
];
// Dominios de prueba, reservados (RFC 2606) y correos desechables que no se aceptan al registrarse
const DOMINIOS_FALSOS = new Set([
  'example.com', 'example.org', 'example.net', 'test.com', 'ejemplo.com', 'prueba.com',
  'correo.com', 'micorreo.com', 'tucorreo.com', 'dominio.com', 'domain.com'
]);
const TLD_RESERVADOS = ['test', 'example', 'invalid', 'localhost', 'local'];
const DOMINIOS_DESECHABLES = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com'
]);
// Errores de tipeo frecuentes -> dominio correcto
const ERRORES_TIPEO: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com', 'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'icloud.con': 'icloud.com'
};

// Revisa el dominio de un correo; devuelve el mensaje de error o null si está bien
export function revisarDominioCorreo(correo: string): string | null {
  const dominio = (correo.split('@')[1] ?? '').toLowerCase();
  if (!dominio) return null;
  if (ERRORES_TIPEO[dominio]) return `Revisa el dominio, ¿quisiste decir ${ERRORES_TIPEO[dominio]}?`;
  // también cuenta si es un subdominio (ej. algo.example.com)
  const partes = dominio.split('.');
  const padres = partes.map((_, i) => partes.slice(i).join('.'));
  if (padres.some(d => DOMINIOS_FALSOS.has(d)) || TLD_RESERVADOS.includes(partes[partes.length - 1])) {
    return 'Usa un correo real: los dominios de prueba (example.com, correo.com...) no se aceptan.';
  }
  if (padres.some(d => DOMINIOS_DESECHABLES.has(d))) return 'No se aceptan correos temporales o desechables.';
  return null;
}
// ===== Utilidades =====
export function normalizar(texto: string | null | undefined): string {
  return (texto ?? '').trim().replace(/\s+/g, ' ');
}

const sinTildes = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// ===== Validadores simples =====

/** Validators.required deja pasar "   "; este no (la BD tiene CHECK LENGTH(TRIM(x)) > 0) */
export const sinSoloEspacios: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  return typeof v === 'string' && v.length > 0 && v.trim().length === 0 ? { soloEspacios: true } : null;
};

/** Exactamente 2 nombres + 2 apellidos = 4 palabras, solo letras */
export const nombreCompleto: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = normalizar(c.value);
  if (!v) return null; // de lo vacío se encarga Validators.required
  const palabras = v.split(' ');
  if (palabras.length !== 4) {
    return { nombreCompleto: 'Escribe exactamente 2 nombres y 2 apellidos (4 palabras).' };
  }
  if (!palabras.every(p => REGEX_PALABRA.test(p))) {
    return { nombreCompleto: 'Solo letras, mínimo 2 por palabra (sin números ni símbolos).' };
  }
  return null;
};

/** Más estricto que Validators.email (que acepta "a@b" sin dominio) */
export const correoValido: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  const local = v.split('@')[0];
  const mal = v.length > 100 || local.length > 64 || v.includes('..') ||
              local.startsWith('.') || local.endsWith('.') || !REGEX_CORREO.test(v);
  return mal ? { correoInvalido: true } : null;
};
/** Solo para el REGISTRO: formato + dominio real. En el login NO se usa (cuentas viejas con dominios de prueba deben poder entrar). */
export const correoRegistro: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const formato = correoValido(c);
  if (formato) return formato;
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  const msg = revisarDominioCorreo(v);
  return msg ? { dominioCorreo: msg } : null;
};

/** Teléfono de Ecuador: móvil 09XXXXXXXX, fijo 0[2-7]XXXXXXX, con o sin +593. Es opcional. */
export const telefonoEcuador: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').replace(/[\s-]/g, '');
  if (!v) return null;
  return /^(\+5939\d{8}|09\d{8}|(\+593|0)[2-7]\d{7})$/.test(v) ? null : { telefono: true };
};

/** Dinero con máximo 2 decimales (la BD usa DECIMAL(10,2)) */
export const maxDosDecimales: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  if (v === null || v === undefined || v === '') return null;
  return /^\d+(\.\d{1,2})?$/.test(String(v)) ? null : { decimales: true };
};

/** La fecha (yyyy-mm-dd) no puede ser anterior a hoy */
export const fechaNoPasada: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  if (!v) return null;
  const [a, m, d] = String(v).split('-').map(Number);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(a, m - 1, d) < hoy ? { fechaPasada: true } : null;
};

// ===== Contraseña =====
export interface ReglaContrasena { ok: boolean; texto: string; detalle: string; }

function tieneSecuencia(texto: string): boolean {
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
}

function contieneDatosPersonales(clave: string, correo: string, nombre: string): boolean {
  const c = sinTildes(clave);
  const local = sinTildes((correo ?? '').split('@')[0]);
  const partesCorreo = local.split(/[._+-]/).filter(p => p.length >= 4);
  const partesNombre = sinTildes(normalizar(nombre)).split(' ').filter(p => p.length >= 4);
  if (local.length >= 3 && c.includes(local)) return true;
  return [...partesCorreo, ...partesNombre].some(p => c.includes(p));
}

/** Devuelve cada regla con ok/no ok; sirve para el validador y para los chips en pantalla.
 *  texto = versión corta (chip), detalle = explicación completa (tooltip y errores) */
export function evaluarContrasena(clave: string, correo = '', nombre = ''): ReglaContrasena[] {
  const c = clave ?? '';
  const minus = sinTildes(c);
  return [
    { ok: c.length >= CONTRASENA_MIN && c.length <= CONTRASENA_MAX, texto: `${CONTRASENA_MIN}-${CONTRASENA_MAX} caracteres`,
      detalle: `Entre ${CONTRASENA_MIN} y ${CONTRASENA_MAX} caracteres` },
    { ok: /\p{Lu}/u.test(c), texto: 'Mayúscula', detalle: 'Una letra mayúscula' },
    { ok: /\p{Ll}/u.test(c), texto: 'Minúscula', detalle: 'Una letra minúscula' },
    { ok: /\d/.test(c), texto: 'Número', detalle: 'Un número' },
    { ok: /[^\p{L}\p{N}\s]/u.test(c), texto: 'Carácter especial', detalle: 'Un carácter especial (! @ # $ % & * ...)' },
    { ok: !/\s/.test(c), texto: 'Sin espacios', detalle: 'Sin espacios' },
    { ok: !tieneSecuencia(c) && !/(.)\1{2,}/i.test(c), texto: 'Sin secuencias',
      detalle: 'Sin secuencias (123, abc) ni caracteres repetidos (aaa)' },
    { ok: !COMUNES.some(p => minus.includes(p)) && !contieneDatosPersonales(c, correo, nombre),
      texto: 'Sin palabras comunes ni tus datos',
      detalle: 'No usar palabras comunes (password, qwerty...) ni contener tu nombre ni tu correo' }
  ];
}

// ===== Barra de fortaleza =====
export interface FuerzaContrasena { nivel: 0 | 1 | 2 | 3 | 4; etiqueta: string; clase: string; }

/** Nivel 0-4 para la barra. Si falta alguna regla nunca pasa de "Media";
 *  cuando cumple todas, la longitud marca la diferencia (NIST prioriza longitud sobre complejidad). */
export function fuerzaContrasena(clave: string, correo = '', nombre = ''): FuerzaContrasena {
  const c = clave ?? '';
  if (!c) return { nivel: 0, etiqueta: '', clase: 'bg-secondary' };
  const reglas = evaluarContrasena(c, correo, nombre);
  const cumplidas = reglas.filter(r => r.ok).length;
  if (cumplidas < reglas.length) {
    return cumplidas <= reglas.length - 3
      ? { nivel: 1, etiqueta: 'Débil', clase: 'bg-danger' }
      : { nivel: 2, etiqueta: 'Media', clase: 'bg-warning' };
  }
  return c.length >= 12
    ? { nivel: 4, etiqueta: 'Muy fuerte', clase: 'bg-success' }
    : { nivel: 3, etiqueta: 'Fuerte', clase: 'bg-success' };
}

/** Valida la contraseña leyendo correo y nombre del formulario padre */
export const politicaContrasena: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value ?? '';
  if (!v) return null;
  const g = c.parent;
  const fallas = evaluarContrasena(v, g?.get('correo')?.value, g?.get('nombre')?.value).filter(r => !r.ok);
  return fallas.length ? { contrasenaDebil: fallas.map(f => f.detalle) } : null;
};

/** Para el grupo del formulario: contraseña y confirmación deben ser iguales */
export const contrasenasIguales: ValidatorFn = (g: AbstractControl): ValidationErrors | null => {
  const a = g.get('contrasena')?.value;
  const b = g.get('confirmar')?.value;
  return a && b && a !== b ? { noCoinciden: true } : null;
};

// ===== Mensaje de error para mostrar en las plantillas =====
export function mensajeError(c: AbstractControl | null): string {
  const e = c?.errors;
  if (!e) return '';
  if (e['required']) return 'Este campo es obligatorio.';
  if (e['soloEspacios']) return 'No puede contener solo espacios.';
  if (e['dominioCorreo']) return e['dominioCorreo'];
  if (e['correoInvalido']) return 'Ingresa un correo válido (ej. nombre@dominio.com).';
  if (e['nombreCompleto']) return e['nombreCompleto'];
  if (e['telefono']) return 'Teléfono no válido. Ej: 0991234567 o +593991234567.';
  if (e['contrasenaDebil']) return 'La contraseña no cumple los requisitos.';
  if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres.`;
  if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
  if (e['min']) return `El valor mínimo es ${e['min'].min}.`;
  if (e['max']) return `El valor máximo es ${e['max'].max}.`;
  if (e['decimales']) return 'Usa máximo 2 decimales.';
  if (e['fechaPasada']) return 'La fecha no puede ser anterior a hoy.';
  if (e['pattern']) return 'El formato no es válido.';
  return 'Valor no válido.';
}
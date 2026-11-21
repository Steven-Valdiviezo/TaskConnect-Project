// Uso: node scripts/comparar-apis.js <correoCliente> <claveCliente> <correoFreelancer> <claveFreelancer> <correoAdmin> <claveAdmin>
const VIEJA = process.env.API_VIEJA ?? 'http://localhost:3000';
const NUEVA = process.env.API_NUEVA ?? 'http://localhost:3001';
const [, , cCorreo, cClave, fCorreo, fClave, aCorreo, aClave] = process.argv;

// ---------- utilidades ----------
const canonico = (v) =>
  Array.isArray(v) ? v.map(canonico)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonico(v[k])]))
      : v;

const primeraDiferencia = (a, b, ruta = '') => {
  if (typeof a !== typeof b || (a === null) !== (b === null)) return `${ruta}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`;
  if (a && typeof a === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const d = primeraDiferencia(a[k], b[k], `${ruta}.${k}`);
      if (d) return d;
    }
    return null;
  }
  return a === b ? null : `${ruta}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`;
};

const pedir = async (base, metodo, ruta, { token, cuerpo } = {}) => {
  const r = await fetch(base + ruta, {
    method: metodo,
    headers: { ...(cuerpo && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  const texto = await r.text();
  let cuerpoRespuesta;
  try { cuerpoRespuesta = JSON.parse(texto); } catch { cuerpoRespuesta = texto; }
  return { status: r.status, cuerpo: cuerpoRespuesta };
};

const iniciarSesion = async (correo, contrasena) => {
  const r = await pedir(VIEJA, 'POST', '/api/usuarios/login-prueba', { cuerpo: { correo, contrasena } });
  if (r.status !== 200) throw new Error(`No se pudo iniciar sesión con ${correo}: ${r.status} ${JSON.stringify(r.cuerpo)}`);
  return r.cuerpo.token;
};

let iguales = 0;
const diferencias = [];

const comparar = async (ruta, token) => {
  const [v, n] = await Promise.all([pedir(VIEJA, 'GET', ruta, { token }), pedir(NUEVA, 'GET', ruta, { token })]);
  const dif = v.status !== n.status
    ? `estado HTTP ${v.status} vs ${n.status}`
    : primeraDiferencia(canonico(v.cuerpo), canonico(n.cuerpo));

  if (!dif) {
    iguales++;
    console.log('OK   ', v.status, ruta);
  } else {
    diferencias.push(ruta);
    console.log('DIFF ', ruta, '\n       ->', dif);
  }
};

// ---------- peticiones ----------
console.log('--- públicas ---');
for (const ruta of [
  '/', '/api/estadisticas', '/api/categorias', '/api/profesiones', '/api/metodos-pago', '/api/configuracion',
  '/api/proyectos', '/api/proyectos?presupuesto_min=100&presupuesto_max=500', '/api/proyectos?id_categoria=6',
  '/api/proyectos/1', '/api/proyectos/14', '/api/proyectos/99999',
  '/api/usuarios/freelancer/1', '/api/usuarios/freelancer/99999',
  '/api/calificaciones/usuario/2', '/api/calificaciones/reputacion/1', '/api/calificaciones/reputacion/99999'
]) await comparar(ruta);

console.log('--- sin token / token falso ---');
await comparar('/api/proyectos/mios');
await comparar('/api/proyectos/mios', 'token-falso');

if (cCorreo && cClave) {
  console.log('--- cliente ---');
  const token = await iniciarSesion(cCorreo, cClave);
  for (const ruta of [
    '/api/usuarios/perfil', '/api/proyectos/mios', '/api/propuestas/mias/recibidas', '/api/propuestas/proyecto/14',
    '/api/contratos/mios', '/api/mensajes/no-leidos', '/api/mensajes/conversacion/11',
    '/api/calificaciones/mias/emitidas', '/api/pagos/contrato/11', '/api/pagos/contrato/99999',
    '/api/usuarios/freelancer/4/contacto', '/api/usuarios/freelancer/1/contacto',
    '/api/propuestas/mias/enviadas', '/api/admin/usuarios'   // estas dos deben dar 403 en ambas
  ]) await comparar(ruta, token);
}

if (fCorreo && fClave) {
  console.log('--- freelancer ---');
  const token = await iniciarSesion(fCorreo, fClave);
  for (const ruta of [
    '/api/usuarios/perfil', '/api/propuestas/mias/enviadas', '/api/contratos/mios',
    '/api/mensajes/no-leidos', '/api/mensajes/conversacion/10', '/api/calificaciones/mias/emitidas',
    '/api/proyectos/mios', '/api/usuarios/freelancer/4/contacto'   // estas dos deben dar 403 en ambas
  ]) await comparar(ruta, token);
}

if (aCorreo && aClave) {
  console.log('--- administrador ---');
  const token = await iniciarSesion(aCorreo, aClave);
  for (const ruta of [
    '/api/usuarios/perfil', '/api/admin/usuarios', '/api/admin/usuarios?rol=cliente&estado=activo',
    '/api/admin/auditoria?limite=5', '/api/admin/auditoria?tabla=contrato', '/api/admin/estadisticas'
  ]) await comparar(ruta, token);
}

console.log(`\nResultado: ${iguales} iguales, ${diferencias.length} con diferencias`);
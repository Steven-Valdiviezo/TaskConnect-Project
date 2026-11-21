// Uso: node scripts/limpiar-pruebas.js <correoCliente> <claveCliente>
// Cancela los proyectos "Prueba flujo hexagonal" que sigan abiertos o en ejecución
const API = process.env.API_NUEVA ?? 'http://localhost:3000';
const [, , correo, contrasena] = process.argv;

const pedir = async (metodo, ruta, { token, cuerpo } = {}) => {
  const r = await fetch(API + ruta, {
    method: metodo,
    headers: { ...(cuerpo && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  return { status: r.status, cuerpo: await r.json() };
};

const sesion = await pedir('POST', '/api/usuarios/login-prueba', { cuerpo: { correo, contrasena } });
if (sesion.status !== 200) throw new Error(`No se pudo iniciar sesión: ${JSON.stringify(sesion.cuerpo)}`);
const token = sesion.cuerpo.token;

const mios = await pedir('GET', '/api/proyectos/mios', { token });
const pendientes = mios.cuerpo.proyectos.filter(
  (p) => p.titulo.startsWith('Prueba flujo hexagonal') && ['abierto', 'ejecucion'].includes(p.estado)
);
console.log(`Proyectos de prueba por cancelar: ${pendientes.length}`);

for (const p of pendientes) {
  const r = await pedir('PATCH', `/api/proyectos/${p.id_proyecto}/cancelar`, { token });
  console.log(r.status === 200 ? 'OK   ' : 'FALLA', `#${p.id_proyecto}`, p.titulo, `(${p.estado})`, '->', r.status);
}
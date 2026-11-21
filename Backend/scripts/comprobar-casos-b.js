import { RegistrarUsuario } from '../src/application/use-cases/commands/usuario/registrar-usuario.js';
import { LoginUsuario } from '../src/application/use-cases/commands/usuario/login-usuario.js';
import { ConfirmarLogin2FA } from '../src/application/use-cases/commands/usuario/confirmar-login-2fa.js';
import { LoginPrueba } from '../src/application/use-cases/commands/usuario/login-prueba.js';
import { ActualizarPerfil } from '../src/application/use-cases/commands/usuario/actualizar-perfil.js';
import { ObtenerPerfil } from '../src/application/use-cases/queries/usuario/obtener-perfil.js';
import { ObtenerPerfilFreelancerConContacto } from '../src/application/use-cases/queries/usuario/obtener-perfil-freelancer-con-contacto.js';
import { DesactivarUsuario } from '../src/application/use-cases/commands/admin/desactivar-usuario.js';
import { ReactivarUsuario } from '../src/application/use-cases/commands/admin/reactivar-usuario.js';

// ---------- fakes en memoria ----------
const usuariosBD = [
  { id_usuario: 1, nombre: 'ANA MARIA TORRES PEREZ', correo: 'ana@gmail.com', contrasena: 'HASH:Clave#Prueba7x', rol: 'cliente', estado: 'activo' },
  { id_usuario: 2, nombre: 'LUIS ANDRES RUIZ SOLIS', correo: 'luis@gmail.com', contrasena: 'HASH:Clave#Prueba7x', rol: 'freelancer', estado: 'inactivo' }
];

const usuarioRepository = {
  buscarPorCorreo: async (c) => usuariosBD.find((u) => u.correo === String(c).toLowerCase()),
  buscarPorId: async (id) => usuariosBD.find((u) => u.id_usuario === id),
  obtenerIdsPerfil: async (id, rol) => (rol === 'cliente' ? { id_cliente: 7 } : { id_freelancer: 9 }),
  obtenerDatosCliente: async () => ({ id_cliente: 7, empresa: 'Demo', direccion: 'Calle 1' }),
  registrar: async (d) => ({ usuario: { id_usuario: 99, nombre: d.nombre.toUpperCase(), correo: d.correo }, perfil: d.perfil, hash: d.contrasenaHash }),
  actualizarPerfilUsuario: async (id, d) => ({ id_usuario: id, ...d }),
  actualizarCliente: async (id, d) => d,
  obtenerPerfilFreelancerConContacto: async (id) => ({ id_freelancer: id, correo: 'f@correo.com' }),
  desactivar: async (id) => usuariosBD.find((u) => u.id_usuario === id && u.estado === 'activo'),
  reactivar: async (id) => usuariosBD.find((u) => u.id_usuario === id && u.estado === 'inactivo')
};

const guardados = [];
const token2faRepository = {
  crear: async (d) => { guardados.push({ ...d, usado: false }); },
  consumir: async (hash) => {
    const t = guardados.find((x) => x.token_hash === hash && !x.usado);
    if (!t) return undefined;
    t.usado = true;
    return { id_usuario: t.id_usuario };
  }
};

let ultimoCorreo;
const mailSender = { enviar: async (m) => { ultimoCorreo = m; } };
const passwordHasher = { hash: async (p) => 'HASH:' + p, comparar: async (p, h) => h === 'HASH:' + p };
const tokenService = { generar: (p) => 'JWT.' + Buffer.from(JSON.stringify(p)).toString('base64') };
const dominioCorreoVerificador = { recibeCorreo: async (d) => d !== 'noexiste.xyz' };
const contratoRepository = { existeEntreClienteYFreelancer: async (cliente, freelancer) => freelancer === 1 };

// ---------- helper ----------
const corto = (r) => (JSON.stringify(r) ?? '').slice(0, 130);
const probar = async (etiqueta, fn) => {
  try {
    console.log('OK   ', etiqueta, '->', corto(await fn()));
  } catch (e) {
    console.log('ERROR', etiqueta, '->', e.constructor.name, e.status, '|', e.message);
  }
};

// ---------- registro ----------
console.log('--- registro ---');
const registrar = new RegistrarUsuario({ usuarioRepository, passwordHasher, dominioCorreoVerificador, verificarDns: true });
const datosOk = { nombre: 'ana  maria torres perez', correo: 'Ana.Nueva@Gmail.com', contrasena: 'Tr4#bPx!9v', telefono: '0991234567', rol: 'cliente', perfil: { empresa: 'Demo' } };

await probar('faltan campos (400)', () => registrar.execute({ correo: 'a@gmail.com' }));
await probar('rol administrador (400)', () => registrar.execute({ ...datosOk, rol: 'administrador' }));
await probar('nombre con 2 palabras (400)', () => registrar.execute({ ...datosOk, nombre: 'Ana Torres' }));
await probar('contraseña débil (400)', () => registrar.execute({ ...datosOk, contrasena: '12345678' }));
await probar('freelancer sin profesión (400)', () => registrar.execute({ ...datosOk, rol: 'freelancer', perfil: { descripcion: 'x'.repeat(30) } }));
await probar('dominio de prueba (400)', () => registrar.execute({ ...datosOk, correo: 'ana.nueva@example.com' }));
await probar('dominio sin DNS (400)', () => registrar.execute({ ...datosOk, correo: 'ana.nueva@noexiste.xyz' }));
await probar('correo repetido (409)', () => registrar.execute({ ...datosOk, correo: 'ANA@gmail.com' }));
await probar('registro válido (OK, hash y nombre en mayúsculas)', () => registrar.execute(datosOk));

// ---------- login en dos pasos ----------
console.log('--- login ---');
const login = new LoginUsuario({ usuarioRepository, token2faRepository, passwordHasher, mailSender, config: { frontendUrl: 'https://front.test', minutosExpiracion: 10 } });
const confirmar = new ConfirmarLogin2FA({ usuarioRepository, token2faRepository, tokenService });

await probar('correo inexistente (401)', () => login.execute({ correo: 'nadie@gmail.com', contrasena: 'x' }));
await probar('usuario inactivo (403)', () => login.execute({ correo: 'luis@gmail.com', contrasena: 'Clave#Prueba7x' }));
await probar('contraseña incorrecta (401)', () => login.execute({ correo: 'ana@gmail.com', contrasena: 'mala' }));
await probar('login correcto: pide 2FA', () => login.execute({ correo: 'ana@gmail.com', contrasena: 'Clave#Prueba7x' }));

const token = ultimoCorreo?.html.match(/token=([a-f0-9]{64})/)?.[1];
console.log('       enlace en el correo:', ultimoCorreo?.html.match(/https:\/\/[^"]+/)?.[0].slice(0, 70) + '...');
console.log('       a la BD solo llega el hash (64 hex):', guardados[0]?.token_hash.length === 64 && guardados[0].token_hash !== token);

await probar('confirmar sin token (400)', () => confirmar.execute({}));
await probar('confirmar token falso (401)', () => confirmar.execute({ token: 'abc' }));
await probar('confirmar token válido (JWT + id_cliente)', () => confirmar.execute({ token }));
await probar('confirmar el mismo token otra vez (401)', () => confirmar.execute({ token }));

// ---------- login de prueba ----------
console.log('--- login de prueba ---');
const credenciales = { correo: 'ana@gmail.com', contrasena: 'Clave#Prueba7x' };
await probar('desactivado (404)', () => new LoginPrueba({ usuarioRepository, passwordHasher, tokenService, permitirLoginPrueba: false }).execute(credenciales));
await probar('activado (OK)', () => new LoginPrueba({ usuarioRepository, passwordHasher, tokenService, permitirLoginPrueba: true }).execute(credenciales));

// ---------- perfil ----------
console.log('--- perfil ---');
const actualizar = new ActualizarPerfil(usuarioRepository);
const cliente = { id_usuario: 1, rol: 'cliente', id_cliente: 7 };
await probar('perfil del usuario 1', () => new ObtenerPerfil(usuarioRepository).execute(1));
await probar('actualizar con nombre de 2 palabras (400)', () => actualizar.execute(cliente, { nombre: 'Ana Torres' }));
await probar('administrador sin nombre (400)', () => actualizar.execute({ id_usuario: 5, rol: 'administrador' }, { nombre: '  ' }));
await probar('actualizar cliente válido', () => actualizar.execute(cliente, { nombre: 'Ana Maria Torres Perez', telefono: '0991234567', empresa: 'Demo' }));

const conContacto = new ObtenerPerfilFreelancerConContacto({ usuarioRepository, contratoRepository });
await probar('contacto: usuario freelancer (403)', () => conContacto.execute({ rol: 'freelancer' }, 1));
await probar('contacto: sin contrato (403)', () => conContacto.execute(cliente, 3));
await probar('contacto: con contrato (OK)', () => conContacto.execute(cliente, 1));

// ---------- administración ----------
console.log('--- administración ---');
const admin = { id_usuario: 5, rol: 'administrador' };
await probar('desactivarse a sí mismo (400)', () => new DesactivarUsuario(usuarioRepository).execute(admin, 5));
await probar('desactivar inexistente (404)', () => new DesactivarUsuario(usuarioRepository).execute(admin, 999));
await probar('desactivar usuario activo (OK)', () => new DesactivarUsuario(usuarioRepository).execute(admin, 1));
await probar('reactivar usuario ya activo (404)', () => new ReactivarUsuario(usuarioRepository).execute(1));
await probar('reactivar usuario inactivo (OK)', () => new ReactivarUsuario(usuarioRepository).execute(2));
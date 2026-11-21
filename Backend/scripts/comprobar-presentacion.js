import express from 'express';
import { crearAutenticar } from '../src/presentation/middlewares/auth.middleware.js';
import { cuerpoPorDefecto } from '../src/presentation/middlewares/cuerpo-por-defecto.js';
import { manejarErrores } from '../src/presentation/middlewares/error-handler.js';
import { NoEncontrado } from '../src/application/errors/errores.js';
import { UsuarioController } from '../src/presentation/controllers/usuario.controller.js';
import { ProyectoController } from '../src/presentation/controllers/proyecto.controller.js';
import { ContratoController } from '../src/presentation/controllers/contrato.controller.js';
import { CatalogoController } from '../src/presentation/controllers/catalogo.controller.js';
import { crearUsuarioRoutes } from '../src/presentation/routes/usuario.routes.js';
import { crearProyectoRoutes } from '../src/presentation/routes/proyecto.routes.js';
import { crearContratoRoutes } from '../src/presentation/routes/contrato.routes.js';
import { crearCatalogoRoutes } from '../src/presentation/routes/catalogo.routes.js';

console.error = () => {}; // el error handler registra los 500; aquí lo silenciamos para leer mejor la salida

// ---------- fakes ----------
const tokenService = {
  verificar: (t) => {
    if (t === 'cliente') return { id_usuario: 10, rol: 'cliente', id_cliente: 7 };
    if (t === 'freelancer') return { id_usuario: 11, rol: 'freelancer', id_freelancer: 4 };
    if (t === 'admin') return { id_usuario: 1, rol: 'administrador' };
    throw new Error('token inválido');
  }
};

let ultima; // lo último que recibió un caso de uso
const caso = (resultado) => ({
  execute: async (...args) => {
    ultima = args;
    return typeof resultado === 'function' ? resultado(...args) : resultado;
  }
});

const errorBD = (propiedades) => Object.assign(new Error('QueryFailedError'), propiedades);

const app = express();
app.use(express.json());
app.use(cuerpoPorDefecto);
const autenticar = crearAutenticar(tokenService);

app.use('/api/usuarios', crearUsuarioRoutes(new UsuarioController({
  loginUsuario: caso({ requiere2fa: true, correo: 'a@b.com' }),
  obtenerPerfil: caso({ usuario: { id_usuario: 10 }, perfil: null })
}), autenticar));

app.use('/api/proyectos', crearProyectoRoutes(new ProyectoController({
  listarProyectos: caso([]),
  obtenerProyecto: caso(() => { throw new NoEncontrado('Proyecto no encontrado'); }),
  crearProyecto: caso((idCliente, datos) => ({ id_proyecto: 1, id_cliente: idCliente, ...datos })),
  listarMisProyectos: caso([{ id_proyecto: 1 }]),
  eliminarProyecto: caso({ id_proyecto: 5 })
}), autenticar));

app.use('/api/contratos', crearContratoRoutes(new ContratoController({
  aceptarPropuesta: caso((idCliente, idPropuesta) => {
    if (idPropuesta === 1) throw errorBD({ driverError: { code: 'P0001', message: 'No se puede crear un contrato porque el proyecto no esta abierto.' } });
    if (idPropuesta === 2) throw errorBD({ code: '23505' });
    if (idPropuesta === 3) throw errorBD({ driverError: { code: '23502' } });
    if (idPropuesta === 4) throw new Error('falla inesperada');
    return { id_contrato: 30 };
  }),
  completarContrato: caso((idCliente, idContrato) => ({ id_contrato: idContrato, estado: 'completado' }))
}), autenticar));

app.use('/api', crearCatalogoRoutes(new CatalogoController({
  listarCategorias: caso([{ id_categoria: 1 }]),
  crearCategoria: caso((nombre) => ({ nombre_categoria: nombre }))
}), autenticar));

app.use(manejarErrores);

// ---------- cliente de pruebas ----------
const servidor = app.listen(0);
const base = `http://localhost:${servidor.address().port}`;

const pedir = async (etiqueta, metodo, ruta, { token, cuerpo, verLlamada } = {}) => {
  const r = await fetch(base + ruta, {
    method: metodo,
    headers: { ...(cuerpo && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  console.log(r.status, etiqueta, '->', (await r.text()).slice(0, 110));
  if (verLlamada) console.log('      el caso de uso recibió:', JSON.stringify(ultima));
};

console.log('--- rutas públicas y forma de la respuesta ---');
await pedir('GET proyectos con filtros (200)', 'GET', '/api/proyectos?id_categoria=2&presupuesto_max=900', { verLlamada: true });
await pedir('GET proyecto inexistente (404)', 'GET', '/api/proyectos/999');
await pedir('GET categorías (200)', 'GET', '/api/categorias');
await pedir('POST login sin cuerpo (400)', 'POST', '/api/usuarios/login');
await pedir('POST login con datos (200)', 'POST', '/api/usuarios/login', { cuerpo: { correo: 'a@b.com', contrasena: 'x' } });

console.log('--- autenticación y roles ---');
await pedir('GET mis proyectos sin token (401)', 'GET', '/api/proyectos/mios');
await pedir('GET mis proyectos con token falso (401)', 'GET', '/api/proyectos/mios', { token: 'basura' });
await pedir('GET mis proyectos como freelancer (403)', 'GET', '/api/proyectos/mios', { token: 'freelancer' });
await pedir('GET mis proyectos como cliente (200)', 'GET', '/api/proyectos/mios', { token: 'cliente', verLlamada: true });
await pedir('GET perfil con token (200)', 'GET', '/api/usuarios/perfil', { token: 'cliente' });
await pedir('POST categoría como cliente (403)', 'POST', '/api/categorias', { token: 'cliente', cuerpo: { nombre_categoria: 'Diseño' } });
await pedir('POST categoría como admin (201)', 'POST', '/api/categorias', { token: 'admin', cuerpo: { nombre_categoria: 'Diseño' } });
await pedir('DELETE proyecto como cliente (403)', 'DELETE', '/api/proyectos/5', { token: 'cliente' });
await pedir('DELETE proyecto como admin (200)', 'DELETE', '/api/proyectos/5', { token: 'admin' });

console.log('--- datos que llegan a los casos de uso ---');
await pedir('POST proyecto (201)', 'POST', '/api/proyectos', { token: 'cliente', cuerpo: { titulo: 'Nuevo' }, verLlamada: true });
await pedir('PATCH completar contrato 4 (200)', 'PATCH', '/api/contratos/4/completar', { token: 'cliente', verLlamada: true });

console.log('--- traducción de errores de PostgreSQL ---');
await pedir('trigger RAISE EXCEPTION (400, mensaje del trigger)', 'POST', '/api/contratos/aceptar/1', { token: 'cliente' });
await pedir('UNIQUE (409)', 'POST', '/api/contratos/aceptar/2', { token: 'cliente' });
await pedir('NOT NULL (400)', 'POST', '/api/contratos/aceptar/3', { token: 'cliente' });
await pedir('error inesperado (500)', 'POST', '/api/contratos/aceptar/4', { token: 'cliente' });
await pedir('éxito (201)', 'POST', '/api/contratos/aceptar/5', { token: 'cliente' });

servidor.close();
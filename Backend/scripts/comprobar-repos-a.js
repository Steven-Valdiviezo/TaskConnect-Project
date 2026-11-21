import crypto from 'node:crypto';
import { AppDataSource } from '../src/infrastructure/database/data-source.js';
import { TypeOrmCategoriaRepository } from '../src/infrastructure/repositories/typeorm-categoria-repository.js';
import { TypeOrmProfesionRepository } from '../src/infrastructure/repositories/typeorm-profesion-repository.js';
import { TypeOrmMetodoPagoRepository } from '../src/infrastructure/repositories/typeorm-metodo-pago-repository.js';
import { TypeOrmConfiguracionRepository } from '../src/infrastructure/repositories/typeorm-configuracion-repository.js';
import { TypeOrmToken2faRepository } from '../src/infrastructure/repositories/typeorm-token-2fa-repository.js';
import { TypeOrmUsuarioRepository } from '../src/infrastructure/repositories/typeorm-usuario-repository.js';

const correo = process.argv[2];
await AppDataSource.initialize();

const categorias = new TypeOrmCategoriaRepository(AppDataSource);
const profesiones = new TypeOrmProfesionRepository(AppDataSource);
const metodos = new TypeOrmMetodoPagoRepository(AppDataSource);
const config = new TypeOrmConfiguracionRepository(AppDataSource);
const tokens = new TypeOrmToken2faRepository(AppDataSource);
const usuarios = new TypeOrmUsuarioRepository(AppDataSource);

// catálogo
const cats = await categorias.listar();
console.log('categorías:', cats.length, '| primera por nombre:', await categorias.buscarPorNombre(cats[0].nombre_categoria.toUpperCase()));
console.log('profesiones:', (await profesiones.listar()).length);
console.log('métodos de pago:', (await metodos.listar()).length);
console.log('tarifa IVA (debe ser número):', await config.obtenerTarifaIva());
console.log('proyectos en categoría 1:', await categorias.contarProyectos(cats[0].id_categoria));

// usuario
console.log('listar usuarios:', (await usuarios.listar({})).length, '| inactivos:', (await usuarios.listar({ estado: 'inactivo' })).length);
const u = await usuarios.buscarPorCorreo(correo);
console.log('buscarPorCorreo (tiene hash):', { id: u.id_usuario, rol: u.rol, hash: !!u.contrasena });
console.log('buscarPorId (sin hash):', await usuarios.buscarPorId(u.id_usuario));

const ids = await usuarios.obtenerIdsPerfil(u.id_usuario, u.rol);
console.log('ids de perfil:', ids);
if (u.rol === 'cliente') console.log('datos cliente:', await usuarios.obtenerDatosCliente(u.id_usuario));
if (u.rol === 'freelancer') {
  console.log('datos freelancer:', await usuarios.obtenerDatosFreelancer(u.id_usuario));
  console.log('perfil público:', await usuarios.obtenerPerfilPublicoFreelancer(ids.id_freelancer));
  console.log('perfil con contacto:', await usuarios.obtenerPerfilFreelancerConContacto(ids.id_freelancer));
}

// token 2FA: se crea, se consume una vez (devuelve el usuario) y la segunda vez debe devolver undefined
const hash = crypto.createHash('sha256').update('prueba-' + Date.now()).digest('hex');
await tokens.crear({ id_usuario: u.id_usuario, token_hash: hash, minutos: 5 });
console.log('consumir 1ª vez:', await tokens.consumir(hash));
console.log('consumir 2ª vez (undefined):', await tokens.consumir(hash));

await AppDataSource.destroy();
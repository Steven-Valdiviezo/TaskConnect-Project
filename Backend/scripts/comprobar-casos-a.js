import { AppDataSource as ds } from '../src/infrastructure/database/data-source.js';
import { TypeOrmCategoriaRepository } from '../src/infrastructure/repositories/typeorm-categoria-repository.js';
import { TypeOrmProfesionRepository } from '../src/infrastructure/repositories/typeorm-profesion-repository.js';
import { TypeOrmMetodoPagoRepository } from '../src/infrastructure/repositories/typeorm-metodo-pago-repository.js';
import { TypeOrmConfiguracionRepository } from '../src/infrastructure/repositories/typeorm-configuracion-repository.js';

import { ListarCategorias } from '../src/application/use-cases/queries/catalogo/listar-categorias.js';
import { CrearCategoria } from '../src/application/use-cases/commands/catalogo/crear-categoria.js';
import { ActualizarCategoria } from '../src/application/use-cases/commands/catalogo/actualizar-categoria.js';
import { EliminarCategoria } from '../src/application/use-cases/commands/catalogo/eliminar-categoria.js';
import { ListarProfesiones } from '../src/application/use-cases/queries/catalogo/listar-profesiones.js';
import { CrearProfesion } from '../src/application/use-cases/commands/catalogo/crear-profesion.js';
import { EliminarProfesion } from '../src/application/use-cases/commands/catalogo/eliminar-profesion.js';
import { ListarMetodosPago } from '../src/application/use-cases/queries/catalogo/listar-metodos-pago.js';
import { CrearMetodoPago } from '../src/application/use-cases/commands/catalogo/crear-metodo-pago.js';
import { EliminarMetodoPago } from '../src/application/use-cases/commands/catalogo/eliminar-metodo-pago.js';
import { ObtenerTarifaIva } from '../src/application/use-cases/queries/catalogo/obtener-tarifa-iva.js';

await ds.initialize();

// Aquí el script hace de "container": crea los repositorios y se los pasa a los casos de uso
const categorias = new TypeOrmCategoriaRepository(ds);
const profesiones = new TypeOrmProfesionRepository(ds);
const metodos = new TypeOrmMetodoPagoRepository(ds);
const config = new TypeOrmConfiguracionRepository(ds);

// Ejecuta un caso de uso e imprime el resultado o el error con su status
const probar = async (etiqueta, fn) => {
  try {
    const r = await fn();
    console.log('OK   ', etiqueta, '->', Array.isArray(r) ? `${r.length} registros` : r);
  } catch (e) {
    console.log('ERROR', etiqueta, '->', e.constructor.name, e.status, '|', e.message);
  }
};

// Primer registro que esté en uso (para probar que NO se puede eliminar)
const enUso = async (lista, idCampo, contar) => {
  for (const item of lista) if ((await contar(item[idCampo])) > 0) return item;
  return null;
};

console.log('--- categorías ---');
const todasCat = await new ListarCategorias(categorias).execute();
await probar('listar categorías', () => new ListarCategorias(categorias).execute());
await probar('crear nombre corto (400)', () => new CrearCategoria(categorias).execute('ab'));
await probar('crear duplicada (409)', () => new CrearCategoria(categorias).execute(todasCat[0].nombre_categoria.toUpperCase()));
await probar('actualizar inexistente (404)', () => new ActualizarCategoria(categorias).execute(999999, 'Nombre válido'));
await probar('eliminar inexistente (404)', () => new EliminarCategoria(categorias).execute(999999));
const catUso = await enUso(todasCat, 'id_categoria', (id) => categorias.contarProyectos(id));
if (catUso) await probar(`eliminar categoría en uso id=${catUso.id_categoria} (409)`, () => new EliminarCategoria(categorias).execute(catUso.id_categoria));

console.log('--- profesiones ---');
const todasProf = await new ListarProfesiones(profesiones).execute();
await probar('listar profesiones', () => new ListarProfesiones(profesiones).execute());
await probar('crear sin descripción (400)', () => new CrearProfesion(profesiones).execute({ nombre: 'Abogado', descripcion: '' }));
await probar('crear duplicada (409)', () => new CrearProfesion(profesiones).execute({ nombre: todasProf[0].nombre.toUpperCase(), descripcion: 'Descripción de prueba larga' }));
const profUso = await enUso(todasProf, 'id_profesion', (id) => profesiones.contarFreelancers(id));
if (profUso) await probar(`eliminar profesión en uso id=${profUso.id_profesion} (409)`, () => new EliminarProfesion(profesiones).execute(profUso.id_profesion));

console.log('--- métodos de pago ---');
const todosMet = await new ListarMetodosPago(metodos).execute();
await probar('listar métodos', () => new ListarMetodosPago(metodos).execute());
await probar('crear nombre muy largo (400)', () => new CrearMetodoPago(metodos).execute({ nombre: 'x'.repeat(60), descripcion: 'Descripción de prueba larga' }));
await probar('crear duplicado (409)', () => new CrearMetodoPago(metodos).execute({ nombre: todosMet[0].nombre.toUpperCase(), descripcion: 'Descripción de prueba larga' }));
const metUso = await enUso(todosMet, 'id_metodo_pago', (id) => metodos.contarPagos(id));
if (metUso) await probar(`eliminar método en uso id=${metUso.id_metodo_pago} (409)`, () => new EliminarMetodoPago(metodos).execute(metUso.id_metodo_pago));

console.log('--- configuración ---');
await probar('tarifa IVA', () => new ObtenerTarifaIva(config).execute());

await ds.destroy();
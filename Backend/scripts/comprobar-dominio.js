import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const prohibidos = ['typeorm', 'pg', 'express', 'bcryptjs', 'jsonwebtoken',
  'infrastructure', 'application', 'presentation', 'main/'];

// recorre domain/ y devuelve todos los .js
const archivos = (dir) => readdirSync(dir).flatMap((nombre) => {
  const ruta = join(dir, nombre);
  return statSync(ruta).isDirectory() ? archivos(ruta) : ruta.endsWith('.js') ? [ruta] : [];
});

let fallos = 0;
for (const archivo of archivos('src/domain')) {
  const imports = readFileSync(archivo, 'utf8').match(/from\s+['"][^'"]+['"]/g) ?? [];
  for (const imp of imports) {
    if (prohibidos.some((p) => imp.includes(p))) {
      console.log('PROHIBIDO', archivo, '->', imp);
      fallos++;
    }
  }
}
console.log(fallos ? `${fallos} violación(es)` : 'Dominio limpio: sin dependencias hacia afuera');
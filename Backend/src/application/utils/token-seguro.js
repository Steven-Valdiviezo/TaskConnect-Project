import crypto from 'node:crypto';

// Token aleatorio que viaja en el enlace del correo
export const generarTokenAleatorio = () => crypto.randomBytes(32).toString('hex');

// A la BD solo se guarda el hash del token, nunca el token en claro
export const hashearToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
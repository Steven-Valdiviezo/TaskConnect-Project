import dotenv from 'dotenv';

dotenv.config();

export const config = {
  puerto: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  jwt: {
    secreto: process.env.JWT_SECRET,
    expiraEn: process.env.JWT_EXPIRES_IN
  },
  magicLink: {
    minutosExpiracion: Number(process.env.MAGIC_LINK_EXPIRES_MIN) || 10
  },
  permitirLoginPrueba: process.env.PERMITIR_LOGIN_PRUEBA === 'true',
  verificarDnsCorreo: process.env.VERIFICAR_DNS_CORREO !== 'false',
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
    remitenteNombre: process.env.BREVO_SENDER_NAME,
    remitenteCorreo: process.env.BREVO_SENDER_EMAIL
  }
};

// Si falta algo imprescindible, el servidor no arranca (mejor que fallar en el primer login)
const obligatorias = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'JWT_SECRET'];
const faltan = obligatorias.filter((nombre) => !process.env[nombre]);
if (faltan.length) {
  throw new Error(`Faltan variables de entorno: ${faltan.join(', ')}`);
}
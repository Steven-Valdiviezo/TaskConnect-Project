# TaskConnect

Plataforma web que conecta **Clientes** y **Freelancers** para la publicación de proyectos, envío de propuestas, generación de contratos digitales, mensajería interna, pagos simulados y un sistema de calificaciones y reputación. Incluye un panel de **Administrador** para la gestión y auditoría de la plataforma.

Proyecto académico desarrollado para la asignatura de Ingeniería de Software I — Universidad Técnica de Machala, Carrera de Tecnologías de la Información.

Este repositorio contiene el código fuente de una aplicación Full-Stack, estructurada como un monorepo. Se divide en dos módulos principales: un cliente web desarrollado con Angular y una API construida con Node.js y Express, sobre una base de datos PostgreSQL.

## Índice

- [Estructura del repositorio](#estructura-del-repositorio)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Roles y funcionalidades principales](#roles-y-funcionalidades-principales)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración local](#instalación-y-configuración-local)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Autenticación (2FA)](#autenticación-2fa)
- [Ejecución en desarrollo](#ejecución-en-desarrollo)
- [Despliegue](#despliegue)
- [Flujo de trabajo y colaboración](#flujo-de-trabajo-y-colaboración)
- [Equipo](#equipo)

## Estructura del Repositorio

El proyecto mantiene una separación clara de responsabilidades:

- `/frontend` - Aplicación cliente (Angular).
- `/backend` - API REST y lógica de servidor (Node.js/Express).

## Tecnologías utilizadas

**Frontend**
- Angular (standalone components, signals, `provideZonelessChangeDetection`)
- TypeScript
- Bootstrap 5.3
- Font Awesome (iconografía)
- Animate.css (animaciones de interfaz)
- Firebase Authentication — client SDK (segundo factor de autenticación por enlace a correo)

**Backend**
- Node.js + Express (API REST, módulos ESM)
- PostgreSQL (`pg` / node-postgres)
- JWT (`jsonwebtoken`) para sesión
- bcrypt (`bcryptjs`) para hash de contraseñas
- `firebase-admin` para verificar el segundo factor emitido por Firebase Auth
- CORS, dotenv

**Base de datos**
- PostgreSQL, con una capa de funciones y triggers propia (cálculo de comisión, bloqueo de borrado físico, transiciones de estado, cascadas, auditoría, calificaciones unidireccionales, etc.)

**Despliegue**
- Frontend → Vercel
- Backend → Render
- Base de datos → Supabase (PostgreSQL administrado)

## Roles y funcionalidades principales

**Cliente**
- Registro/login con verificación por 2FA (correo)
- Publicación, edición y cancelación de proyectos
- Revisión de propuestas recibidas (con filtros por estado y perfil público del freelancer)
- Aceptación/rechazo de propuestas → generación automática de contrato
- Gestión de contratos (marcar como completado, cancelar)
- Registro de pagos simulados (con comisión de plataforma repartida al 50%/50% entre cliente y freelancer) y pagos adicionales opcionales sin superar el presupuesto
- Mensajería interna con freelancers con contrato activo
- Calificación del freelancer al finalizar el contrato

**Freelancer**
- Registro/login con verificación por 2FA (correo)
- Perfil profesional (profesión, descripción, experiencia)
- Búsqueda y filtrado de proyectos abiertos
- Envío, retiro y seguimiento de propuestas
- Gestión de contratos activos
- Visualización de pagos e ingresos netos (ya descontada su parte de la comisión)
- Mensajería interna con clientes
- Reputación pública basada en calificaciones recibidas

**Administrador**
- Listado y gestión de usuarios (activar/desactivar cuentas)
- Gestión de catálogos (categorías, profesiones, métodos de pago)
- Estadísticas generales de la plataforma (usuarios, proyectos, propuestas, contratos, comisiones)
- Consulta del registro de auditoría (triggers sobre `contrato`, `pago` y `usuario`)

## Requisitos previos

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (se recomienda la versión LTS)
- Angular CLI (global): `npm install -g @angular/cli`
- Una instancia de PostgreSQL (local o en Supabase)
- Un proyecto de Firebase con **Authentication** habilitado, método **Correo electrónico / enlace de acceso (passwordless)** activado

## Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Steven-Valdiviezo/TaskConnect-Project.git
cd TaskConnect-Project
```

### 2. Levantar el Backend
```bash
cd backend
npm install
```

Esto instala, entre otras, las siguientes dependencias clave: `express`, `pg`, `bcryptjs`, `jsonwebtoken`, `firebase-admin`, `cors`, `dotenv`. Como devDependency se usa `nodemon` para desarrollo.

**Credenciales de Firebase Admin:** descarga el archivo de credenciales de servicio desde la consola de Firebase (*Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada*), y colócalo en la raíz de `backend` como `serviceAccountKey.json` <!-- revisar: confirma el nombre/ruta exacta que usa tu firebaseAdmin.util.js -->. Este archivo está ignorado por Git por seguridad — **nunca lo subas al repositorio.**

**Variables de entorno:** en la carpeta `backend`, crea un archivo `.env` (ver sección [Variables de entorno](#variables-de-entorno)). El archivo `.env` está ignorado por Git por seguridad.

### 3. Levantar el Frontend
Abre una nueva pestaña en tu terminal y ejecuta:
```bash
cd frontend
npm install
```

Configura el objeto `firebaseConfig` (apiKey, authDomain, projectId, etc., obtenidos de la consola de Firebase) en `src/environments/environment.ts` y `environment.prod.ts` <!-- revisar: ajusta la ruta exacta si tu configuración de Firebase vive en otro archivo -->, junto con la URL de la API (`apiUrl`).

También recuerda agregar el dominio desde el que sirvas el frontend (por ejemplo `localhost` en desarrollo, o tu dominio de Vercel en producción) a **Authorized domains** dentro de Firebase Authentication — si no, el login con 2FA fallará.

## Variables de entorno

Ejemplo de `.env` para `backend/.env`:

```env
# Servidor
PORT=3000

# Base de datos
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=taskconnect
DB_PASSWORD=tu_password
DB_PORT=5432
# DB_SSL=true   # descomenta si tu conexión a Supabase/Render lo requiere <!-- revisar -->

# JWT
JWT_SECRET=una_clave_secreta_larga_y_dificil_de_adivinar
JWT_EXPIRES_IN=1d

# Solo para desarrollo: habilita /login-prueba, que evita el paso de 2FA
PERMITIR_LOGIN_PRUEBA=true

# Variables para Brevo (2FA)
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=tu_gmail_verificado@gmail.com
BREVO_SENDER_NAME=TaskConnect
FRONTEND_URL=https://tu-app.vercel.app   # en local: http://localhost:4200
MAGIC_LINK_EXPIRES_MIN=10
```

> En producción, `DB_HOST`, `DB_PASSWORD`, etc. corresponden a los datos de conexión que te da Supabase, y `PERMITIR_LOGIN_PRUEBA` debería quedar en `false` o eliminarse.

## Base de datos

Los scripts SQL se encuentran documentados en el proyecto y deben ejecutarse **en este orden** sobre una base de datos PostgreSQL vacía:

1. `taskconnect_schema.sql` — crea todas las tablas, restricciones (`PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `UNIQUE`) y el trigger de cálculo de comisión.
2. `TASKCONNECT_SQL_FUNCIONES_Y_TRIGGERS.sql` — agrega el resto de funciones y triggers de negocio (validaciones de estado, cascadas, auditoría, reputación, etc.), incluida la tabla `auditoria`.


## Autenticación (2FA)

El inicio de sesión se realizaron con dos servicios de envio de correo.
Para Firbase (Deprecated) es de dos pasos:
1. El usuario ingresa correo y contraseña (`POST /api/usuarios/login`). Si son válidos, el backend responde con un `preAuthToken` de corta duración (no una sesión completa).
2. El frontend dispara el enlace de verificación por correo a través de Firebase Authentication. Al confirmarlo, el frontend envía el `preAuthToken` + el `id7Token` de Firebase a `POST /api/usuarios/login/verificar-2fa`, y solo ahí el backend emite el JWT real de sesión.

Para Brevo es de forma similar, lo unico que cambia es que la peticion del envio se la realiza directamente en el backend siguiendo el siguiente flujo:
1. `POST /login` valida correo y contraseña, genera un token aleatorio, guarda su hash en la BD y envía el link por Brevo.
2. El usuario abre `FRONTEND_URL/verificar-2fa?token=....`
3. Esa página de Angular hace `POST /login/verificar-2fa` con el token. El backend lo consume (un solo uso, 10 min) y devuelve el JWT.
 
La sesión en sí sigue siendo JWT normal (guardado en `localStorage` en el frontend); Firebase/Brave solo actúa como segundo factor, no reemplaza la gestión de sesión.

## Ejecución en Desarrollo

Para trabajar en el proyecto, necesitarás mantener ambos servicios corriendo simultáneamente en terminales separadas:

**Backend:**
```bash
cd backend
npm run dev # (o npm start, dependiendo de la configuración en package.json)
```

**Frontend:**
```bash
cd frontend
ng serve
```
La aplicación web estará disponible por defecto en `http://localhost:4200/`.

## Despliegue

El proyecto usa una arquitectura de tres servicios en capas gratuitas:

| Componente | Servicio |
|---|---|
| Base de datos (PostgreSQL) | [Supabase](https://supabase.com/) |
| Backend (Node/Express) | [Render](https://render.com/) |
| Frontend (Angular) | [Vercel](https://vercel.com/) |

**Limitaciones conocidas del plan gratuito:**
- Render "duerme" el servicio backend tras un período de inactividad; la primera petición después de eso puede tardar bastante en responder mientras el contenedor arranca.
- Supabase pausa la base de datos por inactividad prolongada.

Por esto, **antes de una demo en vivo**, conviene "despertar" ambos servicios con antelación (por ejemplo, abriendo la URL del backend en el navegador y entrando al panel de Supabase) para evitar tiempos de espera largos frente al usuario.

Recuerda también, al desplegar:
- Configurar las variables de entorno de producción en Render (las mismas de la sección [Variables de entorno](#variables-de-entorno), con los datos reales de Supabase).
- Agregar el dominio de Vercel a **Authorized domains** en Firebase Authentication.
- Habilitar CORS en el backend para el dominio de producción del frontend (revisa `app.js`, `cors({ origin: ... })`).

## Flujo de Trabajo y Colaboración

Para mantener un historial limpio y un código funcional:
1. **No hagas commits directos a `main`**. La rama principal es solo para código estable.
2. **Crea una rama** para tu nueva funcionalidad o corrección: `git checkout -b feature/nombre-de-la-tarea`
3. Trabajar y guardar, haces tus cambios en el código, guardas y haces commit: `git add .`, `git commit -m "feat: ..."`
4. Subir la rama a GitHub: `git push origin feature/nombre-de-la-tarea`
5. Sube tus cambios a tu rama y abre un **Pull Request** para revisión antes de integrar el código.
   Una vez aceptado, vuelves a tu terminal, cambias a main y actualizas:
   `git checkout main`
   `git pull origin main`

## Equipo

- Johan Andrés Villamar Brito
- Ernesto Jahir Maldonado Gómez
- Juan Francisco Sandoval Salazar
- Steven Paul Valdiviezo Suquilanda

Docente responsable: Ing. John Patricio Orellana Preciado / Ing. Milton Rafael Valarezo Pardo

Universidad Técnica de Machala, Carrera de Tecnologías de la Información, 2026-E1.

# TaskConnect
Este repositorio contiene el código fuente de una aplicación Full-Stack, estructurada como un monorepo. Se divide en dos módulos principales: un cliente web desarrollado con Angular y una API construida con Node.js y Express.

## Estructura del Repositorio

El proyecto mantiene una separación clara de responsabilidades:

- `/frontend` - Aplicación cliente (Angular).
- `/backend` - API REST y lógica de servidor (Node.js/Express).

## Requisitos Previos

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (se recomienda la versión LTS)
- Angular CLI (global): `npm install -g @angular/cli`

## Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Steven-Valdiviezo/TaskConnect-Project.git
cd tu-repo
```

### 2. Levantar el Backend
```bash
cd backend
npm install
```
**Variables de entorno:** En la carpeta `backend`, encontrarás un archivo `.env.example`. Crea una copia de este archivo, nómbralo `.env` y configura tus variables locales (conexiones a BD, puertos, etc.). *El archivo `.env` está ignorado por Git por seguridad.*

### 3. Levantar el Frontend
Abre una nueva pestaña en tu terminal y ejecuta:
```bash
cd frontend
npm install
```

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

## Flujo de Trabajo y Colaboración

Para mantener un historial limpio y un código funcional:
1. **No hagas commits directos a `main`**. La rama principal es solo para código estable.
2. **Crea una rama** para tu nueva funcionalidad o corrección: `git checkout -b feature/nombre-de-la-tarea`
3. Sube tus cambios a tu rama y abre un **Pull Request** para revisión antes de integrar el código.

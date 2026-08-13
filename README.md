# Farmacia App — Frontend

Aplicación cliente en React + Vite + Tailwind para la gestión de una farmacia (autenticación, productos, categorías, ventas y usuarios), consumiendo la API del [backend](../backend).

## Requisitos previos

- Node.js 20.x (o compatible)
- npm
- El backend corriendo (ver su propio README)

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env.development` ya apunta al backend local:

```env
VITE_API_URL=http://localhost:5000/api
```

Para producción, ajusta `VITE_API_URL` en `.env.production` (o en las variables de entorno del proveedor de hosting) con la URL pública del backend, **sin barra final**.

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Comandos disponibles

- `npm install`: instala dependencias.
- `npm run dev`: inicia Vite en modo desarrollo.
- `npm run build`: genera el build de producción.
- `npm start`: sirve la aplicación build.
- `npm run preview`: ejecuta Vite preview.

## Funcionalidades de interfaz

- **Layout configurable**: desde el ícono junto al usuario (o en Perfil) se puede elegir entre menú superior o menú lateral. El menú lateral admite modo compacto (solo iconos) con el botón sobre la línea divisoria del logo.
- **Tema claro/oscuro**: seleccionable desde el mismo menú o desde Perfil; la preferencia se guarda en el navegador.

## Despliegue

Ver [`RAILWAY_DEPLOY.md`](./RAILWAY_DEPLOY.md) para Railway o [`render.yaml`](./render.yaml) para Render.

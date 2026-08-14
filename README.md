# Farmacia App — Frontend

Aplicación cliente en React + Vite + Tailwind para la gestión de una farmacia (autenticación, productos, categorías, ventas, usuarios y domicilios), consumiendo la API del [backend](../backend).

La interfaz cambia completamente según el rol del usuario autenticado (menú, layout y rutas permitidas):

- **admin**: Dashboard, gestión de Productos/Categorías/Ventas/Usuarios y gestión de Domicilios (asignar domiciliario, cambiar estado). Usa el layout con menú superior/lateral configurable (`Navbar`/`Sidebar`).
- **usuario**: Tienda (catálogo con carrito de compras), Checkout, Mis Pedidos (historial de compras) y Mis Domicilios (seguimiento de sus entregas). Usa un layout público más simple (`PublicHeader`), con ícono de carrito y contador.
- **domiciliario**: Mis Entregas — ve únicamente los domicilios que el admin le asignó y puede actualizar su estado (pendiente → en camino → entregado/cancelado), con filtro de historial.

El acceso está controlado por rol tanto en el menú como en las rutas: `src/routes/PrivateRoute.jsx` bloquea la navegación directa por URL a páginas que no correspondan al rol del usuario (redirige a su página de inicio). Las rutas de la app viven en `src/routes/AppRoutes.jsx`.

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

- **Layout configurable** (solo admin): desde el ícono junto al usuario (o en Perfil) se puede elegir entre menú superior o menú lateral. El menú lateral admite modo compacto (solo iconos) con el botón sobre la línea divisoria del logo.
- **Tema claro/oscuro**: seleccionable desde el mismo menú o desde Perfil; la preferencia se guarda en el navegador.
- **Carrito de compras**: se guarda en `localStorage` por usuario (no requiere backend); persiste entre sesiones del mismo navegador.
- **Checkout**: crea una venta normal en el backend; si el cliente marca "Solicitar entrega a domicilio", además se registra un domicilio asociado a esa venta.

## Despliegue

Ver [`RAILWAY_DEPLOY.md`](./RAILWAY_DEPLOY.md) para Railway o [`render.yaml`](./render.yaml) para Render.

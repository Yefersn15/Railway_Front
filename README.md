# Farmacia App — Frontend

Aplicación cliente en React + Vite + Tailwind para la gestión de una farmacia (autenticación, productos, categorías, ventas, usuarios y domicilios), consumiendo la API del [backend](../backend).

**La página de inicio (`/`) es el catálogo público de la tienda — no requiere iniciar sesión.** Cualquier visitante puede navegar productos, filtrar por categoría y agregar al carrito sin loguearse. Solo al intentar pagar (`/checkout`) se le pide iniciar sesión o registrarse; después de loguear, vuelve automáticamente a donde estaba (incluyendo el carrito que ya tenía armado como invitado, que se fusiona con su cuenta).

Una vez autenticado, la interfaz cambia según el rol (menú, layout y rutas permitidas):

- **admin**: Dashboard, gestión de Productos/Categorías/Ventas/Usuarios y gestión de Domicilios (asignar domiciliario, cambiar estado). Usa el layout con menú superior/lateral configurable (`Navbar`/`Sidebar`).
- **usuario**: Tienda, Carrito, Checkout, Mis Pedidos (historial de compras) y Mis Domicilios (seguimiento de sus entregas). Usa un layout público más simple (`PublicHeader`), con ícono de carrito y contador.
- **domiciliario**: Mis Entregas — ve los domicilios que el admin le asignó y puede actualizar su estado (pendiente → en camino → entregado/cancelado), con filtro de historial; también puede comprar en la tienda como cualquier otro rol.

Los tres roles (admin, usuario, domiciliario) pueden comprar en la tienda — no está restringida a un solo rol. En todos los formularios donde se elige una cantidad de producto (nueva venta del admin, carrito, modal de la tienda), el máximo permitido es siempre el stock disponible de ese producto.

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

### 3. Configurar Cloudinary (imágenes de productos)

Las imágenes de los productos se suben directo desde el navegador a [Cloudinary](https://cloudinary.com) — **nunca pasan por nuestro backend ni se guardan en la base de datos** (solo se guarda el link). Esto evita gastar memoria/almacenamiento del servidor desplegado: la imagen viaja del navegador del usuario directo a Cloudinary, y Cloudinary se encarga de guardarla, optimizarla y servirla.

1. Crea una cuenta gratis en [cloudinary.com](https://cloudinary.com) (el plan gratuito incluye 25GB de almacenamiento y 25GB de ancho de banda al mes, de sobra para este proyecto).
2. En el Dashboard, copia tu **Cloud Name** (aparece arriba, ej. `dxxxxx`).
3. Ve a **Settings → Upload → Upload presets → Add upload preset**:
   - **Signing Mode**: `Unsigned` (permite subir desde el navegador sin exponer tu API secret).
   - Opcional pero recomendado: en **Folder** pon algo como `farmacia-productos` para mantener las imágenes organizadas, y en **Upload Manipulations** puedes limitar el tamaño máximo de archivo.
   - Guarda y copia el **nombre del preset**.
4. Completa en `.env.development` (local) y en las Variables del servicio en Railway (producción):
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
   ```

Si estas variables no están configuradas, el formulario de productos simplemente deshabilita el botón de subir imagen (el resto de la app funciona igual, sin imágenes).

**Cómo se ahorra memoria/ancho de banda:**
- El backend (`Railway_Back`) nunca recibe los bytes de la imagen — solo guarda la URL (`imagen_url`) que Cloudinary devuelve, un texto de unos 100 caracteres. Cero uso de memoria del servidor ni de espacio en PostgreSQL por las imágenes.
- Al mostrar las imágenes (catálogo, carrito, tablas), se usa `src/utils/cloudinary.js#getOptimizedUrl`, que inserta transformaciones en la URL (`w_,h_,c_fill,q_auto,f_auto`) para pedirle a Cloudinary una versión pequeña, comprimida y en el formato más liviano que soporte el navegador (WebP/AVIF cuando aplica), en vez de descargar la foto original en alta resolución en cada tarjeta.

### 4. Ejecutar en modo desarrollo

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
- **Carrito de compras**: se guarda en `localStorage` (por invitado o por usuario) sin requerir backend; persiste entre sesiones del mismo navegador. Si agregas productos como invitado y luego inicias sesión, ese carrito se fusiona automáticamente con el de tu cuenta.
- **Checkout**: crea una venta normal en el backend; si el cliente marca "Solicitar entrega a domicilio", además se registra un domicilio asociado a esa venta.
- **Imágenes de productos**: el admin puede subir una foto por producto desde el formulario (ver sección de Cloudinary arriba); se muestra en el catálogo, el modal de detalle, el carrito, el checkout y la tabla de administración.

## Despliegue

Ver [`RAILWAY_DEPLOY.md`](./RAILWAY_DEPLOY.md) para Railway o [`render.yaml`](./render.yaml) para Render.

# Despliegue en Railway — Frontend

## Servicio

- Tipo: Node.js / Static
- Root Directory: `/` (raíz de este repositorio)

## Build Command

```bash
npm install && npm run build
```

## Start Command

```bash
npm start
```

## Variables de entorno exactas

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

### Notas

- Cambia `tu-backend.up.railway.app` por el dominio público real del backend en Railway (pestaña Settings > Networking del servicio backend).
- La URL **no debe terminar en "/"**.
- El script `npm start` sirve el build de Vite en el puerto que Railway inyecta en `PORT`.

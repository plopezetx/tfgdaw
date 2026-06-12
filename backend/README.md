# Backend

API Express del IDE Web Colaborativo.

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Groq SDK para IA

## Funcionalidades

- Registro, login y logout.
- Protección de rutas con JWT.
- CRUD de proyectos.
- Guardado y recuperación de snapshots.
- Publicación pública/privada.
- Galería pública.
- Lectura pública por slug.
- Fork/remix de proyectos públicos.
- Proxy IA por streaming SSE.

## Configuración

Crea `backend/.env` a partir de `backend/.env.example`:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ide_web_db"
JWT_SECRET="una-cadena-aleatoria-larga-y-segura"
PORT=3000
FRONTEND_URL="http://localhost:5173"
GROQ_API_KEY="tu_api_key"
```

`GROQ_API_KEY` solo es necesaria para usar el panel IA.

## Instalación

Desde la raíz:

```bash
npm run install:backend
```

Desde esta carpeta:

```bash
npm install
```

## Base De Datos

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Para inspeccionar la base:

```bash
npx prisma studio
```

## Desarrollo

Desde la raíz:

```bash
npm run backend:dev
```

La API queda en:

```txt
http://localhost:3000
```

Comprobación:

```bash
curl http://localhost:3000/health
```

## Rutas Principales

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Proyectos

- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `PUT /projects/:id/snapshot`
- `GET /projects/:id/snapshot`

### Comunidad

- `GET /projects/public/gallery`
- `GET /projects/public/:slug`
- `POST /projects/:id/fork`

### IA

- `POST /ai/chat`

## Verificación

```bash
npm run build
```

Si falla con `tsc no se reconoce`, faltan dependencias de backend. Ejecuta `npm install` dentro de `backend`.

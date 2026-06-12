# IDE Web Colaborativo con Asistente IA

Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web.

La aplicación permite crear, editar, ejecutar, guardar, publicar y reutilizar proyectos web desde el navegador. El MVP se centra en proyectos HTML, CSS, JavaScript y TypeScript compatibles con el ecosistema Node.

## Estado Actual

El proyecto está en una versión funcional de MVP:

- Frontend React + TypeScript + Vite.
- Editor Monaco integrado.
- Gestión multiarchivo: crear, renombrar y eliminar archivos.
- Ejecución en navegador con WebContainers.
- Preview embebida y terminal/logs.
- Autenticación mediante backend Express.
- CRUD de proyectos y snapshots con Prisma.
- Galería pública, vista pública y fork/remix.
- Panel IA mediante backend proxy.

Pendiente principal para despliegue real: configurar PostgreSQL, variables de entorno y migraciones de Prisma.

## Estructura

```txt
tfgdaw/
├─ frontend/   Aplicación React del IDE
├─ backend/    API Express + Prisma
└─ docs/       Documentación del TFG
```

## Requisitos

- Node.js 18 o superior.
- npm.
- PostgreSQL 14 o superior, local o cloud.
- Chrome o Edge para la experiencia completa con WebContainers.

## Instalación

```bash
npm run install:frontend
npm run install:backend
```

Si solo quieres comprobar el frontend:

```bash
npm run dev
```

Abre:

```txt
http://localhost:5173
```

## Configuración Del Backend

1. Crea `backend/.env` copiando `backend/.env.example`.
2. Rellena `DATABASE_URL`, `JWT_SECRET` y, si vas a usar IA, `GROQ_API_KEY`.
3. Ejecuta:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

4. Arranca el backend:

```bash
npm run backend:dev
```

La API queda en:

```txt
http://localhost:3000
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el frontend |
| `npm run build` | Compila el frontend |
| `npm run lint` | Ejecuta ESLint del frontend |
| `npm run backend:dev` | Arranca el backend |
| `npm run backend:build` | Compila el backend |
| `npm run install:frontend` | Instala dependencias del frontend |
| `npm run install:backend` | Instala dependencias del backend |

## Documentación

La documentación principal está en [docs/README.md](docs/README.md).

Para preparar entorno local completo, ver [docs/09-setup-dev.md](docs/09-setup-dev.md).

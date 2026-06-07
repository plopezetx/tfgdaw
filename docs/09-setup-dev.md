# 09 - Guía de configuración del entorno de desarrollo

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+ (instalado localmente o servicio cloud como Supabase/Neon)
- npm

---

## 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd tfgdaw

npm run install:frontend
npm run install:backend
```

---

## 2. Configurar PostgreSQL

### Opción A — PostgreSQL local

1. Instala PostgreSQL desde https://www.postgresql.org/download/
2. Durante la instalación, anota la contraseña del usuario `postgres`.
3. Abre pgAdmin o psql y crea la base de datos:

```sql
CREATE DATABASE ide_web_db;
```

### Opción B — Neon (cloud, sin instalación local)

1. Crea una cuenta en https://neon.tech
2. Crea un proyecto y copia la `DATABASE_URL` que te proporcionan.

---

## 3. Crear el archivo `.env` del backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus datos:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ide_web_db"
JWT_SECRET="una-cadena-aleatoria-larga-y-segura"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

> Para `JWT_SECRET` puedes generar una cadena segura con:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 4. Ejecutar la migración de Prisma

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

Esto crea las tablas `User`, `Project` y `ProjectSnapshot` en la base de datos.

---

## 5. Arrancar el backend

```bash
npm run backend:dev
```

Deberías ver: `Backend escuchando en http://localhost:3000`

Verifica que responde:
```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

---

## 6. Arrancar el frontend

En otra terminal:

```bash
npm run dev
```

Abre http://localhost:5173 en Chrome o Edge (necesario para WebContainers).

---

## 7. Registrar una cuenta

Ve a http://localhost:5173/login, cambia a **"Registrarse"** y crea tu cuenta. Luego ya puedes iniciar sesión y crear proyectos.

---

## Variables de entorno del frontend (opcional)

Si el backend corre en una URL distinta a `http://localhost:3000`, crea `frontend/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Frontend en localhost:5173 |
| `npm run backend:dev` | Backend en localhost:3000 |
| `npm run build` | Build de producción del frontend |
| `cd backend && npx prisma studio` | Interfaz visual de la base de datos |
| `cd backend && npx prisma migrate dev` | Aplicar nuevas migraciones |

---

## Navegadores compatibles con WebContainers

WebContainers requiere cabeceras COOP/COEP y solo funciona en:

- Chrome 90+
- Edge 90+

Firefox y Safari **no son compatibles** actualmente.

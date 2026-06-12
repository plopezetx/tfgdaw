# 09 - Guía De Configuración Del Entorno De Desarrollo

## Requisitos Previos

- Node.js 18 o superior.
- npm.
- PostgreSQL 14 o superior, local o cloud.
- Chrome o Edge para ejecutar proyectos con WebContainers.

## 1. Instalar Dependencias

Desde la raíz del repositorio:

```bash
npm run install:frontend
npm run install:backend
```

Si solo quieres comprobar el frontend:

```bash
npm run install:frontend
npm run dev
```

## 2. Configurar PostgreSQL

### PostgreSQL Local

1. Instala PostgreSQL.
2. Crea la base de datos:

```sql
CREATE DATABASE ide_web_db;
```

### PostgreSQL Cloud

También puedes usar Supabase, Neon, Railway o Render PostgreSQL. En ese caso copia la URL de conexión del panel del proveedor.

## 3. Configurar Variables De Entorno

Copia el archivo de ejemplo:

```bash
copy backend\.env.example backend\.env
```

Contenido recomendado:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ide_web_db"
JWT_SECRET="una-cadena-aleatoria-larga-y-segura"
PORT=3000
FRONTEND_URL="http://localhost:5173"
GROQ_API_KEY="tu_api_key_de_groq"
```

`GROQ_API_KEY` solo es necesaria si se quiere usar el panel IA.

Para generar `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Ejecutar Prisma

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

## 5. Arrancar Backend

```bash
npm run backend:dev
```

API:

```txt
http://localhost:3000
```

Comprobación:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{ "status": "ok" }
```

## 6. Arrancar Frontend

En otra terminal:

```bash
npm run dev
```

URL:

```txt
http://localhost:5173
```

## 7. Flujo De Prueba

1. Abrir `/login`.
2. Registrar usuario.
3. Crear proyecto.
4. Abrir IDE.
5. Editar archivos.
6. Ejecutar proyecto.
7. Guardar.
8. Publicar.
9. Abrir galería.
10. Abrir proyecto público.
11. Hacer fork con usuario autenticado.

## Comandos Útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Frontend en localhost:5173 |
| `npm run backend:dev` | Backend en localhost:3000 |
| `npm run build` | Build de producción del frontend |
| `npm run lint` | Revisión ESLint del frontend |
| `npm run backend:build` | Build TypeScript del backend |
| `cd backend && npx prisma studio` | Interfaz visual de base de datos |
| `cd backend && npx prisma migrate dev` | Aplicar migraciones |

## Navegadores Compatibles

La edición funciona en navegadores modernos. La ejecución con WebContainers requiere:

- Chrome.
- Edge.
- Cabeceras COOP/COEP activas.

Firefox y Safari no son objetivo principal del MVP.

## Verificación Antes De La Demo

```bash
npm run build
npm run lint
npm run backend:build
```

Si `npm run backend:build` falla con `tsc no se reconoce`, faltan dependencias del backend. Ejecuta:

```bash
npm run install:backend
```

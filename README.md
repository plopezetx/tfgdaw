# IDE Web Colaborativo con Asistente IA

Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web.

Este proyecto es una plataforma web que permite crear, editar, ejecutar,
guardar, publicar y reutilizar proyectos web desde el navegador. La aplicación
combina una experiencia de IDE online con una capa social de publicación y
remix, y añade un asistente de IA integrado para ayudar al usuario durante el
desarrollo.

La guía está orientada al estudio del proyecto y a la explicación del desarrollo
de sus funcionalidades: qué hace cada módulo, cómo se conectan frontend,
backend y base de datos, y qué decisiones técnicas justifican la solución.

## Índice

- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Funcionalidades principales](#funcionalidades-principales)
- [Arquitectura general](#arquitectura-general)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Modelo de datos](#modelo-de-datos)
- [Explicación por funcionalidades](#explicación-por-funcionalidades)
- [API del backend](#api-del-backend)
- [Flujo recomendado de demostración](#flujo-recomendado-de-demostración)
- [Comandos útiles](#comandos-útiles)
- [Documentación adicional](#documentación-adicional)
- [Mejoras futuras](#mejoras-futuras)

## Objetivo del proyecto

El objetivo es construir un entorno de desarrollo web accesible desde el
navegador, pensado para proyectos HTML, CSS, JavaScript, TypeScript y Node. El
usuario puede programar sin instalar un IDE local, ejecutar el resultado,
guardar su trabajo, publicar proyectos y reutilizar proyectos de otros usuarios.

El término colaborativo se aborda en esta versión mediante publicación,
galería, perfiles de autor, favoritos, seguimiento, comentarios y fork/remix.
La coedición en tiempo real queda planteada como evolución futura.

## Funcionalidades principales

- Autenticación de usuarios con registro, login, logout y JWT.
- Indicador de fuerza de contraseña en el registro.
- Gestión de cuenta: editar nombre de usuario, email, contraseña y borrar la cuenta.
- Panel de proyectos propios con creación, edición en línea, búsqueda, filtro (todos/públicos/privados), duplicado y borrado con confirmación.
- Icono (emoji) opcional por proyecto, elegido en un pop-up al crear o al editar.
- IDE web con editor Monaco, árbol de carpetas plegable, pestañas y preview.
- Gestión multiarchivo en línea: crear, renombrar, eliminar, importar, exportar y descargar archivos.
- Buscar texto en todos los archivos (Ctrl+Shift+F) y paleta de comandos (Ctrl+P).
- Atajos de teclado: Ctrl+S guardar, Ctrl+Enter ejecutar.
- Tour guiado la primera vez (y botón para volver a verlo).
- Ejecución de proyectos en navegador mediante WebContainers.
- Preview embebida, modo ampliado y terminal de logs.
- Consola del preview para capturar `console.log` y errores del proyecto ejecutado.
- Guardado de snapshots del proyecto y autoguardado.
- Historial de versiones con restauración de estados anteriores.
- Plantillas iniciales: Snake, login, lista de tareas, calculadora, reloj y lienzo.
- Plantillas propias guardadas desde proyectos existentes (con su icono).
- Publicación pública o privada de proyectos.
- Galería pública con buscador, ordenación y vista pública por slug.
- Contador de visitas, likes, favoritos y comentarios.
- Lista de favoritos propia.
- Fork/remix de proyectos públicos.
- Perfil propio con avatar, estadísticas y calendario de actividad.
- Perfil público de autor con proyectos publicados y seguidores.
- Seguimiento de autores y feed de proyectos de usuarios seguidos.
- Tema claro/oscuro con persistencia y diseño responsive.
- Notificaciones tipo toast.
- Panel de IA con streaming SSE a través del backend.

## Arquitectura general

La aplicación sigue una arquitectura de frontend pesado y backend ligero.

```txt
Usuario
  |
  v
Frontend React + Vite
  |-- Router propio de SPA
  |-- Contextos de autenticación, tema y notificaciones
  |-- Editor Monaco
  |-- Explorador de archivos
  |-- Preview + consola + terminal
  |-- WebContainers
  |-- Panel IA
  |
  v
Backend Express + TypeScript
  |-- Auth API
  |-- Projects API
  |-- Gallery API
  |-- Social API
  |-- AI proxy
  |
  v
PostgreSQL
  |-- Usuarios
  |-- Proyectos
  |-- Snapshots
  |-- Versiones
  |-- Likes
  |-- Favoritos
  |-- Comentarios
  |-- Seguimientos
```

La decisión más importante es que el código del usuario se ejecuta en el
navegador mediante WebContainers, no en el backend. Esto reduce el riesgo de
seguridad y evita tener que mantener runners remotos para ejecutar código de
terceros.

## Estructura del repositorio

```txt
tfgdaw/
├─ frontend/        Aplicación React del IDE
│  ├─ src/components
│  ├─ src/pages
│  ├─ src/context
│  ├─ src/hooks
│  ├─ src/lib
│  ├─ src/utils
│  └─ src/data
├─ backend/         API Express, Prisma y PostgreSQL
│  ├─ src/routes
│  ├─ src/middleware
│  ├─ src/lib
│  └─ prisma
├─ docs/            Documentación de análisis, arquitectura y setup
├─ package.json     Scripts generales del monorepo
└─ README.md        Guía principal del proyecto
```

## Tecnologías utilizadas

| Área | Tecnología | Uso en el proyecto |
|---|---|---|
| Frontend | React | Construcción de la interfaz por componentes |
| Frontend | TypeScript | Tipado de proyectos, archivos, usuarios y respuestas API |
| Frontend | Vite | Servidor de desarrollo y build |
| Editor | Monaco Editor | Editor de código con experiencia similar a VS Code |
| Ejecución | WebContainers | Runtime Node/web dentro del navegador |
| Formato | Prettier | Formateo de código desde el editor |
| Import/export | JSZip | Exportación del proyecto como `.zip` |
| Backend | Node.js + Express | API REST |
| Backend | Prisma | ORM y migraciones |
| Base de datos | PostgreSQL | Persistencia relacional |
| Seguridad | JWT + bcrypt | Sesiones stateless y contraseñas hasheadas |
| IA | Groq SDK | Asistente de programación con streaming |

## Instalación y ejecución

### Requisitos

- Node.js 18 o superior.
- npm.
- PostgreSQL 14 o superior.
- Chrome o Edge para la ejecución con WebContainers.

### Instalar dependencias

Desde la raíz del proyecto:

```bash
npm run install:frontend
npm run install:backend
```

### Configurar base de datos

Crear una base de datos PostgreSQL, por ejemplo:

```sql
CREATE DATABASE ide_web_db;
```

Después ejecutar las migraciones:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

### Arrancar backend

```bash
npm run backend:dev
```

La API queda disponible en:

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

### Arrancar frontend

En otra terminal:

```bash
npm run dev
```

La aplicación queda disponible en:

```txt
http://localhost:5173
```

## Variables de entorno

Crear `backend/.env` a partir de `backend/.env.example`.

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ide_web_db"
JWT_SECRET="una-cadena-larga-y-segura"
PORT=3000
FRONTEND_URL="http://localhost:5173"
GROQ_API_KEY="tu_api_key_de_groq"
```

`GROQ_API_KEY` solo es necesaria para usar el panel de IA.

Si el frontend necesita apuntar a otro backend, se puede usar:

```env
VITE_BACKEND_URL="http://localhost:3000"
```

## Modelo de datos

El modelo se define con Prisma en `backend/prisma/schema.prisma`.

| Modelo | Responsabilidad |
|---|---|
| `User` | Usuario registrado con email, username y contraseña hasheada |
| `Project` | Proyecto creado por un usuario: nombre, descripción, icono, slug, visibilidad y contador de visitas |
| `ProjectSnapshot` | Estado actual de los archivos del proyecto en formato JSON |
| `ProjectVersion` | Copias históricas de los archivos para restaurar versiones |
| `Like` | Relación usuario-proyecto para los "me gusta" |
| `Comment` | Comentarios escritos por usuarios en proyectos públicos |
| `Favorite` | Proyectos públicos guardados como favoritos |
| `Follow` | Relación de seguimiento entre usuarios |

El proyecto no guarda cada archivo en una tabla independiente. Para simplificar
el MVP, los archivos se serializan como un array JSON:

```json
{
  "files": [
    {
      "name": "index.html",
      "path": "/index.html",
      "language": "html",
      "content": "<!doctype html>..."
    }
  ]
}
```

Esta decisión facilita guardar, cargar, duplicar, publicar y restaurar proyectos
completos con una única estructura.

## Explicación por funcionalidades

### 1. Autenticación y cuenta

El backend expone rutas para registro, login, logout, actualización de perfil y
cambio de contraseña. Las contraseñas se guardan con `bcryptjs` y el inicio de
sesión devuelve un token JWT.

En el frontend, `AuthContext` mantiene el usuario autenticado y el token. El
token se añade a las peticiones protegidas mediante `Authorization: Bearer`.

Puntos clave de desarrollo:

- Validación de campos obligatorios en backend.
- Comprobación de email o username duplicado.
- Hash de contraseña antes de guardar.
- Token JWT con duración de 7 días.
- Rutas privadas protegidas en frontend con `RequireAuth`.
- Indicador visual de fuerza de contraseña en el registro.
- Opción de borrar la cuenta (borra en cascada proyectos y datos asociados).

### 2. Gestión de proyectos

La página de proyectos permite crear, listar, editar, duplicar y eliminar
proyectos propios. Cada proyecto pertenece a un usuario y tiene un `slug` único,
generado a partir del nombre y una marca temporal.

Puntos clave de desarrollo:

- El backend filtra siempre por `ownerId` para impedir acceder a proyectos ajenos.
- Los proyectos se ordenan por `updatedAt`.
- La visibilidad se controla con el booleano `isPublic`.
- La edición del nombre, descripción e icono se hace en línea y se persiste en la API.
- Cada proyecto puede tener un emoji como icono, elegido en un pop-up al crear o editar.
- La lista admite buscador y filtro por todos / públicos / privados.

### 3. IDE web

La página principal de edición vive en `/app/:projectId`. Está formada por:

- Barra superior de acciones.
- Explorador de archivos.
- Pestañas de archivos abiertos.
- Editor Monaco.
- Preview del proyecto.
- Panel inferior con terminal, consola e IA.
- Modal de historial de versiones.

El estado de los archivos se mantiene como `ProjectFile[]`. Cada cambio actualiza
el archivo activo y marca el proyecto como modificado.

Puntos clave de desarrollo:

- El editor recibe el archivo activo y emite cambios de contenido.
- El explorador permite crear rutas como `/src/main.js`.
- No se permite borrar el último archivo del proyecto.
- Hay aviso al cerrar la pestaña si existen cambios sin guardar.
- `Ctrl+S` guarda y `Ctrl+Enter` ejecuta.
- `Ctrl+P` abre la paleta de comandos (abrir archivos y acciones rápidas).
- `Ctrl+Shift+F` busca texto en todos los archivos del proyecto.
- Un tour guiado se muestra la primera vez (con botón `?` para repetirlo).

### 4. Gestión multiarchivo

La aplicación permite crear, renombrar y eliminar archivos. También se pueden
importar varios archivos desde el equipo y exportar el proyecto completo como
`.zip`.

Puntos clave de desarrollo:

- `projectFiles.ts` valida rutas y extensiones.
- `projectIO.ts` gestiona importación y exportación.
- `JSZip` empaqueta los archivos manteniendo su estructura de carpetas.
- El explorador muestra un árbol plegable a partir de rutas planas.
- Crear, renombrar y borrar archivos se hace en línea, sin diálogos del navegador.
- Cada archivo se puede descargar de forma individual desde el editor.

### 5. Ejecución con WebContainers

La ejecución se implementa en `useWebContainer`. El hook convierte los archivos
del editor a un árbol compatible con WebContainers, monta el proyecto y ejecuta:

```txt
npm install
npm run start
```

Cuando el servidor interno está listo, WebContainers emite una URL que se muestra
en un iframe de preview.

Puntos clave de desarrollo:

- Solo se arranca una instancia de WebContainer por pestaña.
- La instancia se reutiliza para evitar errores de doble arranque.
- Si `package.json` no cambia, se evita repetir `npm install`.
- El botón Reset reinicia el runtime sin destruir el contenedor.
- Se comprueba compatibilidad con `crossOriginIsolated` y `SharedArrayBuffer`.

### 6. Preview, terminal y consola

El preview muestra el proyecto ejecutado. La terminal recoge logs del proceso de
instalación y arranque. La consola del preview captura mensajes generados por el
programa del usuario, como `console.log` o errores de JavaScript.

Puntos clave de desarrollo:

- Separación entre logs del runtime y logs del proyecto.
- Limpieza de códigos ANSI para mostrar mensajes legibles.
- Panel inferior con pestañas para alternar terminal, consola e IA.

### 7. Guardado, autoguardado y snapshots

El proyecto se guarda como snapshot JSON en `ProjectSnapshot`. Al cargar un
proyecto, el backend devuelve su snapshot y el frontend reconstruye el editor.

Puntos clave de desarrollo:

- Guardado manual con botón y atajo `Ctrl+S`.
- Autoguardado con retardo de 1 segundo tras cambios.
- `upsert` en Prisma para crear o actualizar el snapshot.
- El estado `dirty` indica cambios pendientes.

### 8. Historial de versiones

Además del snapshot actual, el usuario puede guardar versiones históricas. Cada
versión almacena una copia de los archivos y una etiqueta opcional.

Puntos clave de desarrollo:

- `ProjectVersion` guarda `files` como JSON.
- Se listan versiones sin cargar todos los archivos inicialmente.
- Al restaurar, los archivos vuelven al editor y el proyecto queda pendiente de guardar.
- Se conserva un máximo de 20 versiones por proyecto.

### 9. Plantillas iniciales

El proyecto incluye plantillas para crear proyectos de ejemplo rápidamente:

- Snake.
- Página de login.
- Lista de tareas.
- Calculadora.
- Reloj digital.
- Lienzo de dibujo.

Cada plantilla está formada por varios `ProjectFile`, por lo que se integra con
el mismo sistema de edición, guardado, ejecución y publicación.

Además, el usuario puede guardar un proyecto propio como plantilla. Estas
plantillas personales se almacenan en el navegador y sirven para crear nuevos
proyectos reutilizando una estructura previa.

Puntos clave de desarrollo:

- Las plantillas base viven en `src/data/templates.ts`.
- Las plantillas personales se gestionan desde `src/data/userTemplates.ts`.
- Crear desde plantilla genera un proyecto y guarda sus archivos como snapshot.
- Guardar como plantilla toma el snapshot del proyecto actual y lo reutiliza.

### 10. Publicación y galería

Un proyecto puede cambiar entre privado y público. Cuando es público, aparece en
la galería y puede abrirse mediante `/p/:slug`.

Puntos clave de desarrollo:

- `isPublic` controla la visibilidad.
- Las rutas públicas solo devuelven proyectos publicados.
- Cada visita a un proyecto público incrementa `views`.
- La galería devuelve proyectos con autor y contador de likes.

### 11. Vista pública y fork/remix

La vista pública permite consultar un proyecto publicado y su snapshot. Un
usuario autenticado puede hacer fork/remix, creando una copia propia del proyecto
con los mismos archivos.

Puntos clave de desarrollo:

- El fork solo se permite sobre proyectos públicos.
- Se crea un nuevo `Project` asociado al usuario autenticado.
- Se copia el snapshot del proyecto original.
- `forkedFromId` conserva la relación con el proyecto fuente.

### 12. Likes, favoritos y comentarios

La capa social permite dar like, guardar favoritos y comentar proyectos públicos.

Puntos clave de desarrollo:

- `Like` y `Favorite` tienen restricciones únicas por usuario y proyecto.
- Las acciones funcionan como alternadores: si existe, se elimina; si no existe, se crea.
- Los comentarios solo se pueden crear en proyectos públicos.
- Un comentario puede borrarlo su autor o el dueño del proyecto.

### 13. Perfiles, seguimiento y feed

El perfil propio muestra información del usuario, estadísticas y actividad. El
perfil público `/u/:username` muestra proyectos públicos de un autor y permite
seguirlo.

El feed de seguidos muestra proyectos recientes de los autores que sigue el
usuario autenticado.

Puntos clave de desarrollo:

- `Follow` modela una relación usuario-usuario.
- No se permite seguirse a uno mismo.
- El perfil de autor incluye número de seguidores y seguidos.
- El feed filtra proyectos públicos de autores seguidos.

### 14. Tema y notificaciones

La aplicación incluye tema claro/oscuro y notificaciones de acciones importantes.

Puntos clave de desarrollo:

- `ThemeContext` guarda la preferencia del usuario.
- `ToastContext` centraliza mensajes de éxito y error.
- Las páginas y acciones muestran feedback inmediato tras guardar, exportar,
  importar, publicar o fallar una operación.

### 15. Asistente IA

El panel IA permite enviar una petición junto con el archivo activo y, si existe,
una selección de código. El frontend llama al backend y recibe la respuesta por
streaming SSE.

El backend usa Groq con el modelo `llama-3.3-70b-versatile`.

Puntos clave de desarrollo:

- La API key no se expone en el frontend.
- El backend actúa como proxy seguro.
- La respuesta llega por `text/event-stream`.
- El usuario decide si aplica el código sugerido al editor.
- El prompt del sistema orienta a la IA como asistente experto integrado en un IDE.

## API del backend

### Salud

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Comprueba que la API está activa |

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/logout` | Cerrar sesión en cliente |
| `PUT` | `/auth/me` | Editar username y email |
| `PUT` | `/auth/password` | Cambiar contraseña |
| `DELETE` | `/auth/me` | Borrar la cuenta y sus datos |

### Proyectos privados

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/projects` | Listar proyectos del usuario |
| `POST` | `/projects` | Crear proyecto |
| `GET` | `/projects/:id` | Obtener proyecto propio |
| `PUT` | `/projects/:id` | Actualizar metadatos |
| `DELETE` | `/projects/:id` | Eliminar proyecto |
| `PUT` | `/projects/:id/snapshot` | Guardar snapshot |
| `GET` | `/projects/:id/snapshot` | Cargar snapshot |

### Versiones

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/projects/:id/versions` | Listar versiones |
| `POST` | `/projects/:id/versions` | Crear versión |
| `GET` | `/projects/:id/versions/:versionId` | Recuperar archivos de una versión |

### Galería y comunidad

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/projects/public/gallery` | Listar proyectos públicos |
| `GET` | `/projects/public/:slug` | Abrir proyecto público |
| `GET` | `/projects/public/author/:username` | Ver perfil público de autor |
| `POST` | `/projects/:id/fork` | Crear fork de un proyecto público |
| `GET` | `/projects/:id/like-status` | Consultar estado de like |
| `POST` | `/projects/:id/like` | Alternar like |
| `GET` | `/projects/:id/favorite-status` | Consultar estado de favorito |
| `POST` | `/projects/:id/favorite` | Alternar favorito |
| `GET` | `/projects/favorites` | Listar favoritos |
| `GET` | `/projects/following/feed` | Feed de autores seguidos |
| `GET` | `/projects/authors/:username/follow-status` | Consultar seguimiento |
| `POST` | `/projects/authors/:username/follow` | Alternar seguimiento |
| `GET` | `/projects/public/:slug/comments` | Listar comentarios |
| `POST` | `/projects/:id/comments` | Crear comentario |
| `DELETE` | `/projects/:id/comments/:commentId` | Borrar comentario |

### IA

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/ai/chat` | Enviar mensaje al asistente IA por streaming |

## Flujo recomendado de demostración

1. Abrir la aplicación en `http://localhost:5173`.
2. Registrar un usuario o iniciar sesión.
3. Crear un proyecto desde una plantilla.
4. Abrir el IDE y mostrar explorador, pestañas y editor.
5. Editar código y usar `Ctrl+S`.
6. Ejecutar con WebContainers y enseñar preview, terminal y consola.
7. Crear una versión en el historial y restaurarla.
8. Importar un archivo y exportar el proyecto como `.zip`.
9. Publicar el proyecto y copiar el enlace público.
10. Abrir la galería y buscar el proyecto.
11. Entrar en la vista pública, dar like, comentar y guardar como favorito.
12. Abrir el perfil del autor y seguirlo.
13. Hacer fork/remix con otro usuario.
14. Mostrar el feed de seguidos.
15. Abrir el panel IA y pedir ayuda sobre el archivo activo.

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el frontend |
| `npm run build` | Compila el frontend |
| `npm run lint` | Ejecuta ESLint del frontend |
| `npm run preview` | Previsualiza el build del frontend |
| `npm run backend:dev` | Arranca el backend |
| `npm run backend:build` | Compila el backend |
| `npm run install:frontend` | Instala dependencias del frontend |
| `npm run install:backend` | Instala dependencias del backend |
| `cd backend && npx prisma studio` | Abre Prisma Studio |
| `cd backend && npx prisma migrate dev` | Ejecuta migraciones |
| `cd backend && npx prisma generate` | Genera el cliente Prisma |

En Windows PowerShell, si aparece un error de política de ejecución con `npm` o
`npx`, puede usarse `npm.cmd` o `npx.cmd`.

## Documentación adicional

La carpeta `docs/` contiene documentación complementaria del TFG:

| Documento | Contenido |
|---|---|
| `docs/00-context.md` | Contexto, motivación y alcance |
| `docs/01-specs.md` | Requisitos funcionales y no funcionales |
| `docs/02-roadmap.md` | Fases de desarrollo |
| `docs/03-arquitectura.md` | Arquitectura frontend, backend y base de datos |
| `docs/04-decisiones-tecnicas.md` | Decisiones técnicas justificadas |
| `docs/05-riesgos.md` | Riesgos y mitigaciones |
| `docs/06-demo-tfg.md` | Guion de demostración |
| `docs/07-continuacion-ia.md` | Notas de continuación |
| `docs/08-proximos-pasos.md` | Estado y tareas restantes |
| `docs/09-setup-dev.md` | Configuración del entorno |

## Mejoras futuras

- Coedición en tiempo real con WebSockets o Yjs.
- Integración con GitHub para importar/exportar repositorios.
- Sistema de roles docentes y aulas.
- Búsqueda avanzada o semántica en proyectos públicos.
- Moderación de comentarios y contenido publicado.
- Métricas más completas de actividad.
- Plantillas avanzadas para frameworks.
- Tests automatizados de frontend y backend.
- Despliegue completo con cabeceras COOP/COEP configuradas.

## Conclusión

El proyecto demuestra una solución completa para crear y compartir proyectos web
desde el navegador. La parte central es el IDE con ejecución mediante
WebContainers, mientras que el backend aporta persistencia, autenticación,
galería social e integración segura con IA. La arquitectura permite estudiar de
forma clara cómo se conectan una SPA moderna, una API REST, una base de datos
relacional y servicios externos dentro de un mismo producto funcional.

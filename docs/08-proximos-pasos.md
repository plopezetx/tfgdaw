# 08 - Próximos pasos

## Estructura actual del proyecto

```
tfgdaw/
├── frontend/                  ← App React (Vite + TypeScript + Monaco + WebContainers)
│   └── src/
│       ├── hooks/
│       │   └── useWebContainer.ts      ← lógica de boot/mount/install/start
│       ├── components/
│       │   ├── FileExplorer.tsx        ← sidebar de archivos
│       │   ├── EditorTabs.tsx          ← barra de tab del archivo activo
│       │   ├── CodeEditor.tsx          ← wrapper de Monaco Editor
│       │   ├── PreviewFrame.tsx        ← iframe del servidor WebContainer
│       │   └── TerminalPanel.tsx       ← logs del WebContainer
│       ├── data/
│       │   └── initialFiles.ts         ← archivos de ejemplo (HTML/JS/CSS)
│       ├── types/
│       │   └── projects.ts             ← tipo ProjectFile
│       └── utils/
│           ├── projectToFileSystemTree.ts ← convierte ProjectFile[] → FileSystemTree
│           └── storage.ts              ← save/load/clear en localStorage
├── backend/                   ← API Express (Node + TypeScript + Prisma)
│   ├── src/
│   │   ├── index.ts           ← entrada Express, CORS, rutas
│   │   ├── lib/
│   │   │   └── prisma.ts      ← singleton PrismaClient
│   │   ├── middleware/
│   │   │   └── requireAuth.ts ← verifica JWT, añade req.user
│   │   └── routes/
│   │       ├── auth.ts        ← register, login, logout (IMPLEMENTADO)
│   │       └── projects.ts    ← CRUD proyectos + snapshot (IMPLEMENTADO)
│   └── prisma/
│       └── schema.prisma      ← modelos User, Project, ProjectSnapshot
└── docs/                      ← documentación del proyecto
```

---

## Comandos de desarrollo

```bash
# Frontend
npm run dev              # arranca Vite en localhost:5173
npm run build            # build de producción

# Backend
npm run backend:dev      # arranca Express en localhost:3000 (requiere DB)

# Instalar dependencias (si clonamos el repo)
npm run install:frontend
npm run install:backend
```

---

## Estado por fases

### ✅ Fase 0 — Preparación inicial
Completa. Repositorio, documentación base y decisiones técnicas.

### ✅ Fase 1 — Spike técnico del IDE
Completa. Monaco Editor + WebContainers integrados. Layout limpio: FileExplorer | Editor | Preview+Terminal en un único workspace.

### ✅ Fase 2 — Persistencia local
Completa. `frontend/src/utils/storage.ts` gestiona localStorage.

- Los archivos se guardan automáticamente 1 segundo después del último cambio.
- El botón "Guardar" guarda de inmediato y muestra "Guardado ✓" brevemente.
- El botón "Nuevo" borra el storage y restaura los archivos iniciales (pide confirmación).
- Al cargar la app, intenta recuperar el proyecto del localStorage antes de usar los archivos iniciales.

**Limitación conocida**: si el usuario cambia de dispositivo o borra datos del navegador, pierde el trabajo. Eso se resuelve en Fase 3.

### 🔶 Fase 3 — Backend y base de datos (estructura lista, lógica implementada, SIN conectar al frontend)

El backend está creado y funciona en aislado. Falta:

1. **Configurar PostgreSQL localmente** (o usar un servicio cloud como Supabase / Neon).
2. **Crear el archivo `.env`** en `backend/` copiando `.env.example` y rellenando `DATABASE_URL` y `JWT_SECRET`.
3. **Ejecutar la migración de Prisma**:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. **Verificar que el backend arranca**:
   ```bash
   npm run backend:dev
   # GET http://localhost:3000/health → { "status": "ok" }
   ```
5. **Conectar el frontend con la API** (ver sección siguiente).

### ⬜ Fase 3 continuación — Conectar frontend con el backend

Una vez el backend esté corriendo con BD:

1. Crear `frontend/src/lib/api.ts` con funciones fetch tipadas:
   - `register(email, username, password)`
   - `login(email, password)` → devuelve token
   - `getProjects()` → lista de proyectos
   - `createProject(name)` → nuevo proyecto
   - `saveSnapshot(projectId, files)`
   - `loadSnapshot(projectId)` → `ProjectFile[]`

2. Crear contexto de autenticación `frontend/src/context/AuthContext.tsx`:
   - Guarda el token JWT en `localStorage`
   - Expone `user`, `login()`, `logout()`

3. Añadir React Router (`react-router-dom`):
   - `/` → landing / login
   - `/app` → IDE (requiere auth)
   - `/projects` → lista de proyectos del usuario

4. En el IDE, reemplazar `saveProject()` de `storage.ts` por `saveSnapshot()` de la API.

5. En el IDE, reemplazar `loadProject()` de `storage.ts` por `loadSnapshot()` al abrir un proyecto.

### ⬜ Fase 4 — IDE funcional completo

- Árbol de archivos con carpetas anidadas (no lista plana).
- Crear / renombrar / eliminar archivos desde el explorador.
- Múltiples tabs abiertas simultáneamente.
- Indicador de archivo modificado sin guardar (punto en la tab).
- Optimización WebContainer: no reinstalar si `package.json` no cambia entre ejecuciones.
- Botón de reset del runtime (matar servidor y volver a arrancar).
- Pantalla de advertencia cuando el navegador no es compatible con WebContainers.

### ⬜ Fase 5 — Publicación y comunidad

- Campo `isPublic` en el modelo de proyecto (ya en el schema).
- Endpoint `GET /gallery` (proyectos públicos paginados, sin `requireAuth`).
- Vista de galería en el frontend.
- Página pública de proyecto: `/p/:username/:slug` (solo lectura + ejecutar).
- Fork/remix: `POST /projects/:id/fork` + guardar `forkedFromId`.

### ✅ Fase 6 — Asistente IA

- Panel lateral de IA en el frontend.
- Endpoint proxy en el backend: `POST /ai/chat` (oculta la API key).
- Integrar la API de Groq (`llama-3.3-70b-versatile`) con streaming SSE.
- Enviar al modelo: archivo activo + selección del editor + mensaje del usuario.
- Mostrar respuesta con markdown.
- Si la respuesta incluye código, botón "Aplicar al editor".

### ⬜ Fase 7 — Validación y demo

- Probar los 5 escenarios de `docs/01-specs.md` de principio a fin.
- Limpiar errores de TypeScript y ESLint.
- Añadir mensajes de error comprensibles (no solo `console.error`).
- Preparar script de instalación en `README.md`.
- Grabar capturas para la memoria.

---

## Próximo paso inmediato

> Actualización 26/05/2026: el frontend ya incluye crear, renombrar y eliminar archivos, tabs reales, reset de runtime, aviso de compatibilidad y optimización para no reinstalar dependencias si `package.json` no cambia. El backend ya añade endpoints públicos de galería, lectura por slug y fork/remix. Queda conectar el frontend con la API real.

El siguiente bloque de trabajo arranca con Fase 3 continuación:

1. Levantar PostgreSQL (local o cloud).
2. Rellenar `.env` del backend.
3. Ejecutar `prisma migrate dev`.
4. Crear `frontend/src/lib/api.ts` y `frontend/src/context/AuthContext.tsx`.
5. Añadir React Router y las rutas `/`, `/app`, `/projects`.

Con eso, el flujo completo de "registrarse → crear proyecto → editar → guardar en BD → recuperar" quedará cerrado.

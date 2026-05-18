# 08 - Próximos pasos

## Estado tras la limpieza de Fase 1

El spike técnico ha sido refactorizado en una base limpia y extensible. El estado actual es:

### Lo que funciona

- Monaco Editor multiarchivo con selección de archivo activo.
- Tab bar con el nombre del archivo abierto.
- WebContainer se inicia al pulsar "Ejecutar".
- Los archivos del editor se montan en el WebContainer.
- `npm install` y `npm run start` (Vite) se ejecutan dentro del contenedor.
- La preview real aparece en el iframe de la columna derecha una vez el servidor arranca.
- Los logs de npm se muestran en el panel de terminal.

### Arquitectura actual

```
src/
├── hooks/
│   └── useWebContainer.ts    — lógica de boot/mount/install/start
├── components/
│   ├── FileExplorer.tsx       — sidebar con lista de archivos
│   ├── EditorTabs.tsx         — barra de tabs del editor
│   ├── CodeEditor.tsx         — wrapper de Monaco Editor
│   ├── PreviewFrame.tsx       — iframe del servidor WebContainer
│   └── TerminalPanel.tsx      — logs del WebContainer
├── data/
│   └── initialFiles.ts        — archivos de ejemplo en memoria
├── types/
│   └── projects.ts            — tipo ProjectFile
├── utils/
│   └── projectToFileSystemTree.ts — conversión a FileSystemTree
└── App.tsx                    — estado global y layout principal
```

### Limitaciones conocidas

- Los archivos solo existen en memoria (se pierden al recargar la página).
- No hay autenticación ni usuarios.
- El árbol de archivos es una lista plana (no muestra carpetas anidadas).
- Solo se puede abrir un archivo a la vez (no hay múltiples tabs abiertas).
- WebContainers requiere Chrome o Edge modernos (no funciona en Firefox).
- Cada vez que se pulsa "Ejecutar" se reinstalan todas las dependencias.

---

## Fase 2 — Persistencia local

**Objetivo**: el usuario puede guardar su trabajo y recuperarlo al recargar la página.

**Tareas**:

1. Crear `src/utils/storage.ts` con dos funciones:
   - `saveProjectToLocalStorage(files: ProjectFile[]): void`
   - `loadProjectFromLocalStorage(): ProjectFile[] | null`
2. En `App.tsx`, al inicializar el estado de `files`, intentar cargar desde `localStorage` primero.
3. Añadir guardado automático en `handleChangeFileContent` (debounced, ~1 segundo).
4. Añadir botón "Guardar" manual en la topbar (feedback visual breve).
5. Añadir botón "Nuevo proyecto" que limpia el estado y el storage.
6. Validar que al recargar la página el proyecto se recupera correctamente.

**Criterio de salida**: el usuario edita código, recarga la página y sigue viendo sus cambios.

---

## Fase 3 — Backend y base de datos

**Objetivo**: proyectos guardados en servidor, con usuarios.

**Stack**:
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL

**Estructura de carpetas**:
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   └── projects.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Tareas**:

1. Inicializar proyecto Node + TypeScript en `backend/`.
2. Configurar Express con rutas básicas.
3. Configurar Prisma con modelos `User`, `Project`, `ProjectSnapshot`.
4. Implementar endpoints de autenticación:
   - `POST /auth/register`
   - `POST /auth/login`
   - `POST /auth/logout`
5. Implementar endpoints de proyectos:
   - `GET /projects` (proyectos del usuario autenticado)
   - `POST /projects`
   - `GET /projects/:id`
   - `PUT /projects/:id`
   - `DELETE /projects/:id`
6. Implementar endpoints de snapshot (estado de archivos):
   - `PUT /projects/:id/snapshot`
   - `GET /projects/:id/snapshot`
7. Conectar el frontend con la API (reemplazar localStorage por llamadas fetch).

**Criterio de salida**: un usuario puede registrarse, crear un proyecto, guardar sus archivos en la BD y recuperarlos.

---

## Fase 4 — IDE funcional completo

**Objetivo**: el editor es cómodo de usar en el día a día.

**Tareas**:

1. Árbol de archivos con carpetas anidadas (no lista plana).
2. Crear nuevo archivo (input en el explorador).
3. Renombrar archivo (doble clic o menú contextual).
4. Eliminar archivo (botón o menú contextual).
5. Múltiples tabs abiertas simultáneamente (no solo una activa).
6. Indicador visual de archivo modificado sin guardar (punto en la tab).
7. Guardado automático configurable.
8. Optimización de WebContainer: no reinstalar dependencias si `package.json` no ha cambiado.
9. Botón de reset del runtime (matar el servidor y volver a arrancar).
10. Pantalla de error clara cuando el navegador no es compatible con WebContainers.

---

## Fase 5 — Publicación y comunidad

**Objetivo**: compartir proyectos públicamente y reutilizarlos.

**Tareas**:

1. Añadir campo `isPublic` al modelo de proyecto.
2. Crear endpoint `GET /gallery` (proyectos públicos paginados).
3. Crear vista de galería en el frontend.
4. Crear página pública de proyecto (`/p/:username/:projectSlug`).
5. En la página pública: mostrar código (solo lectura) y ejecutar en WebContainer.
6. Implementar fork/remix: `POST /projects/:id/fork`.
7. Guardar relación `forkedFrom` entre proyectos.
8. Diferenciar vista propietario (editar, publicar) vs. vista visitante (ver, forkear).

---

## Fase 6 — Asistente IA

**Objetivo**: ayuda contextual para el desarrollador dentro del IDE.

**Tareas**:

1. Crear panel lateral de IA en el frontend (colapsable).
2. Crear endpoint proxy en el backend: `POST /ai/chat` (oculta la API key).
3. Integrar Claude API (Sonnet) en el backend con prompt caching.
4. En el frontend, enviar el archivo activo + selección del editor como contexto.
5. Mostrar respuesta de la IA en el panel lateral con markdown.
6. Si la respuesta incluye código, añadir botón "Aplicar al editor".
7. Gestionar casos sin disponibilidad (rate limit, API key no configurada).

**Referencia**: ver `docs/07-continuacion-ia.md` para el diseño detallado del módulo IA.

---

## Fase 7 — Validación y demo

**Objetivo**: el proyecto es demostrable sin intervención técnica.

**Tareas**:

1. Probar los 5 escenarios de `docs/01-specs.md` de principio a fin.
2. Revisar y limpiar errores de TypeScript y ESLint.
3. Añadir mensajes de error comprensibles para el usuario (no solo `console.error`).
4. Revisar accesibilidad básica (roles ARIA, contraste de color).
5. Preparar script de instalación y arranque local en `README.md`.
6. Grabar capturas para la memoria del TFG.
7. Preparar guion de demo (`docs/06-demo-tfg.md`).

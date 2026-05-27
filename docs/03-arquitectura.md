# 03 - Arquitectura del Sistema

## Visión general

La arquitectura del sistema se plantea como una aplicación web con frontend pesado y backend ligero.

El frontend concentra la experiencia del IDE: editor, árbol de archivos, preview, terminal/logs, ejecución local y panel IA. El backend se encargará de autenticación, persistencia, publicación, galería y comunicación segura con servicios externos.

## Diagrama general

```txt
Usuario
  |
  v
Frontend React
  |-- Monaco Editor
  |-- File Explorer
  |-- Preview Panel
  |-- Terminal / Logs
  |-- WebContainer Runtime
  |-- AI Panel
  |
  v
Backend Express
  |-- Auth
  |-- Projects API
  |-- Snapshots API
  |-- Public Gallery API
  |-- Fork API
  |-- AI Proxy
  |
  v
PostgreSQL
  |-- users
  |-- projects
  |-- project_snapshots
  |-- publications
  |-- forks
  |-- ai_interactions
```

## Principio arquitectónico principal

La ejecución del código del usuario debe realizarse, en la medida de lo posible, en el navegador y no en el backend principal.

Esto reduce:

- Riesgos de seguridad.
- Coste de infraestructura.
- Complejidad de sandboxing.
- Necesidad de runners remotos.

## Frontend

### Tecnologías previstas

- React.
- TypeScript.
- Vite.
- Monaco Editor.
- WebContainers.
- xterm.js o panel propio de logs.
- TailwindCSS o CSS modular.

### Responsabilidades del frontend

- Renderizar la interfaz del IDE.
- Gestionar el estado del proyecto abierto.
- Permitir editar archivos.
- Mostrar árbol de archivos.
- Ejecutar o previsualizar el proyecto.
- Mostrar logs.
- Comunicarse con el backend.
- Mostrar estado de guardado.
- Mostrar panel IA.

## Estado actual del frontend

Actualmente ya existe:

- Aplicación Vite + React + TypeScript.
- Componente `FileExplorer`.
- Componente `CodeEditor`.
- Componente `PreviewPanel`.
- Componente `TerminalPanel`.
- Componente `WebContainerRunner`.
- Datos iniciales en memoria en `initialFiles.ts`.
- Tipado básico en `projects.ts`.
- Estilos iniciales de layout en `index.css`.
- Utilidad `projectToFileSystemTree.ts` para convertir archivos del editor a `FileSystemTree`.

## Componentes actuales

### `FileExplorer`

Responsable de mostrar la lista de archivos disponibles y permitir seleccionar el archivo activo.

### `CodeEditor`

Responsable de mostrar Monaco Editor y emitir cambios sobre el contenido del archivo activo.

### `PreviewPanel`

Responsable de mostrar una preview inicial mediante `iframe` y `srcDoc`.

### `TerminalPanel`

Responsable de mostrar logs simulados o mensajes del sistema.

### `WebContainerRunner`

Responsable de arrancar WebContainers, montar los archivos del editor como `FileSystemTree`, ejecutar `npm install` y lanzar `npm run start`.

Actualmente recibe `files` desde `App.tsx` y genera un proyecto ejecutable mediante `createRunnableFileSystemTree`. El flujo todavía debe validarse en navegador compatible y mejorar el ciclo de reset/re-ejecución.

### `projectToFileSystemTree`

Utilidad responsable de transformar el modelo actual `ProjectFile[]` en el árbol de archivos que espera WebContainers.

También existe `createRunnableFileSystemTree`, que añade un `package.json` básico si el proyecto todavía no lo incluye.

## Componentes previstos

### `ProjectLayout`

Componente contenedor del IDE principal.

### `ProjectToolbar`

Barra superior con acciones: guardar, ejecutar, publicar, resetear.

### `FileTree`

Versión avanzada del explorador de archivos con carpetas.

### `RunControls`

Controles de ejecución.

### `AiPanel`

Panel lateral de asistencia IA.

### `PublicProjectPage`

Vista pública de proyecto publicado.

### `Dashboard`

Vista de proyectos del usuario.

## Modelo de datos en frontend

Actualmente se utiliza el siguiente tipo básico:

```ts
export type ProjectFile = {
  name: string;
  path: string;
  language: string;
  content: string;
};
```

Este modelo es suficiente para el primer prototipo, pero más adelante puede ampliarse con:

- Tipo de nodo: archivo o carpeta.
- Fecha de modificación.
- Indicador de cambios sin guardar.
- Tamaño.
- Metadatos de lenguaje.
- Ordenación.

## Backend

### Tecnologías previstas

- Node.js.
- Express.
- TypeScript.
- Prisma.
- PostgreSQL.

### Responsabilidades del backend

- Registro de usuarios.
- Inicio de sesión.
- Gestión de sesiones o tokens.
- CRUD de proyectos.
- Persistencia de snapshots.
- Gestión de publicación pública.
- Creación de forks.
- Proxy seguro para IA.
- Validación de permisos.

## Base de datos

### Entidades previstas

#### User

Representa a una persona usuaria del sistema.

Campos previstos:

- `id`
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

#### Project

Representa un proyecto editable.

Campos previstos:

- `id`
- `ownerId`
- `title`
- `description`
- `visibility`
- `createdAt`
- `updatedAt`

#### ProjectSnapshot

Representa el estado de archivos de un proyecto en un momento dado.

Campos previstos:

- `id`
- `projectId`
- `snapshotJson`
- `createdAt`

#### Publication

Representa la publicación pública de un proyecto.

Campos previstos:

- `id`
- `projectId`
- `slug`
- `isPublished`
- `publishedAt`

#### Fork

Representa la relación entre un proyecto original y una copia derivada.

Campos previstos:

- `id`
- `sourceProjectId`
- `forkedProjectId`
- `createdAt`

#### AIInteraction

Representa una interacción con el asistente IA.

Campos previstos:

- `id`
- `userId`
- `projectId`
- `actionType`
- `prompt`
- `response`
- `createdAt`

## Persistencia de proyectos

Para el MVP se recomienda guardar los proyectos como snapshot JSON. Esto simplifica la persistencia del árbol de archivos y permite evolucionar más adelante.

Ejemplo de snapshot:

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

## Ejecución

La ejecución principal se realizará en navegador mediante WebContainers para proyectos compatibles.

### Flujo previsto

1. El usuario edita archivos en Monaco.
2. `App.tsx` mantiene el estado del proyecto como `ProjectFile[]`.
3. `WebContainerRunner` recibe los archivos cuando se pulsa ejecutar.
4. `createRunnableFileSystemTree` transforma el estado a un árbol compatible con WebContainers.
5. El árbol se monta en el WebContainer.
6. Se ejecutan comandos necesarios.
7. Se obtiene una URL de preview.
8. La URL se muestra en un iframe.

### Estado actual del flujo de ejecución

La conversión y el paso de datos ya están implementados. Queda pendiente validar el comportamiento completo en Chrome/Edge, optimizar reinstalaciones y añadir reset explícito del runtime.

Actualización 26/05/2026:

- La lógica de runtime vive en `frontend/src/hooks/useWebContainer.ts`.
- Existe botón de reset del runtime.
- Se detecta compatibilidad básica con `crossOriginIsolated` y `SharedArrayBuffer`.
- Se evita repetir `npm install` si el contenido de `package.json` no cambia.
- El explorador permite crear, renombrar y eliminar archivos.
- El backend añade endpoints públicos de galería, lectura por slug y fork.

## IA

La IA se integrará como módulo independiente.

### Flujo previsto

1. El usuario selecciona código o escribe una petición.
2. El frontend envía la solicitud al backend.
3. El backend llama al proveedor IA.
4. El backend devuelve la respuesta.
5. El frontend muestra la respuesta.
6. Si hay cambios de código, el usuario decide si aplicarlos.

## Seguridad

### Decisiones iniciales

- No exponer API keys en frontend.
- No ejecutar código de usuario en backend durante el MVP.
- Validar permisos en cada operación de proyecto.
- Mantener proyectos privados por defecto.
- Revisar compatibilidad del navegador antes de arrancar ejecución avanzada.

## Despliegue previsto

### Frontend

Opciones:

- Vercel.
- Netlify.
- Cloudflare Pages.

Debe soportar cabeceras COOP/COEP para WebContainers.

### Backend

Opciones:

- Render.
- Railway.
- Fly.io.

### Base de datos

Opciones:

- Supabase.
- Neon.
- Railway PostgreSQL.
- Render PostgreSQL.

## Evolución futura

Posibles mejoras:

- Coedición en tiempo real con WebSockets/Yjs.
- Integración con GitHub.
- Plantillas avanzadas.
- Búsqueda semántica de snippets.
- Mayor soporte de frameworks.
- Modo docente para compartir plantillas.

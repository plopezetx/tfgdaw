# 07 - Continuación del Desarrollo

## Objetivo del documento

Este documento está pensado para facilitar la continuación del proyecto por otra persona o por una herramienta de asistencia al desarrollo. Resume el estado actual, la estructura del código, las decisiones tomadas y el siguiente paso técnico recomendado.

## Estado actual resumido

El proyecto se encuentra en una fase inicial de prototipado.

Ya existe:

- Repositorio inicial.
- Documentación base.
- Frontend con React + Vite + TypeScript.
- Editor Monaco funcional.
- Explorador simple de archivos.
- Preview simple.
- Terminal/logs simulados.
- Preparación inicial para WebContainers.
- Componente de prueba para WebContainers.

## Estructura actual esperada

```txt
tfgdaw/
├─ docs/
│  ├─ 00-contexto.md
│  ├─ 01-specs.md
│  ├─ 02-roadmap.md
│  ├─ 03-arquitectura.md
│  ├─ 04-decisiones-tecnicas.md
│  ├─ 05-riesgos.md
│  ├─ 06-demo-tfg.md
│  └─ 07-continuacion-ia.md
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ CodeEditor.tsx
│  │  │  ├─ FileExplorer.tsx
│  │  │  ├─ PreviewPanel.tsx
│  │  │  ├─ TerminalPanel.tsx
│  │  │  └─ WebContainerRunner.tsx
│  │  ├─ data/
│  │  │  ├─ initialFiles.ts
│  │  │  └─ webcontainerProject.ts
│  │  ├─ types/
│  │  │  └─ project.ts
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ vite.config.ts
│  └─ package.json
├─ README.md
├─ deep-research-report.md
└─ deep-research-report-2.md
```

## Stack actual

### Frontend

- React.
- TypeScript.
- Vite.
- Monaco Editor.
- WebContainers.
- CSS propio inicial.

### Backend

Todavía no implementado.

### Base de datos

Todavía no implementada.

## Comandos de desarrollo

Desde la raíz del repositorio:

```txt
C:\Users\pablo\Desktop\tfgdaw\tfgdaw
```

se puede ejecutar:

```bash
npm run dev
npm run build
npm run lint
```

El `package.json` raíz delega esos comandos en la carpeta `frontend`.

## Funcionamiento actual

La aplicación carga una estructura de archivos en memoria desde `initialFiles.ts`.

El usuario puede:

- Seleccionar archivo.
- Editar contenido.
- Ver preview simple.
- Pulsar ejecutar para refrescar preview.
- Ver logs simulados.

La parte de WebContainers está separada en `WebContainerRunner.tsx` y usa un proyecto fijo definido en `webcontainerProject.ts`.

## Problema técnico actual

Actualmente hay dos flujos separados:

```txt
Editor Monaco -> Preview simple
WebContainerRunner -> Proyecto fijo de prueba
```

El objetivo inmediato es unirlos:

```txt
Editor Monaco -> FileSystemTree -> WebContainer -> Preview real
```

## Siguiente tarea técnica recomendada

### Tarea

Crear una función que convierta `ProjectFile[]` en un `FileSystemTree` compatible con WebContainers.

### Entrada actual

```ts
type ProjectFile = {
  name: string;
  path: string;
  language: string;
  content: string;
};
```

### Salida deseada

```ts
FileSystemTree
```

### Ejemplo de transformación

De:

```ts
[
  {
    name: "index.html",
    path: "/index.html",
    language: "html",
    content: "<!doctype html>..."
  },
  {
    name: "main.js",
    path: "/src/main.js",
    language: "javascript",
    content: "console.log('hola')"
  }
]
```

A:

```ts
{
  "index.html": {
    file: {
      contents: "<!doctype html>..."
    }
  },
  "src": {
    directory: {
      "main.js": {
        file: {
          contents: "console.log('hola')"
        }
      }
    }
  }
}
```

## Archivos recomendados para crear

### `frontend/src/utils/projectToFileSystemTree.ts`

Debe contener la función de conversión.

### `frontend/src/components/RuntimePreview.tsx`

Puede sustituir progresivamente a `WebContainerRunner`.

## Orden recomendado de implementación

1. Crear utilidad `projectToFileSystemTree`.
2. Modificar `WebContainerRunner` para recibir `files` por props.
3. Montar los archivos recibidos en lugar de `webcontainerProject`.
4. Añadir `package.json` automáticamente si no existe.
5. Añadir `index.html` y estructura necesaria.
6. Ejecutar `npm install`.
7. Ejecutar `npm run start`.
8. Mostrar URL real en iframe.
9. Añadir botón Reset Runtime.
10. Sustituir preview simple por preview real cuando esté estable.

## Advertencia importante

WebContainers solo permite una instancia por pestaña. En desarrollo, React Strict Mode puede provocar doble arranque. Si aparece el error de instancia duplicada, revisar `main.tsx` y evitar doble render durante el spike.

## Estado de commits

El último commit recomendado hasta este punto es:

```txt
Crea estructura inicial del TFG con editor, preview y prueba de WebContainers
```

## Próximas fases después de WebContainers

### Persistencia local

Guardar snapshots en `localStorage`.

### Backend

Crear API con Express.

### Base de datos

Configurar PostgreSQL y Prisma.

### Proyectos

Crear CRUD de proyectos.

### Publicación

Añadir proyectos públicos y fork/remix.

### IA

Añadir panel de ayuda contextual.

## Criterio de avance

No avanzar al backend hasta que el flujo básico de ejecución esté suficientemente validado o hasta que se haya decidido formalmente mantener preview simple como alternativa temporal.

## Recomendación de desarrollo

Trabajar con commits pequeños:

```txt
Integra conversión de archivos a FileSystemTree
Conecta editor con runtime de WebContainers
Añade guardado local de proyectos
Crea backend inicial con Express
Añade persistencia de proyectos
```

## Objetivo inmediato

El siguiente hito debe ser:

```txt
Editar código en Monaco y ejecutarlo en WebContainer con preview real.
```

## Actualización de avance - 13/05/2026

### Cambios realizados

- `frontend/src/utils/projectToFileSystemTree.ts` creado.
- `projectToFileSystemTree(files)` convierte rutas como `/src/main.js` en carpetas y archivos compatibles con WebContainers.
- `createRunnableFileSystemTree(files)` añade un `package.json` por defecto si el proyecto no tiene uno.
- `WebContainerRunner` recibe `files` y `runKey`.
- `App.tsx` conecta el estado real del editor con `WebContainerRunner`.
- `React.StrictMode` se ha retirado temporalmente para evitar doble boot del runtime durante el spike.
- `npm.cmd run build` funciona correctamente.

### Estado del objetivo inmediato

La conexión `Editor Monaco -> FileSystemTree -> WebContainerRunner` ya existe en código. Queda pendiente validar que `WebContainer` monta, instala, arranca y devuelve preview real de forma estable en Chrome/Edge.

### Pendiente para la siguiente persona

- Probar el flujo real en Chrome/Edge.
- Añadir botón de reset del runtime.
- Mejorar logs y estados de ejecución.
- Evitar `npm install` si no han cambiado dependencias.
- Decidir si se crea `RuntimePreview.tsx` o si se sigue evolucionando `WebContainerRunner`.
- Implementar persistencia local con snapshots en `localStorage`.

### Recomendación para no pisar trabajo en paralelo

- Si una persona trabaja en runtime, que toque principalmente `WebContainerRunner`, `projectToFileSystemTree` y componentes de preview.
- Si otra persona trabaja en persistencia local, que toque principalmente `App.tsx`, nuevos servicios de snapshot y botones de guardar/cargar.
- Si una persona empieza backend, crear carpeta `backend/` sin modificar todavía el flujo del frontend salvo que sea necesario.

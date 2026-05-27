# IDE Web Colaborativo con Asistente IA

Plataforma web con un IDE integrado que permite crear, editar, guardar, ejecutar, publicar y reutilizar proyectos web desde el navegador.

Este proyecto se desarrolla como Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web.

## Objetivo

El objetivo principal es construir una plataforma browser-native que reduzca la necesidad de configuración local para crear y compartir proyectos web.

La aplicación permitirá a los usuarios trabajar con proyectos desde una interfaz web que integra editor de código, árbol de archivos, ejecución, preview, guardado persistente y publicación de proyectos.

## Características principales

- Editor de código integrado.
- Gestión de proyectos por usuario.
- Ejecución local en navegador.
- Preview embebida.
- Terminal/logs.
- Proyectos públicos y privados.
- Galería de proyectos públicos.
- Fork/remix de proyectos.
- Asistente IA modular para ayuda al desarrollo.

## Stack previsto

### Frontend

- React
- TypeScript
- Vite
- Monaco Editor
- xterm.js
- WebContainers
- TailwindCSS

### Backend

- Node.js
- Express
- Prisma

### Base de datos

- PostgreSQL

### IA

- Integración mediante backend proxy.
- Funciones previstas:
  - Explicación de código.
  - Generación de snippets.
  - Sugerencia de tests.
  - Refactors básicos.

## Alcance del MVP

El MVP se centrará en proyectos web compatibles con tecnologías HTML, CSS, JavaScript, TypeScript y herramientas del ecosistema Node.

No se contempla inicialmente la ejecución generalista de cualquier lenguaje ni un entorno Linux persistente en servidor.

## Documentación

La documentación principal se encuentra en la carpeta `/docs`:

- `00-context.md`
- `01-specs.md`
- `02-roadmap.md`
- `03-arquitectura.md`
- `04-decisiones-tecnicas.md`
- `05-riesgos.md`
- `06-demo-tfg.md`
- `07-continuacion-ia.md`

## Estado del proyecto

Fase inicial de análisis, especificación y prototipado técnico.

Último avance: se ha iniciado la conexión entre los archivos editados en Monaco y WebContainers mediante una utilidad que transforma `ProjectFile[]` en `FileSystemTree`.

## Estado actualizado 26/05/2026

- Frontend IDE funcional con Monaco, WebContainers, preview, terminal, autosave local y gestión básica de archivos.
- Backend inicial con auth, proyectos, snapshots, endpoints públicos y fork/remix.
- Pendiente principal: conectar frontend con backend y preparar las vistas de login, proyectos, galería y proyecto público.

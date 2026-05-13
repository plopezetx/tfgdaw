# 02 - Roadmap de Desarrollo

## Resumen

Este documento define la planificación de desarrollo del proyecto. El roadmap está organizado por fases incrementales, empezando por los riesgos técnicos principales y avanzando después hacia persistencia, comunidad, IA y preparación de la defensa.

La prioridad es construir primero un núcleo funcional del IDE antes de añadir funcionalidades accesorias.

## Estado actual

Ya se ha completado una primera base documental y se ha iniciado el prototipo técnico del frontend.

### Trabajo realizado

- Creación del repositorio.
- Creación de documentación inicial.
- Configuración de frontend con Vite, React y TypeScript.
- Integración inicial de Monaco Editor.
- Creación de tipos básicos de archivo.
- Creación de archivos iniciales en memoria.
- Componente `FileExplorer`.
- Componente `CodeEditor`.
- Componente `PreviewPanel`.
- Componente `TerminalPanel`.
- Layout inicial de IDE.
- Preview simple mediante `iframe`.
- Botón de ejecución simulado.
- Instalación/preparación inicial para WebContainers.
- Configuración de cabeceras COOP/COEP en Vite.
- Creación de proyecto de prueba para WebContainers.
- Creación de componente `WebContainerRunner`.

## Fase 0 - Preparación inicial

### Estado

Completada.

### Objetivo

Preparar el repositorio, documentación y visión inicial del proyecto.

### Tareas realizadas

- Crear repositorio.
- Añadir README inicial.
- Añadir informes de investigación.
- Crear carpeta `docs`.
- Definir alcance.
- Definir stack previsto.
- Documentar riesgos iniciales.

### Entregables

- README.
- Documentación base.
- Primer commit de estructura.

## Fase 1 - Spike técnico del IDE

### Estado

En progreso.

### Objetivo

Validar que se puede construir una interfaz tipo IDE en navegador y que es posible ejecutar o previsualizar proyectos web.

### Tareas realizadas

- Crear frontend React.
- Instalar Monaco Editor.
- Crear estructura de componentes.
- Mostrar editor.
- Mostrar árbol de archivos.
- Seleccionar archivo activo.
- Editar contenido.
- Mostrar preview simple.
- Mostrar terminal/logs simulados.
- Añadir botón de ejecutar.
- Preparar configuración para WebContainers.

### Tareas pendientes

- Confirmar funcionamiento completo del componente `WebContainerRunner`.
- Conectar archivos editados en Monaco con el sistema de archivos montado en WebContainer.
- Sustituir progresivamente la preview simple por preview real del servidor ejecutado.
- Gestionar estado de ejecución: arrancando, instalando, servidor listo, error.
- Añadir botón de reinicio del entorno.
- Añadir control para no arrancar varias instancias de WebContainer.
- Mejorar logs de ejecución.

### Criterio de salida

La fase se considerará cerrada cuando:

- El usuario pueda editar archivos.
- El sistema monte esos archivos en WebContainer.
- El navegador ejecute el proyecto.
- La preview real se muestre en un iframe.
- Los logs de ejecución sean visibles.

## Fase 2 - Persistencia local y preparación de backend

### Estado

Pendiente.

### Objetivo

Antes de crear un backend completo, conviene validar cómo se serializa y recupera el estado de un proyecto.

### Tareas previstas

- Crear función para exportar el estado del proyecto.
- Crear función para importar un proyecto desde JSON.
- Guardar temporalmente en `localStorage`.
- Añadir botón Guardar local.
- Añadir botón Cargar local.
- Preparar estructura de snapshot.

### Criterio de salida

El usuario puede editar un proyecto, guardarlo localmente, recargar la página y recuperarlo.

## Fase 3 - Backend y base de datos

### Estado

Pendiente.

### Objetivo

Crear la capa de servidor necesaria para usuarios, proyectos y persistencia real.

### Stack previsto

- Node.js.
- Express.
- Prisma.
- PostgreSQL.
- JWT o sesiones.

### Tareas previstas

- Crear carpeta `backend`.
- Inicializar proyecto Node.
- Configurar TypeScript.
- Configurar Express.
- Configurar Prisma.
- Crear base de datos PostgreSQL.
- Definir modelo de datos.
- Crear endpoints de autenticación.
- Crear endpoints de proyectos.
- Crear endpoints de snapshots.
- Añadir validaciones.
- Añadir manejo de errores.

### Endpoints iniciales previstos

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `PUT /projects/:id/snapshot`
- `GET /projects/:id/snapshot`

### Criterio de salida

Un usuario puede registrarse, iniciar sesión, crear un proyecto, guardarlo y recuperarlo desde base de datos.

## Fase 4 - IDE funcional completo

### Estado

Pendiente.

### Objetivo

Convertir el prototipo inicial en una herramienta de uso continuo.

### Tareas previstas

- Mejorar árbol de archivos.
- Crear archivos.
- Crear carpetas.
- Renombrar archivos.
- Eliminar archivos.
- Añadir tabs o indicador de archivo activo.
- Añadir guardado manual.
- Añadir guardado automático opcional.
- Mejorar preview.
- Mejorar terminal/logs.
- Añadir estados visuales.
- Añadir gestión de errores.
- Añadir pantalla para navegador no compatible.

### Criterio de salida

El usuario puede trabajar con un proyecto pequeño de forma cómoda dentro del IDE.

## Fase 5 - Publicación y comunidad

### Estado

Pendiente.

### Objetivo

Añadir funcionalidades de compartición y reutilización de proyectos.

### Tareas previstas

- Añadir campo de visibilidad pública/privada.
- Crear página pública de proyecto.
- Crear galería pública.
- Crear endpoint de proyectos públicos.
- Crear fork/remix.
- Guardar relación entre proyecto original y fork.
- Diferenciar vista de propietario y vista de visitante.
- Generar URL compartible.

### Criterio de salida

Un usuario puede publicar un proyecto, otra persona puede abrirlo y crear una copia propia.

## Fase 6 - Asistente IA

### Estado

Pendiente.

### Objetivo

Añadir asistencia contextual al desarrollo.

### Funciones previstas

- Explicar código seleccionado.
- Generar snippets.
- Sugerir tests.
- Proponer refactors básicos.
- Ayudar con errores de ejecución.

### Tareas previstas

- Crear panel lateral de IA.
- Crear backend proxy para proveedor IA.
- No exponer API keys en frontend.
- Enviar contexto controlado.
- Mostrar respuesta.
- Permitir aceptar o rechazar cambios si afectan al código.
- Registrar interacciones opcionalmente.

### Criterio de salida

El usuario puede seleccionar código y recibir una explicación o sugerencia útil dentro de la plataforma.

## Fase 7 - Validación, pruebas y calidad

### Estado

Pendiente.

### Objetivo

Preparar el proyecto para una demo estable.

### Tareas previstas

- Probar flujos principales.
- Corregir errores.
- Revisar estilos.
- Comprobar compatibilidad.
- Añadir validaciones.
- Añadir mensajes de error claros.
- Revisar estructura del código.
- Añadir documentación de instalación.
- Añadir capturas para memoria.

### Criterio de salida

La demo principal puede ejecutarse sin intervención técnica adicional.

## Fase 8 - Memoria y defensa

### Estado

Pendiente.

### Objetivo

Preparar la documentación académica y la presentación final.

### Tareas previstas

- Redactar introducción.
- Redactar objetivos.
- Redactar análisis de requisitos.
- Redactar diseño técnico.
- Redactar implementación.
- Redactar pruebas.
- Redactar conclusiones.
- Preparar presentación.
- Preparar guion de demo.
- Preparar posibles preguntas del tribunal.

## Planificación estimada

| Fase | Duración estimada | Prioridad |
|---|---:|---|
| Fase 1 - Spike técnico | 1-2 semanas | Alta |
| Fase 2 - Persistencia local | 1 semana | Alta |
| Fase 3 - Backend y BD | 2 semanas | Alta |
| Fase 4 - IDE funcional | 2 semanas | Alta |
| Fase 5 - Comunidad | 1-2 semanas | Media/Alta |
| Fase 6 - IA | 1-2 semanas | Media |
| Fase 7 - Validación | 1 semana | Alta |
| Fase 8 - Memoria y defensa | Continua | Alta |

## Prioridades reales

### Prioridad 1

- Editor.
- Preview/ejecución.
- Guardado.
- Recuperación.

### Prioridad 2

- Login.
- Proyectos por usuario.
- Publicación.
- Fork.

### Prioridad 3

- IA.
- Mejoras visuales.
- Funciones avanzadas.

## Riesgo principal

El riesgo técnico principal es la integración completa de WebContainers con el estado real del editor. Por eso esta parte debe resolverse antes de avanzar demasiado con backend o comunidad.

## Próximo paso inmediato

El siguiente paso técnico es unir el editor Monaco con WebContainers:

1. Transformar el array de archivos del editor en un `FileSystemTree`.
2. Montar ese árbol en WebContainer.
3. Ejecutar el proyecto.
4. Mostrar la URL devuelta por `server-ready`.
5. Refrescar la preview al cambiar archivos o pulsar ejecutar.

## Actualización de avance - 13/05/2026

### Trabajo realizado en esta iteración

- Se ha creado `frontend/src/utils/projectToFileSystemTree.ts`.
- Se ha implementado la conversión de `ProjectFile[]` a `FileSystemTree`.
- Se ha añadido una función `createRunnableFileSystemTree` que inyecta un `package.json` básico si el proyecto no lo incluye.
- `WebContainerRunner` ahora recibe los archivos reales del editor mediante props.
- `App.tsx` pasa `files` y `refreshKey` a `WebContainerRunner`.
- Se ha desactivado temporalmente `React.StrictMode` para evitar dobles arranques durante el spike de WebContainers.
- Se ha verificado que el frontend compila correctamente con `npm.cmd run build`.

### Estado actual de la Fase 1

La conexión de datos entre Monaco y WebContainers ya está iniciada a nivel de código. Falta validarla en navegador compatible y estabilizar el ciclo de ejecución.

### Tareas pendientes de Fase 1

- Probar en Chrome/Edge que los archivos editados se montan correctamente en WebContainer.
- Confirmar que `npm install` y `npm run start` funcionan con el snapshot generado desde el editor.
- Mostrar y refrescar correctamente la URL devuelta por `server-ready`.
- Añadir botón de reset del runtime.
- Evitar reinstalar dependencias en cada ejecución si no cambia `package.json`.
- Revisar comportamiento al crear, renombrar o eliminar archivos.
- Decidir cuándo sustituir la preview simple por la preview real.

### Reparto recomendado para 4 semanas

#### Semana 1

- Persona A: estabilizar WebContainers con los archivos reales del editor.
- Persona B: implementar persistencia local con snapshot JSON y `localStorage`.

#### Semana 2

- Persona A: mejorar el IDE básico: crear, renombrar y eliminar archivos.
- Persona B: preparar backend Express + TypeScript + estructura inicial de API.

#### Semana 3

- Persona A: conectar frontend con guardado/recuperación real.
- Persona B: configurar Prisma, PostgreSQL y modelos de usuario/proyecto/snapshot.

#### Semana 4

- Persona A: implementar publicación básica y vista pública.
- Persona B: implementar fork/remix y preparar demo final con checklist.

La IA queda como tarea de cierre si el flujo principal ya está estable. Como mínimo, conviene dejar un panel o endpoint preparado y documentar el resto como ampliación.

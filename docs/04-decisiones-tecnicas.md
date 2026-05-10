
---

## `docs/04-decisiones-tecnicas.md`

```md
# 04 - Decisiones Técnicas

## Decisión 1 - Usar React

### Motivo

React permite construir una interfaz modular y dinámica. Además, es adecuado para construir un IDE web con paneles, editor, terminal y preview.

### Alternativas consideradas

- Angular
- Vue
- Svelte

### Decisión

Se utilizará React con TypeScript.

## Decisión 2 - Usar Monaco Editor

### Motivo

Monaco Editor proporciona una experiencia avanzada de edición de código en navegador y es la base del editor de VS Code.

### Alternativas consideradas

- CodeMirror
- Ace Editor

### Decisión

Se utilizará Monaco Editor para el editor principal.

## Decisión 3 - Usar WebContainers para ejecución

### Motivo

WebContainers permite ejecutar proyectos Node/web directamente en el navegador, reduciendo la necesidad de ejecutar código de usuarios en el backend.

### Alternativas consideradas

- Docker server-side
- Judge0
- Runners propios
- Pyodide para Python

### Decisión

El MVP utilizará WebContainers y limitará el soporte principal a proyectos web.

## Decisión 4 - Usar PostgreSQL

### Motivo

El dominio del proyecto es relacional: usuarios, proyectos, snapshots, forks, publicaciones y permisos.

### Alternativas consideradas

- MongoDB
- SQLite
- MySQL

### Decisión

Se utilizará PostgreSQL con Prisma.

## Decisión 5 - Backend ligero

### Motivo

La ejecución ocurre principalmente en el navegador. El backend no necesita ejecutar proyectos, sino gestionar usuarios, persistencia, comunidad e IA.

### Decisión

Se utilizará Node.js con Express.

## Decisión 6 - IA como módulo opcional

### Motivo

La IA aporta valor, pero no debe bloquear el MVP principal. Se integrará como una capa desacoplada.

### Decisión

Primero se implementarán funciones simples: explicación de código, generación de snippets y sugerencia de tests.
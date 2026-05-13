# 04 - Decisiones Técnicas

## Introducción

Este documento registra las decisiones técnicas principales del proyecto, sus motivos, alternativas consideradas y consecuencias. El objetivo es mantener trazabilidad y poder justificar la arquitectura durante el desarrollo y la defensa del TFG.

## Decisión 1 - Usar React

### Estado

Aceptada.

### Contexto

El proyecto requiere una interfaz dinámica con paneles, editor, preview, árbol de archivos, terminal/logs y posiblemente panel IA.

### Alternativas consideradas

- Angular.
- Vue.
- Svelte.
- React.

### Decisión

Se utilizará **React**.

### Motivos

- Ecosistema amplio.
- Buena integración con Vite.
- Gran disponibilidad de componentes y librerías.
- Experiencia previa de desarrollo.
- Adecuado para interfaces tipo dashboard/IDE.
- Buena integración con Monaco Editor.

### Consecuencias

- La aplicación se organizará en componentes.
- Será necesario gestionar correctamente el estado del proyecto.
- Se utilizará TypeScript para mejorar la mantenibilidad.

## Decisión 2 - Usar TypeScript

### Estado

Aceptada.

### Contexto

El proyecto manejará estructuras de datos de archivos, proyectos, usuarios, snapshots y respuestas de backend.

### Alternativas consideradas

- JavaScript.
- TypeScript.

### Decisión

Se utilizará **TypeScript**.

### Motivos

- Mayor seguridad en el tipado.
- Mejor autocompletado.
- Menos errores en estructuras complejas.
- Mejor documentación implícita del código.

### Consecuencias

- Se definirán tipos para archivos, proyectos, usuarios y snapshots.
- Será necesario mantener los tipos actualizados.

## Decisión 3 - Usar Vite

### Estado

Aceptada.

### Contexto

El frontend necesita un entorno rápido de desarrollo para React.

### Alternativas consideradas

- Create React App.
- Next.js.
- Vite.

### Decisión

Se utilizará **Vite**.

### Motivos

- Arranque rápido.
- Configuración sencilla.
- Buena compatibilidad con React y TypeScript.
- Adecuado para SPA.
- Permite configurar headers necesarios para WebContainers.

### Consecuencias

- La aplicación será inicialmente una SPA.
- Para despliegue se necesitará configurar correctamente cabeceras COOP/COEP.

## Decisión 4 - Usar Monaco Editor

### Estado

Aceptada.

### Contexto

El núcleo del proyecto es un editor de código web. Se necesita un editor avanzado, con resaltado de sintaxis y experiencia cercana a un IDE.

### Alternativas consideradas

- CodeMirror.
- Ace Editor.
- Monaco Editor.

### Decisión

Se utilizará **Monaco Editor**.

### Motivos

- Experiencia similar a VS Code.
- Buen soporte para múltiples lenguajes.
- Integración disponible para React.
- APIs avanzadas para futuras funciones IA, completado o refactor.

### Consecuencias

- El proyecto tendrá una experiencia de edición profesional.
- No se debe presentar como VS Code completo, ya que Monaco no incluye todas sus capacidades.

## Decisión 5 - Usar WebContainers para ejecución

### Estado

Aceptada para el MVP.

### Contexto

El sistema necesita ejecutar o previsualizar proyectos web. Ejecutar código de usuarios en servidor añade complejidad y riesgos de seguridad.

### Alternativas consideradas

- Docker en servidor.
- Runners propios.
- Judge0.
- WebContainers.
- Preview simple con iframe.

### Decisión

Se utilizarán **WebContainers** como opción principal de ejecución para proyectos compatibles.

### Motivos

- Permite ejecutar proyectos Node/web en navegador.
- Reduce riesgos de ejecutar código no confiable en servidor.
- Encaja con el alcance del MVP.
- Permite integrar preview de proyectos web.
- Reduce costes de infraestructura.

### Consecuencias

- El MVP queda orientado a proyectos web/Node.
- Será necesario configurar COOP/COEP.
- La compatibilidad se orientará principalmente a navegadores modernos.
- No todos los paquetes npm serán compatibles.

## Decisión 6 - Usar preview simple como paso intermedio

### Estado

Aceptada.

### Contexto

Antes de integrar ejecución real, era necesario validar rápidamente la experiencia de edición y preview.

### Decisión

Se ha implementado una preview inicial con `iframe` y `srcDoc`.

### Motivos

- Permite validar el layout.
- Permite comprobar la edición en Monaco.
- Facilita una demo temprana.
- Reduce riesgo inicial.

### Consecuencias

- Esta preview no sustituye la ejecución real.
- Más adelante se conectará el editor con WebContainers.

## Decisión 7 - Backend ligero

### Estado

Prevista.

### Contexto

La ejecución principal se realizará en navegador. El backend no necesita ejecutar proyectos en el MVP.

### Alternativas consideradas

- Backend monolítico con ejecución.
- Backend ligero.
- Serverless.
- Sin backend inicial.

### Decisión

Se utilizará un **backend ligero con Node.js y Express**.

### Motivos

- Suficiente para auth, proyectos, snapshots y publicación.
- Fácil integración con Prisma y PostgreSQL.
- Control claro de rutas.
- Compatible con proxy IA.

### Consecuencias

- La lógica pesada del IDE seguirá en frontend.
- El backend se centrará en persistencia y seguridad.

## Decisión 8 - Usar PostgreSQL

### Estado

Prevista.

### Contexto

El proyecto maneja entidades relacionales: usuarios, proyectos, snapshots, publicaciones y forks.

### Alternativas consideradas

- MongoDB.
- SQLite.
- MySQL.
- PostgreSQL.

### Decisión

Se utilizará **PostgreSQL**.

### Motivos

- Modelo relacional sólido.
- Buen soporte con Prisma.
- Escalable para permisos y relaciones.
- Adecuado para proyectos, usuarios y forks.
- Posibilidad futura de usar extensiones como pgvector.

### Consecuencias

- Será necesario definir migraciones.
- Se usará Prisma como ORM para simplificar el acceso.

## Decisión 9 - Guardar snapshots como JSON

### Estado

Prevista para el MVP.

### Contexto

Persistir cada archivo en una tabla separada aumenta la complejidad inicial.

### Alternativas consideradas

- Tabla por archivo.
- Almacenamiento en sistema de ficheros.
- Snapshot JSON.
- ZIP serializado.

### Decisión

Se guardará el estado del proyecto como **snapshot JSON**.

### Motivos

- Simplicidad.
- Encaja con el estado actual del frontend.
- Fácil de guardar y recuperar.
- Suficiente para proyectos pequeños o medianos.

### Consecuencias

- Las operaciones sobre archivos individuales en base de datos serán limitadas.
- Puede optimizarse en versiones futuras.

## Decisión 10 - IA como módulo desacoplado

### Estado

Prevista.

### Contexto

La IA aporta valor, pero no debe bloquear el MVP.

### Alternativas consideradas

- No incluir IA.
- Integrar IA directamente en frontend.
- Integrar IA mediante backend proxy.
- IA local en navegador.

### Decisión

Se implementará, si el calendario lo permite, una capa IA mediante backend proxy.

### Motivos

- Evita exponer API keys.
- Permite cambiar de proveedor.
- Mantiene la IA desacoplada del núcleo del IDE.
- Permite limitar costes.

### Consecuencias

- Será necesario crear endpoints específicos.
- Las acciones IA deberán ser manuales y controladas.

## Decisión 11 - Colaboración como publicación y fork

### Estado

Aceptada para el MVP.

### Contexto

La palabra colaborativo puede implicar coedición en tiempo real, pero esta funcionalidad añade mucha complejidad.

### Alternativas consideradas

- Coedición completa en tiempo real.
- Comentarios.
- Compartición pública.
- Fork/remix.

### Decisión

En el MVP, la colaboración se definirá como:

- Publicar proyectos.
- Explorar proyectos públicos.
- Compartir enlaces.
- Crear fork/remix.

### Motivos

- Alcance realista.
- Aporta valor real.
- Evita complejidad de sincronización.
- Permite ampliar a tiempo real más adelante.

### Consecuencias

- La coedición queda como mejora futura.
- El término colaborativo debe explicarse correctamente en la memoria.

## Decisión 12 - Desarrollo incremental

### Estado

Aceptada.

### Contexto

El proyecto tiene varias áreas complejas: editor, ejecución, backend, comunidad e IA.

### Decisión

Se desarrollará por fases, validando primero los riesgos técnicos.

### Motivos

- Reduce riesgo.
- Facilita seguimiento.
- Permite tener siempre una demo parcial.
- Evita construir funcionalidades sobre una base no validada.

### Consecuencias

- El orden de desarrollo prioriza WebContainers antes que backend completo.
- La documentación se actualizará a medida que avance el proyecto.

## Decisión 13 - Desactivar temporalmente React StrictMode durante el spike de WebContainers

### Estado

Aceptada temporalmente.

### Contexto

WebContainers solo permite una instancia activa por pestaña. Durante el desarrollo, `React.StrictMode` puede montar componentes dos veces y provocar errores de doble arranque del runtime.

### Decisión

Se retira temporalmente `React.StrictMode` en `main.tsx` mientras se estabiliza la integración de WebContainers.

### Consecuencias

- Se reduce el riesgo de doble boot durante el spike.
- Esta decisión debe revisarse cuando el runtime tenga un ciclo de vida más robusto.
- La validación final debe seguir comprobando errores de React y TypeScript mediante build, lint y pruebas manuales.

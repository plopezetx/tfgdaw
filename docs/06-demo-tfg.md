# 06 - Guion de Demo del TFG

## Objetivo

Este documento define el guion previsto para demostrar el funcionamiento del proyecto durante una revisión o defensa.

La demo debe mostrar de forma clara el flujo principal de usuario: crear, editar, ejecutar, guardar, publicar y reutilizar un proyecto web.

## Estado actual de la demo

Actualmente ya se puede mostrar una primera demo técnica local con:

- Interfaz tipo IDE.
- Árbol de archivos básico.
- Editor Monaco.
- Preview simple.
- Panel de logs.
- Botón de ejecución simulado.
- Prueba inicial de WebContainers.
- Conversión de los archivos del editor a `FileSystemTree`.
- Paso de los archivos editados al componente `WebContainerRunner`.

Esta demo todavía no representa el MVP completo, pero sirve para validar la dirección técnica del proyecto.

## Demo técnica actual

### 1. Abrir aplicación

Abrir el frontend en local mediante:

```bash
npm run dev
```

Este comando puede ejecutarse desde la raíz del repositorio:

```txt
C:\Users\pablo\Desktop\tfgdaw\tfgdaw
```

El `package.json` raíz delega automáticamente en la carpeta `frontend`.

Acceder a la URL generada por Vite, normalmente:

```txt
http://localhost:5173/
```

### 2. Mostrar layout del IDE

Explicar las secciones principales:

- Panel izquierdo: archivos.
- Panel central: editor.
- Panel derecho superior: preview.
- Panel derecho inferior: logs.
- Barra superior: acción de ejecutar.

### 3. Editar archivo HTML

Abrir `index.html` y modificar el texto del título o del párrafo.

Resultado esperado:

- El cambio se refleja en la preview.

### 4. Editar archivo JavaScript

Abrir `main.js` y modificar el texto del botón.

Resultado esperado:

- La preview muestra el cambio.
- Al pulsar el botón se ejecuta la interacción.

### 5. Ejecutar proyecto

Pulsar el botón `Ejecutar`.

Resultado esperado:

- La preview se refresca.
- Se añaden logs al terminal.

### 6. Mostrar prueba de WebContainers

Bajar a la sección `WebContainer real`.

Resultado esperado:

- Se muestran logs de arranque.
- Se intenta montar y ejecutar un proyecto de prueba.
- Si el servidor arranca correctamente, aparece una preview real.

## Demo objetivo para el MVP

La demo final debe ser más completa y seguir este flujo.

## Flujo principal de demo final

### Paso 1 - Inicio

- Abrir la aplicación desplegada o local.
- Mostrar pantalla inicial.
- Iniciar sesión con usuario de prueba.

### Paso 2 - Dashboard

- Mostrar lista de proyectos del usuario.
- Crear un nuevo proyecto.

### Paso 3 - Crear proyecto

- Seleccionar plantilla inicial.
- Asignar nombre al proyecto.
- Abrir el IDE.

### Paso 4 - Editar proyecto

- Mostrar árbol de archivos.
- Abrir archivo principal.
- Modificar contenido.
- Crear o modificar otro archivo.

### Paso 5 - Ejecutar proyecto

- Pulsar `Run` o `Ejecutar`.
- Mostrar logs.
- Mostrar preview real.
- Interactuar con la aplicación ejecutada.

### Paso 6 - Guardar

- Guardar proyecto.
- Recargar la página o cerrar sesión.
- Volver a abrir el proyecto.
- Comprobar que los cambios se mantienen.

### Paso 7 - Publicar

- Cambiar visibilidad del proyecto a público.
- Obtener URL pública.
- Abrir URL pública en otra pestaña.

### Paso 8 - Consultar como visitante

- Mostrar página pública.
- Ver código o preview.
- Explicar que el proyecto puede compartirse.

### Paso 9 - Fork/remix

- Iniciar sesión como otro usuario o simular visitante autenticado.
- Crear fork/remix.
- Abrir copia propia.
- Modificar la copia.
- Comprobar que el original no cambia.

### Paso 10 - Asistente IA

- Seleccionar una función o bloque de código.
- Pedir explicación.
- Mostrar respuesta en panel IA.
- Pedir sugerencia o snippet.
- Aplicar o copiar resultado.

## Mensaje técnico durante la demo

Durante la demo conviene explicar:

- El editor se basa en Monaco.
- La ejecución se realiza en navegador cuando el proyecto es compatible.
- El backend no ejecuta código de usuarios en el MVP.
- Los proyectos se guardan como snapshots.
- La colaboración inicial se basa en publicación y fork.
- La IA es modular y se integra mediante backend proxy.

## Posibles preguntas y respuestas

### ¿Por qué no se ejecutan todos los lenguajes?

Porque el MVP se centra en proyectos web. Ejecutar cualquier lenguaje requiere infraestructura de sandboxing mucho más compleja y queda fuera del alcance inicial.

### ¿Por qué WebContainers?

Porque permite ejecutar proyectos Node/web en el navegador, reduciendo riesgos y costes asociados a ejecutar código de usuarios en servidores propios.

### ¿Qué significa colaborativo?

En el MVP, colaborativo significa que los usuarios pueden publicar proyectos, compartirlos, explorarlos y crear forks/remix. La coedición en tiempo real se plantea como ampliación futura.

### ¿Por qué no usar Docker directamente?

Docker server-side para código de usuarios requiere medidas de seguridad avanzadas. Para un MVP académico es más razonable priorizar ejecución local en navegador.

### ¿Qué aporta la IA?

La IA ayuda a explicar código, generar snippets, sugerir tests y proponer mejoras. No sustituye al usuario, sino que actúa como asistente contextual.

### ¿Qué limitaciones tiene el proyecto?

- Orientado a escritorio.
- Compatibilidad principal con navegadores modernos.
- Soporte inicial limitado a proyectos web.
- Coedición en tiempo real no incluida en MVP.
- Algunas dependencias npm pueden no funcionar en WebContainers.

## Checklist de demo final

- [ ] El frontend arranca correctamente.
- [ ] El backend está disponible.
- [ ] La base de datos está conectada.
- [ ] Hay usuario de prueba.
- [ ] Hay proyecto de prueba.
- [ ] Crear proyecto funciona.
- [ ] Editar archivo funciona.
- [ ] Ejecutar funciona.
- [ ] Guardar funciona.
- [ ] Recuperar funciona.
- [ ] Publicar funciona.
- [ ] Página pública funciona.
- [ ] Fork/remix funciona.
- [ ] IA funciona o está claramente documentada como ampliación.
- [ ] Hay plan B local si falla el despliegue.

## Guion corto para defensa

1. Presentación del problema.
2. Objetivo de la plataforma.
3. Arquitectura general.
4. Demo de creación y edición.
5. Demo de ejecución y preview.
6. Demo de guardado.
7. Demo de publicación y fork.
8. Demo de IA.
9. Limitaciones.
10. Trabajo futuro.
11. Conclusiones.

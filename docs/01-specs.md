# 01 - Especificación del Proyecto

## Estado

Borrador actualizado tras el primer prototipo técnico.

## Resumen

El sistema será una plataforma web que permitirá a una persona usuaria crear, editar, ejecutar, guardar, publicar y reutilizar proyectos web desde el navegador.

La plataforma estará orientada inicialmente a escritorio y a proyectos compatibles con tecnologías web. La colaboración se abordará en el MVP mediante publicación, exploración pública y fork/remix de proyectos. La coedición en tiempo real se considera una posible mejora futura, no una condición obligatoria del MVP.

## Objetivos principales

- Permitir crear proyectos desde plantillas.
- Permitir editar archivos desde un editor web avanzado.
- Permitir visualizar o ejecutar proyectos desde la propia plataforma.
- Permitir guardar y recuperar proyectos.
- Permitir publicar proyectos como públicos o privados.
- Permitir explorar proyectos públicos.
- Permitir crear forks/remix de proyectos existentes.
- Incorporar asistencia IA básica para tareas de ayuda al desarrollo.
- Mantener un alcance realista para un TFG individual.

## Objetivos secundarios

- Diseñar una arquitectura escalable.
- Documentar las decisiones técnicas principales.
- Validar la viabilidad de ejecución local en navegador.
- Evitar dependencias iniciales de infraestructura compleja.
- Preparar una demo estable para la defensa del proyecto.

## No objetivos del MVP

No forman parte del MVP:

- IDE universal para todos los lenguajes.
- Ejecución de código no confiable en servidores propios.
- Shell Linux persistente por usuario.
- Marketplace de extensiones.
- Coedición completa en tiempo real.
- Compatibilidad móvil completa.
- Integración directa con repositorios Git remotos.

## Usuarios objetivo

### Usuario estudiante

Quiere practicar desarrollo web, crear pequeños proyectos y visualizar resultados sin instalar herramientas adicionales.

### Usuario desarrollador junior

Quiere prototipar una idea o ejemplo de forma rápida y compartirlo con otras personas.

### Usuario visitante

Quiere navegar por proyectos públicos, ver su código, ejecutarlos y reutilizarlos.

### Usuario docente

Quiere preparar plantillas o ejemplos de código reutilizables para estudiantes.

## Requisitos funcionales

### RF-001 - Registro de usuario

El sistema debe permitir que una persona cree una cuenta.

### RF-002 - Inicio y cierre de sesión

El sistema debe permitir iniciar sesión y cerrar sesión.

### RF-003 - Creación de proyectos

El sistema debe permitir crear un proyecto nuevo desde una plantilla inicial.

### RF-004 - Listado de proyectos propios

El sistema debe mostrar los proyectos asociados a la persona usuaria autenticada.

### RF-005 - Edición multiarchivo

El sistema debe permitir abrir y editar varios archivos de un proyecto.

### RF-006 - Árbol de archivos

El sistema debe mostrar una estructura de archivos navegable.

### RF-007 - Preview integrada

El sistema debe mostrar una preview del proyecto cuando sea posible.

### RF-008 - Ejecución local en navegador

El sistema debe permitir ejecutar proyectos compatibles dentro del entorno del navegador.

### RF-009 - Terminal o panel de logs

El sistema debe mostrar información de ejecución, errores o mensajes relevantes.

### RF-010 - Guardado persistente

El sistema debe guardar el estado del proyecto para poder recuperarlo posteriormente.

### RF-011 - Recuperación de proyectos

El sistema debe permitir abrir un proyecto guardado y continuar trabajando con él.

### RF-012 - Visibilidad pública/privada

El sistema debe permitir definir si un proyecto es privado o público.

### RF-013 - Página pública de proyecto

El sistema debe generar una vista pública para proyectos publicados.

### RF-014 - Galería pública

El sistema debe permitir consultar proyectos públicos.

### RF-015 - Fork/remix

El sistema debe permitir crear una copia propia a partir de un proyecto público.

### RF-016 - Asistente IA

El sistema podrá incorporar un asistente IA para:

- Explicar código seleccionado.
- Generar fragmentos de código.
- Sugerir pruebas.
- Proponer refactors básicos.
- Ayudar a entender errores.

### RF-017 - Control de disponibilidad de IA

El sistema debe gestionar de forma clara los casos en los que el asistente IA no esté disponible.

### RF-018 - Detección de compatibilidad

El sistema debe informar si el navegador no soporta la experiencia completa.

## Requisitos no funcionales

### RNF-001 - Aplicación desktop-first

La interfaz se diseñará principalmente para escritorio.

### RNF-002 - Compatibilidad controlada

La experiencia completa se orientará inicialmente a navegadores Chromium modernos.

### RNF-003 - Seguridad de ejecución

La ejecución del MVP no debe depender de ejecutar código no confiable en el backend principal.

### RNF-004 - Persistencia fiable

Los proyectos guardados deben recuperarse sin pérdida de estructura ni contenido.

### RNF-005 - Usabilidad

La interfaz debe separar claramente:

- Árbol de archivos.
- Editor.
- Preview.
- Terminal/logs.
- Acciones principales.
- Panel IA, si se implementa.

### RNF-006 - Rendimiento aceptable

La apertura y edición de proyectos pequeños o medianos debe ser fluida.

### RNF-007 - Coste controlado de IA

Las funciones IA deben usarse bajo acciones explícitas del usuario y no en cada pulsación.

### RNF-008 - Mantenibilidad

El código debe organizarse por componentes, servicios, tipos y módulos claros.

### RNF-009 - Documentación

El proyecto debe mantener documentación actualizada de arquitectura, decisiones, riesgos y roadmap.

## Estado funcional actual

Actualmente ya existe un primer prototipo del frontend con:

- Proyecto Vite + React + TypeScript.
- Editor Monaco integrado.
- Estructura de archivos inicial en memoria.
- Selección de archivo activo.
- Edición de contenido en el editor.
- Preview simple mediante `iframe`.
- Terminal/logs simulados.
- Botón de ejecución que refresca la preview.
- Preparación de configuración para WebContainers.
- Componente de prueba para ejecución real con WebContainers.
- Conversión de archivos del editor a `FileSystemTree`.
- Paso inicial de archivos reales del editor a `WebContainerRunner`.

## Criterios de aceptación del MVP

El MVP se considerará completo cuando se cumplan estos escenarios.

### Escenario 1 - Crear, editar y ejecutar

1. El usuario inicia sesión.
2. Crea un proyecto desde una plantilla.
3. Modifica un archivo.
4. Ejecuta el proyecto.
5. Observa una preview o salida válida.
6. Guarda el proyecto.
7. Cierra y vuelve a abrir el proyecto.
8. Comprueba que los cambios se mantienen.

### Escenario 2 - Publicar y consultar

1. El usuario marca un proyecto como público.
2. El sistema genera una página pública.
3. Un visitante abre esa página.
4. El visitante puede consultar el proyecto.
5. Si está autenticado, puede crear un fork.

### Escenario 3 - Fork/remix

1. Un usuario abre un proyecto público.
2. Pulsa fork/remix.
3. El sistema crea una copia independiente.
4. El usuario puede editar su copia sin modificar el original.

### Escenario 4 - Asistente IA

1. El usuario selecciona código.
2. Solicita una explicación o sugerencia.
3. El sistema devuelve una respuesta contextual.
4. Si la respuesta modifica código, el usuario puede revisarla antes de aplicarla.

### Escenario 5 - Navegador no compatible

1. El usuario abre la aplicación en un navegador no compatible.
2. El sistema detecta la limitación.
3. Se muestra un mensaje claro.
4. La interfaz no queda rota ni bloqueada silenciosamente.

## Criterio de cierre del TFG

El TFG podrá considerarse cerrado si se entrega una versión estable que permita:

- Autenticarse.
- Crear un proyecto.
- Editar archivos.
- Ejecutar o previsualizar el proyecto.
- Guardar y recuperar cambios.
- Publicar un proyecto.
- Abrir un proyecto público.
- Crear un fork/remix.
- Mostrar al menos una funcionalidad de IA o dejarla documentada como ampliación si el tiempo no permite integrarla.

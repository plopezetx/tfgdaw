# 02 - Roadmap de Desarrollo

## Resumen

Este roadmap organiza el desarrollo del TFG en fases incrementales. La prioridad inicial es validar el riesgo técnico principal: el editor web con ejecución integrada en navegador.

## Fase 0 - Preparación del proyecto

### Objetivo

Preparar el repositorio, documentación inicial y decisiones base.

### Tareas

- Crear estructura del repositorio.
- Crear carpeta de documentación.
- Definir alcance del MVP.
- Definir stack técnico inicial.
- Crear documentación inicial.

### Entregables

- README actualizado.
- Documentación base en `/docs`.
- Roadmap inicial.

## Fase 1 - Spike técnico del IDE

### Objetivo

Comprobar que es posible editar y ejecutar un proyecto desde el navegador.

### Tareas

- Crear frontend React.
- Integrar Monaco Editor.
- Crear árbol de archivos en memoria.
- Crear plantilla básica.
- Integrar WebContainers.
- Ejecutar proyecto web.
- Mostrar preview.
- Mostrar logs básicos.

### Criterio de salida

Debe existir una demo donde se pueda editar un archivo, ejecutar el proyecto y ver una preview.

## Fase 2 - Backend y persistencia

### Objetivo

Permitir guardar y recuperar proyectos.

### Tareas

- Crear backend Node.js/Express.
- Configurar PostgreSQL.
- Configurar Prisma.
- Crear autenticación.
- Crear endpoints de proyectos.
- Guardar snapshots.
- Recuperar snapshots.

### Criterio de salida

Un usuario puede crear, guardar y recuperar un proyecto.

## Fase 3 - IDE funcional

### Objetivo

Convertir el prototipo en una interfaz usable.

### Tareas

- Mejorar layout.
- Añadir árbol de archivos real.
- Añadir botones Run, Save y Reset.
- Añadir terminal/logs.
- Añadir preview estable.
- Gestionar errores.
- Detectar navegador incompatible.

### Criterio de salida

El núcleo del IDE es usable de principio a fin.

## Fase 4 - Publicación y comunidad

### Objetivo

Añadir la parte colaborativa basada en compartir y reutilizar proyectos.

### Tareas

- Marcar proyectos como públicos o privados.
- Crear página pública de proyecto.
- Crear galería pública.
- Crear funcionalidad fork/remix.
- Crear URLs compartibles.

### Criterio de salida

Un visitante puede abrir un proyecto público y crear una copia propia.

## Fase 5 - Asistente IA

### Objetivo

Añadir funcionalidades de asistencia al desarrollo.

### Tareas

- Crear panel IA.
- Explicar código seleccionado.
- Generar snippets.
- Sugerir tests.
- Proponer refactors básicos con revisión.
- Registrar interacciones IA si procede.

### Criterio de salida

El usuario puede recibir ayuda IA contextual dentro del IDE.

## Fase 6 - Validación y cierre

### Objetivo

Preparar el proyecto para defensa.

### Tareas

- Probar flujos principales.
- Corregir errores.
- Documentar arquitectura.
- Documentar limitaciones.
- Preparar demo.
- Preparar memoria.
- Preparar presentación.

### Criterio de salida

Existe una demo completa y estable del MVP.
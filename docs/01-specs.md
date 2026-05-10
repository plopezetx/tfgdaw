# 01 - Especificación del Proyecto

## Estado

Borrador v1

## Resumen

El sistema será una plataforma web que permita a una persona usuaria crear, editar, guardar, ejecutar, publicar y reutilizar proyectos web desde el navegador.

El producto estará orientado a escritorio y priorizará proyectos compatibles con tecnologías web. La colaboración se entenderá inicialmente como publicación, exploración, compartición y fork/remix de proyectos.

## Objetivos principales

- Permitir crear proyectos desde plantillas.
- Permitir editar archivos desde un editor web avanzado.
- Permitir ejecutar proyectos desde la propia plataforma.
- Permitir guardar y recuperar proyectos.
- Permitir publicar proyectos como públicos o privados.
- Permitir explorar proyectos públicos.
- Permitir crear forks/remix de proyectos existentes.
- Incorporar asistencia IA básica para mejorar la experiencia de desarrollo.

## Usuarios objetivo

### Estudiante

Persona que está aprendiendo desarrollo web y quiere crear proyectos sin configurar un entorno local complejo.

### Desarrollador junior

Persona que quiere prototipar ideas web rápidamente y compartirlas.

### Visitante

Persona que quiere explorar proyectos públicos, ejecutarlos y reutilizarlos como base.

## Requisitos funcionales

### RF-001 - Registro e inicio de sesión

El sistema debe permitir que una persona usuaria cree una cuenta, inicie sesión y cierre sesión.

### RF-002 - Creación de proyectos

El sistema debe permitir crear un proyecto desde una plantilla inicial.

### RF-003 - Editor multiarchivo

El sistema debe permitir visualizar, crear, editar, renombrar y eliminar archivos dentro de un proyecto.

### RF-004 - Guardado persistente

El sistema debe permitir guardar el estado del proyecto y recuperarlo posteriormente.

### RF-005 - Ejecución integrada

El sistema debe permitir ejecutar el proyecto desde la interfaz web.

### RF-006 - Vista previa

El sistema debe mostrar una preview embebida cuando el proyecto genere una interfaz web.

### RF-007 - Terminal o logs

El sistema debe mostrar información de ejecución, logs o errores.

### RF-008 - Visibilidad del proyecto

El sistema debe permitir marcar proyectos como públicos o privados.

### RF-009 - Página pública de proyecto

El sistema debe generar una vista pública para los proyectos publicados.

### RF-010 - Galería pública

El sistema debe mostrar una lista de proyectos públicos.

### RF-011 - Fork o remix

El sistema debe permitir crear una copia propia de un proyecto público.

### RF-012 - Asistente IA

El sistema puede incluir un asistente IA para explicar código, generar snippets, sugerir tests y proponer refactors básicos.

## Requisitos no funcionales

### RNF-001 - Desktop-first

La aplicación estará optimizada para escritorio.

### RNF-002 - Compatibilidad controlada

La experiencia completa estará orientada principalmente a navegadores Chromium compatibles.

### RNF-003 - Seguridad

La ejecución de proyectos del MVP no debe depender de ejecutar código no confiable en el backend principal.

### RNF-004 - Persistencia fiable

Los proyectos guardados deben poder recuperarse sin pérdida de estructura.

### RNF-005 - Usabilidad

La interfaz debe separar claramente editor, árbol de archivos, terminal, preview y panel de acciones.

### RNF-006 - Coste controlado de IA

Las funciones IA deben estar limitadas para evitar consumos innecesarios.

## Criterios de aceptación

- Un usuario puede registrarse e iniciar sesión.
- Un usuario puede crear un proyecto desde plantilla.
- Un usuario puede editar varios archivos.
- Un usuario puede ejecutar el proyecto y ver el resultado.
- Un usuario puede guardar el proyecto y recuperarlo después.
- Un usuario puede publicar un proyecto.
- Un visitante puede abrir un proyecto público.
- Un visitante autenticado puede crear un fork.
- El sistema informa correctamente si el navegador no es compatible.
# 00 - Contexto del Proyecto

## Nombre del proyecto

**IDE Web Colaborativo con Asistente IA**

## Descripción general

El proyecto consiste en el desarrollo de una plataforma web con un IDE integrado que permita crear, editar, ejecutar, guardar, publicar y reutilizar proyectos web desde el navegador.

La aplicación está orientada inicialmente a proyectos de desarrollo web basados en HTML, CSS, JavaScript, TypeScript y herramientas del ecosistema Node. El objetivo principal es reducir la fricción habitual de configuración local, permitiendo que una persona pueda empezar a programar y visualizar el resultado de su proyecto desde una única interfaz web.

La plataforma integrará progresivamente funcionalidades de editor avanzado, árbol de archivos, preview, terminal/logs, persistencia de proyectos, publicación pública, fork/remix y asistencia IA modular para tareas de ayuda al desarrollo.

## Motivación

En el aprendizaje y prototipado de aplicaciones web suele existir una barrera inicial importante: instalación de Node.js, configuración de proyectos, elección de editor, ejecución local, dependencias y despliegue para compartir resultados.

Este proyecto busca centralizar las acciones principales en una herramienta web:

- Crear un proyecto desde una plantilla.
- Editar código en un editor avanzado.
- Ejecutar o previsualizar el resultado.
- Guardar el trabajo en una cuenta.
- Compartir proyectos públicamente.
- Reutilizar proyectos mediante fork/remix.
- Recibir ayuda contextual mediante un asistente IA.

## Problema que se quiere resolver

El problema principal es la dispersión de herramientas en el flujo de desarrollo inicial. Para una persona estudiante o desarrolladora junior, crear un proyecto web puede implicar varias herramientas separadas:

- Editor local.
- Terminal.
- Gestor de paquetes.
- Navegador.
- Repositorio.
- Sistema de despliegue.
- Herramientas de consulta o ayuda.

La aplicación propuesta pretende ofrecer una experiencia integrada para proyectos web de tamaño pequeño o medio, especialmente útil en contextos educativos, prototipado rápido y compartición de ejemplos.

## Alcance general

El alcance del proyecto se centra en una plataforma **browser-native**, es decir, una aplicación que aprovecha capacidades modernas del navegador para ofrecer una experiencia similar a un entorno de desarrollo, pero sin depender inicialmente de una infraestructura compleja de ejecución en servidor.

El MVP se enfocará en:

- Editor web multiarchivo.
- Preview de proyectos web.
- Ejecución local en navegador mediante tecnologías compatibles.
- Guardado persistente de proyectos.
- Gestión básica de usuarios.
- Publicación de proyectos.
- Galería pública.
- Fork/remix.
- Asistente IA como módulo complementario.

## Enfoque técnico

La solución se plantea con una arquitectura donde el frontend tiene un peso importante. El navegador se encarga de la experiencia principal del IDE: editor, árbol de archivos, preview y ejecución local cuando sea posible.

El backend se mantendrá inicialmente ligero, centrado en:

- Autenticación.
- Persistencia de proyectos.
- Gestión de permisos.
- Publicación y galería.
- Fork/remix.
- Proxy seguro para funcionalidades IA.

## Estado actual del proyecto

Actualmente el proyecto se encuentra en fase inicial de prototipado técnico.

Ya se ha realizado:

- Creación del repositorio.
- Estructura inicial de documentación.
- Creación del frontend con Vite, React y TypeScript.
- Integración inicial de Monaco Editor.
- Creación de un árbol de archivos simple en memoria.
- Preview inicial mediante `iframe` y `srcDoc`.
- Terminal/logs simulados.
- Preparación inicial para WebContainers.
- Creación de un componente de prueba para validar ejecución real en navegador.
- Creación de una utilidad para transformar archivos del editor en `FileSystemTree`.
- Conexión inicial entre el estado de archivos de Monaco y `WebContainerRunner`.

## Decisión de alcance

El proyecto no pretende ser un clon completo de VS Code, GitHub Codespaces o Replit. El objetivo es construir una versión acotada, útil y defendible para un Trabajo de Fin de Grado.

La primera versión se centrará en proyectos web y no en ejecución generalista de cualquier lenguaje.

## Fuera de alcance inicial

Quedan fuera del MVP inicial:

- Ejecución arbitraria de código en múltiples lenguajes.
- Terminal Linux persistente del lado servidor.
- Infraestructura propia de sandboxing con Docker para usuarios externos.
- Marketplace de extensiones.
- Colaboración simultánea completa tipo Google Docs.
- Compatibilidad móvil completa.
- Sustitución completa de un IDE profesional.

## Público objetivo

### Estudiantes

Personas que están aprendiendo desarrollo web y necesitan un entorno sencillo para practicar.

### Desarrolladores junior

Personas que quieren prototipar una idea web rápidamente.

### Docentes o formadores

Personas que quieren compartir ejemplos ejecutables con estudiantes.

### Visitantes

Personas que quieren consultar proyectos públicos, ejecutarlos y reutilizarlos como base.

## Valor diferencial

El valor principal del proyecto está en combinar en una única plataforma:

- Editor avanzado en navegador.
- Ejecución/previsualización integrada.
- Persistencia de proyectos.
- Publicación y reutilización.
- Asistencia IA contextual.
- Enfoque educativo y de prototipado.

## Criterio general de éxito

El proyecto se considerará exitoso si una persona puede entrar en la plataforma, crear un proyecto web, editarlo, ejecutarlo, guardarlo, publicarlo y permitir que otra persona lo consulte o lo reutilice mediante fork/remix.

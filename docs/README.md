# Documentación Del TFG

Documentación principal del proyecto **IDE Web Colaborativo con Asistente IA**.

## Resumen

La plataforma permite crear, editar, ejecutar, guardar, publicar y reutilizar proyectos web desde el navegador. El enfoque del MVP es browser-native, desktop-first y orientado a proyectos HTML, CSS, JavaScript, TypeScript y Node.

## Estado Actual

Versión funcional y ampliada:

- Frontend con React, TypeScript, Vite, Monaco y WebContainers.
- Backend con Express, Prisma, PostgreSQL y JWT.
- Gestión de usuarios.
- Gestión de proyectos: crear, editar metadatos, buscar y duplicar.
- Plantillas de inicio (Snake, login, lista de tareas).
- Editor con formateo (Prettier), vista previa de Markdown, barra de estado y tamaño de fuente.
- Importar archivos y exportar el proyecto como `.zip`.
- Snapshots de archivos con autoguardado y atajos de teclado.
- Ejecución con WebContainers y preview ampliable a pantalla completa.
- Publicación pública/privada.
- Galería pública con buscador.
- Vista pública de proyecto.
- Galería social: visitas y "me gusta".
- Fork/remix.
- Panel IA mediante backend proxy (Groq, streaming SSE).

Queda como condición de despliegue configurar base de datos, variables de entorno y migraciones.

## Índice

| Documento | Contenido |
|---|---|
| [00-context.md](00-context.md) | Contexto, motivación y alcance |
| [01-specs.md](01-specs.md) | Requisitos funcionales y no funcionales |
| [02-roadmap.md](02-roadmap.md) | Fases de desarrollo y estado |
| [03-arquitectura.md](03-arquitectura.md) | Arquitectura frontend, backend y base de datos |
| [04-decisiones-tecnicas.md](04-decisiones-tecnicas.md) | Decisiones técnicas justificadas |
| [05-riesgos.md](05-riesgos.md) | Riesgos y mitigaciones |
| [06-demo-tfg.md](06-demo-tfg.md) | Guion de demo |
| [07-continuacion-ia.md](07-continuacion-ia.md) | Notas de continuación |
| [08-proximos-pasos.md](08-proximos-pasos.md) | Estado y tareas restantes |
| [09-setup-dev.md](09-setup-dev.md) | Guía de configuración |

## Flujo De Demo Recomendado

1. Registrar usuario o iniciar sesión.
2. Crear proyecto.
3. Abrir IDE.
4. Crear o editar archivos.
5. Ejecutar proyecto y mostrar preview.
6. Guardar snapshot.
7. Publicar proyecto.
8. Abrir galería.
9. Abrir vista pública.
10. Hacer fork/remix.
11. Mostrar panel IA como asistencia contextual.

## Comandos De Verificación

```bash
npm run build
npm run lint
```

Para backend, tras instalar dependencias y configurar base de datos:

```bash
npm run backend:build
```

## Nota De Alcance

La colaboración del MVP se entiende como publicación, galería, compartición y fork/remix. La coedición en tiempo real queda como mejora futura.

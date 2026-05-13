# 05 - Riesgos y Mitigaciones

## Introducción

Este documento recoge los principales riesgos técnicos, funcionales y de planificación del proyecto, junto con sus estrategias de mitigación.

El objetivo no es eliminar todos los riesgos, sino identificarlos pronto y tomar decisiones de alcance que mantengan el proyecto dentro de un tamaño asumible para un TFG.

## Riesgo 1 - Alcance excesivo

### Descripción

El proyecto puede crecer demasiado si se intenta construir un clon completo de plataformas como VS Code, Replit o GitHub Codespaces.

### Impacto

Alto.

### Probabilidad

Alta.

### Consecuencias

- Retrasos.
- Funcionalidades incompletas.
- Mayor dificultad para defender el proyecto.
- Código difícil de mantener.

### Mitigación

- Definir un MVP claro.
- Priorizar editor, preview/ejecución, guardado, publicación y fork.
- Dejar multi-lenguaje fuera del MVP.
- Dejar coedición en tiempo real como mejora futura.
- Documentar explícitamente qué queda fuera del alcance.

## Riesgo 2 - Integración de WebContainers

### Descripción

WebContainers requieren una configuración específica y pueden presentar restricciones de compatibilidad.

### Impacto

Alto.

### Probabilidad

Media.

### Consecuencias

- La ejecución real puede no funcionar en todos los navegadores.
- Pueden aparecer problemas con cabeceras COOP/COEP.
- Algunas dependencias pueden no ser compatibles.
- El arranque puede ser lento.

### Mitigación

- Validar WebContainers en la fase inicial.
- Configurar correctamente Vite con headers.
- Usar navegadores Chromium como objetivo principal.
- Mantener preview simple como alternativa de desarrollo.
- Limitar plantillas a proyectos web controlados.
- Documentar compatibilidad.

## Riesgo 3 - Ejecutar código no confiable

### Descripción

Si se ejecutara código de usuarios en el backend, habría riesgos de seguridad importantes.

### Impacto

Alto.

### Probabilidad

Media si se cambia el alcance.

### Consecuencias

- Riesgo para el servidor.
- Necesidad de sandboxing.
- Mayor coste de infraestructura.
- Complejidad operativa.

### Mitigación

- Ejecutar en navegador durante el MVP.
- No implementar runners propios inicialmente.
- No usar Docker server-side para usuarios externos en la primera versión.
- Documentar este límite como decisión de seguridad.

## Riesgo 4 - Compatibilidad del navegador

### Descripción

La experiencia completa puede depender de características modernas del navegador.

### Impacto

Medio/Alto.

### Probabilidad

Media.

### Consecuencias

- Usuarios en navegadores no compatibles no podrán usar la ejecución avanzada.
- Puede haber diferencias entre Chrome, Edge, Firefox o Safari.

### Mitigación

- Definir el proyecto como desktop-first.
- Recomendar Chrome/Edge.
- Añadir detección de compatibilidad.
- Mostrar mensaje claro si no se cumplen requisitos.
- Ofrecer modo degradado si procede.

## Riesgo 5 - Complejidad de la IA

### Descripción

La IA puede añadir complejidad técnica, costes y problemas de integración.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Retraso en funcionalidades principales.
- Coste económico por llamadas.
- Necesidad de proteger API keys.
- Resultados inconsistentes.

### Mitigación

- Tratar la IA como módulo opcional.
- Implementar primero acciones simples.
- Usar backend proxy.
- No llamar a IA en cada pulsación.
- Limitar el contexto enviado.
- Documentar costes y limitaciones.

## Riesgo 6 - Falta de persistencia fiable

### Descripción

El proyecto puede perder cambios si el guardado no está bien diseñado.

### Impacto

Alto.

### Probabilidad

Media.

### Consecuencias

- Mala experiencia de usuario.
- Pérdida de datos.
- Dificultad para demo.

### Mitigación

- Empezar con guardado local en JSON.
- Después integrar backend.
- Usar snapshots.
- Añadir indicadores de guardado.
- Probar recuperación varias veces.

## Riesgo 7 - Diseño de base de datos incorrecto

### Descripción

Un modelo de datos mal planteado puede complicar proyectos, forks y publicaciones.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Refactor posterior.
- Dificultad para gestionar permisos.
- Problemas en publicación/fork.

### Mitigación

- Usar un modelo relacional sencillo.
- Empezar con snapshots JSON.
- Mantener entidades claras: usuario, proyecto, snapshot, publicación, fork.
- Usar Prisma para migraciones.

## Riesgo 8 - Experiencia de usuario insuficiente

### Descripción

La aplicación puede funcionar técnicamente pero resultar confusa para el usuario.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Demo poco clara.
- Dificultad para explicar el valor del proyecto.
- Menor calidad percibida.

### Mitigación

- Mantener layout claro.
- Separar editor, archivos, preview y logs.
- Añadir estados visibles.
- Crear guion de demo.
- Probar el flujo con otra persona.

## Riesgo 9 - Problemas de despliegue

### Descripción

El despliegue puede complicarse por las cabeceras necesarias, backend, base de datos o variables de entorno.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Demo dependiente del entorno local.
- Dificultad para mostrar el proyecto al profesor.
- Errores en producción.

### Mitigación

- Desplegar pronto una versión mínima.
- Elegir plataforma que permita configurar headers.
- Separar frontend y backend.
- Documentar variables de entorno.
- Mantener una demo local de respaldo.

## Riesgo 10 - Falta de tiempo

### Descripción

El proyecto puede requerir más tiempo del previsto.

### Impacto

Alto.

### Probabilidad

Media/Alta.

### Consecuencias

- Funcionalidades incompletas.
- Documentación insuficiente.
- Demo inestable.

### Mitigación

- Priorizar MVP.
- Mantener fases cerradas.
- No empezar IA hasta tener IDE y persistencia.
- Preparar memoria de forma paralela.
- Mantener lista de funcionalidades futuras.

## Riesgo 11 - Dependencia de paquetes externos

### Descripción

El proyecto depende de librerías como Monaco, WebContainers, Vite y posibles APIs IA.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Cambios de versión.
- Incompatibilidades.
- Errores difíciles de depurar.

### Mitigación

- Fijar versiones cuando el prototipo sea estable.
- Documentar dependencias principales.
- Evitar actualizar sin necesidad.
- Mantener commits pequeños y reversibles.

## Riesgo 12 - Dificultad para explicar el concepto de colaboración

### Descripción

El término colaborativo puede interpretarse como edición simultánea en tiempo real.

### Impacto

Medio.

### Probabilidad

Media.

### Consecuencias

- Expectativas incorrectas.
- Preguntas en defensa sobre coedición.

### Mitigación

- Explicar que el MVP aborda colaboración mediante publicación, compartición y fork.
- Documentar coedición como mejora futura.
- Justificar la decisión por alcance y complejidad técnica.

## Matriz resumen

| Riesgo | Impacto | Probabilidad | Prioridad |
|---|---|---|---|
| Alcance excesivo | Alto | Alta | Muy alta |
| WebContainers | Alto | Media | Alta |
| Ejecución no confiable | Alto | Media | Alta |
| Compatibilidad navegador | Medio/Alto | Media | Alta |
| IA | Medio | Media | Media |
| Persistencia | Alto | Media | Alta |
| Base de datos | Medio | Media | Media |
| UX | Medio | Media | Media |
| Despliegue | Medio | Media | Media |
| Falta de tiempo | Alto | Media/Alta | Alta |

## Riesgo más crítico actualmente

El riesgo más importante en la fase actual es la integración real de WebContainers con los archivos editados en Monaco.

Hasta que esa parte no esté validada, no conviene invertir demasiado tiempo en comunidad, IA o diseño visual avanzado.

## Plan de contingencia

Si WebContainers no resulta viable:

1. Mantener editor Monaco.
2. Mantener preview simple para HTML/CSS/JS.
3. Añadir ejecución simplificada para proyectos frontend.
4. Documentar WebContainers como línea investigada.
5. Valorar un backend de ejecución externo como mejora futura.

Si la IA no entra en tiempo:

1. Mantener el panel IA como diseño.
2. Implementar solo explicación de código.
3. Documentar snippets, tests y refactor como ampliaciones.

Si el backend se retrasa:

1. Mantener guardado local.
2. Preparar endpoints mínimos.
3. Priorizar demo funcional sobre sistema completo.
4. Documentar backend completo como ampliación si no entra en plazo.

## Actualización de avance - 13/05/2026

La integración entre editor y WebContainers ha avanzado: ya existe conversión de `ProjectFile[]` a `FileSystemTree` y `WebContainerRunner` recibe los archivos reales del editor.

El riesgo principal sigue abierto, porque falta validar el flujo completo en navegador compatible. La mitigación inmediata es probar Chrome/Edge, añadir reset del runtime y mantener la preview simple como respaldo hasta que la preview real sea estable.

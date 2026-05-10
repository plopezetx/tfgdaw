# 05 - Riesgos y Mitigaciones

## Riesgo 1 - Incompatibilidad del navegador

### Descripción

WebContainers requiere características modernas del navegador y puede no funcionar correctamente en todos los entornos.

### Mitigación

- Definir el proyecto como desktop-first.
- Recomendar Chromium.
- Detectar incompatibilidad.
- Mostrar mensaje claro al usuario.

## Riesgo 2 - Alcance excesivo

### Descripción

Intentar construir un clon completo de VS Code/Replit puede hacer que el TFG sea inviable.

### Mitigación

- Limitar el MVP a proyectos web.
- Dejar multi-lenguaje fuera del MVP.
- Dejar colaboración en tiempo real como mejora futura.
- Priorizar editor, ejecución, guardado, publicación y fork.

## Riesgo 3 - Ejecución de código no confiable

### Descripción

Ejecutar código de usuarios en servidor implica riesgos de seguridad importantes.

### Mitigación

- Ejecutar el MVP en navegador mediante WebContainers.
- No implementar runners propios en servidor en la primera versión.

## Riesgo 4 - Coste de IA

### Descripción

Las funciones IA pueden generar costes si se usan de forma intensiva.

### Mitigación

- Limitar llamadas.
- Usar acciones manuales, no en cada pulsación.
- Usar modelos económicos.
- Registrar interacciones si es necesario.

## Riesgo 5 - Complejidad de colaboración en tiempo real

### Descripción

La coedición simultánea requiere sincronización, presencia, resolución de conflictos y WebSockets.

### Mitigación

- Definir colaboración inicial como publicación, exploración y fork.
- Dejar coedición como mejora futura.
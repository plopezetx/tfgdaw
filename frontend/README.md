# Frontend

Aplicación React del IDE Web Colaborativo.

## Stack

- React
- TypeScript
- Vite
- Monaco Editor
- WebContainers
- JSZip (exportar proyecto)
- Prettier (formatear código, carga diferida)
- marked (vista previa de Markdown)
- CSS propio

## Funcionalidades

- Login y registro.
- Dashboard de proyectos con buscador.
- Plantillas de inicio: juego Snake, página de login y lista de tareas.
- IDE multiarchivo con explorador en árbol de carpetas plegable.
- Crear, renombrar y eliminar archivos.
- Importar archivos y exportar el proyecto como `.zip`.
- Editor Monaco con:
  - Botón de formatear código (Prettier: HTML, CSS, JS, TS, JSON, Markdown).
  - Vista previa para archivos Markdown.
  - Barra de estado (lenguaje, líneas, caracteres) y tamaño de fuente ajustable.
  - Tema del editor sincronizado con el tema de la app (claro/oscuro).
- Atajos de teclado: Ctrl+S guardar, Ctrl+Enter ejecutar.
- Autoguardado y aviso de cambios sin guardar.
- Renombrar el proyecto desde el IDE (clic en el nombre).
- Editar, duplicar, publicar y eliminar proyectos (menú de acciones).
- Historial de versiones: guardar y restaurar versiones del proyecto.
- Preview con WebContainers, ampliable a pantalla completa.
- Panel inferior con pestañas: Terminal, Consola del preview e IA.
- Consola del preview: captura `console.log` y errores del programa en ejecución.
- Terminal/logs (con limpieza de códigos de color ANSI).
- Guardado de snapshots en backend.
- Publicación pública/privada.
- Galería pública con buscador y orden (recientes/vistos/gustados).
- Vista pública de proyecto con "me gusta", visitas y comentarios.
- Perfil de usuario con avatar, estadísticas y calendario de actividad.
- Perfil de autor (`/u/:username`) con sus proyectos públicos.
- Ajustes de cuenta: editar nombre/email y cambiar contraseña.
- Notificaciones (toasts) y tema claro/oscuro con persistencia.
- Fork/remix.
- Panel IA conectado al backend.

## Desarrollo

Desde la raíz del repositorio:

```bash
npm run dev
```

Desde esta carpeta:

```bash
npm run dev
```

URL:

```txt
http://localhost:5173
```

## Variables De Entorno

Opcionalmente puedes crear `frontend/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Si no se define, el frontend usa `http://localhost:3000`.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Compatibilidad

La edición funciona en navegadores modernos, pero la ejecución completa con WebContainers requiere Chrome o Edge con cabeceras COOP/COEP activas.

Vite ya configura estas cabeceras en `vite.config.ts` para desarrollo local.

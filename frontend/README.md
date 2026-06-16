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

- Login y registro (con indicador de fuerza de contraseña).
- Dashboard de proyectos con buscador y filtro (todos/públicos/privados).
- Icono (emoji) por proyecto, elegido en un pop-up al crear o editar.
- Plantillas de inicio: Snake, login, lista de tareas, calculadora, reloj y lienzo.
- Plantillas propias guardadas desde proyectos existentes (con su icono).
- IDE multiarchivo con explorador en árbol de carpetas plegable.
- Crear, renombrar y eliminar archivos en línea (sin diálogos del navegador).
- Importar archivos, exportar el proyecto como `.zip` y descargar archivos sueltos.
- Editor Monaco con:
  - Botón de formatear código (Prettier: HTML, CSS, JS, TS, JSON, Markdown).
  - Vista previa para archivos Markdown.
  - Barra de estado (lenguaje, líneas, caracteres) y tamaño de fuente ajustable.
  - Tema del editor sincronizado con el tema de la app (claro/oscuro).
- Buscar en archivos (Ctrl+Shift+F) y paleta de comandos (Ctrl+P).
- Atajos de teclado: Ctrl+S guardar, Ctrl+Enter ejecutar.
- Tour guiado la primera vez (con botón para repetirlo).
- Autoguardado y aviso de cambios sin guardar.
- Renombrar el proyecto desde el IDE (clic en el nombre).
- Editar (en línea), duplicar, publicar, guardar como plantilla y eliminar proyectos.
- Historial de versiones: guardar y restaurar versiones del proyecto.
- Preview con WebContainers, ampliable a pantalla completa.
- Panel inferior con pestañas: Terminal, Consola del preview e IA.
- Consola del preview: captura `console.log` y errores del programa en ejecución.
- Terminal/logs (con limpieza de códigos de color ANSI).
- Guardado de snapshots en backend.
- Publicación pública/privada.
- Galería pública con buscador y orden (recientes/vistos/gustados).
- Vista pública de proyecto con "me gusta", favoritos, visitas y comentarios.
- Lista de favoritos y feed de autores seguidos.
- Perfil de usuario con avatar, estadísticas y calendario de actividad.
- Perfil de autor (`/u/:username`) con sus proyectos públicos y seguir/seguidores.
- Ajustes de cuenta: editar nombre/email, cambiar contraseña y borrar la cuenta.
- Notificaciones (toasts), tema claro/oscuro con persistencia y diseño responsive.
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

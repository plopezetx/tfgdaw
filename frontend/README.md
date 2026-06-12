# Frontend

Aplicación React del IDE Web Colaborativo.

## Stack

- React
- TypeScript
- Vite
- Monaco Editor
- WebContainers
- CSS propio

## Funcionalidades

- Login y registro.
- Dashboard de proyectos.
- IDE multiarchivo.
- Crear, renombrar y eliminar archivos.
- Editor Monaco.
- Preview con WebContainers.
- Terminal/logs.
- Guardado de snapshots en backend.
- Publicación pública/privada.
- Galería pública.
- Vista pública de proyecto.
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

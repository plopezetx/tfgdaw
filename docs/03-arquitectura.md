# 03 - Arquitectura del Sistema

## Visión general

La arquitectura propuesta es browser-heavy y backend-thin. El frontend concentra la experiencia del IDE, editor, terminal, ejecución y preview. El backend se encarga de autenticación, persistencia, publicación, galería y proxy de IA.

## Diagrama general

```txt
Usuario
  |
  v
Frontend React
  |-- Monaco Editor
  |-- File Explorer
  |-- xterm.js
  |-- WebContainer Runtime
  |-- Preview iframe
  |-- AI Panel
  |
  v
Backend Express
  |-- Auth
  |-- Projects API
  |-- Public Gallery API
  |-- Fork API
  |-- AI Proxy
  |
  v
PostgreSQL
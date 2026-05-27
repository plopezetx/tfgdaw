import type { ProjectFile } from "../types/projects";

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  css: "css",
  html: "html",
  js: "javascript",
  jsx: "javascript",
  json: "json",
  md: "markdown",
  ts: "typescript",
  tsx: "typescript",
};

export function getFileName(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

export function inferLanguage(path: string): string {
  const extension = path.split(".").at(-1)?.toLowerCase() ?? "";
  return LANGUAGE_BY_EXTENSION[extension] ?? "plaintext";
}

export function normalizeFilePath(path: string): string {
  const normalized = path.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  return normalized ? `/${normalized}` : "";
}

export function createProjectFile(path: string): ProjectFile | null {
  const normalizedPath = normalizeFilePath(path);

  if (!normalizedPath) {
    return null;
  }

  return {
    name: getFileName(normalizedPath),
    path: normalizedPath,
    language: inferLanguage(normalizedPath),
    content: getInitialContent(normalizedPath),
  };
}

export function renameProjectFile(file: ProjectFile, nextPath: string): ProjectFile | null {
  const normalizedPath = normalizeFilePath(nextPath);

  if (!normalizedPath) {
    return null;
  }

  return {
    ...file,
    name: getFileName(normalizedPath),
    path: normalizedPath,
    language: inferLanguage(normalizedPath),
  };
}

function getInitialContent(path: string): string {
  if (path.endsWith(".html")) {
    return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Nuevo archivo</title>
  </head>
  <body>
    <h1>Nuevo archivo HTML</h1>
  </body>
</html>`;
  }

  if (path.endsWith(".css")) {
    return `body {
  font-family: Arial, sans-serif;
}`;
  }

  if (path.endsWith(".json")) {
    return "{\n  \n}\n";
  }

  return "";
}

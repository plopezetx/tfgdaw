import JSZip from "jszip";
import type { ProjectFile } from "../types/projects";
import { getFileName, inferLanguage, normalizeFilePath } from "./projectFiles";

// Descarga todos los archivos del proyecto como un .zip
export async function exportProjectZip(
  files: ProjectFile[],
  projectName: string
): Promise<void> {
  const zip = new JSZip();

  for (const file of files) {
    // Quitamos la barra inicial para que el zip no tenga rutas absolutas
    const zipPath = file.path.replace(/^\/+/, "");
    zip.file(zipPath, file.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const safeName =
    projectName.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") ||
    "proyecto";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Lee una lista de archivos (de un <input type="file">) y los convierte en
// ProjectFile. Usa la ruta relativa cuando se sube una carpeta.
export async function importFiles(fileList: FileList): Promise<ProjectFile[]> {
  const result: ProjectFile[] = [];

  for (const file of Array.from(fileList)) {
    const relativePath =
      (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
      file.name;
    const path = normalizeFilePath(relativePath);
    if (!path) continue;

    const content = await file.text();

    result.push({
      name: getFileName(path),
      path,
      language: inferLanguage(path),
      content,
    });
  }

  return result;
}

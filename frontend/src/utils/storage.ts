import type { ProjectFile } from "../types/projects";

const STORAGE_KEY = "ide_web_project_files";

export function saveProject(files: ProjectFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export function loadProject(): ProjectFile[] | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;
    return parsed as ProjectFile[];
  } catch {
    return null;
  }
}

export function clearProject(): void {
  localStorage.removeItem(STORAGE_KEY);
}

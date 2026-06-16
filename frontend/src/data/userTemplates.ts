import type { ProjectFile } from "../types/projects";

// Plantillas creadas por el usuario, guardadas en el navegador (localStorage).
// La clave incluye el ID del usuario para que cada cuenta tenga las suyas
// aunque compartan el mismo navegador.
export type UserTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  files: ProjectFile[];
};

function storageKey(userId: string): string {
  return `ide_web_user_templates_${userId}`;
}

export function getUserTemplates(userId: string): UserTemplate[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as UserTemplate[]) : [];
  } catch {
    return [];
  }
}

export function saveUserTemplate(
  userId: string,
  name: string,
  description: string,
  icon: string,
  files: ProjectFile[]
): UserTemplate {
  const template: UserTemplate = {
    id: `ut_${Date.now()}`,
    name,
    description,
    icon,
    files,
  };
  const next = [template, ...getUserTemplates(userId)];
  localStorage.setItem(storageKey(userId), JSON.stringify(next));
  return template;
}

export function deleteUserTemplate(userId: string, id: string): void {
  const next = getUserTemplates(userId).filter((t) => t.id !== id);
  localStorage.setItem(storageKey(userId), JSON.stringify(next));
}

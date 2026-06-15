import type { ProjectFile } from "../types/projects";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
let authToken: string | null = null;

export type User = {
  id: string;
  email: string;
  username: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectWithSnapshot = ProjectSummary & {
  snapshot: {
    files: ProjectFile[];
  } | null;
};

export type GalleryProject = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  views: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  owner: { username: string };
};

export type PublicProjectDetail = ProjectSummary & {
  snapshot: { files: ProjectFile[] } | null;
  owner: { id: string; username: string };
  views: number;
  likeCount: number;
};

export type LikeStatus = {
  liked: boolean;
  likeCount: number;
};

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? response.statusText;
    throw new Error(message);
  }

  return data as T;
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getProjects(): Promise<ProjectSummary[]> {
  return request<ProjectSummary[]>("/projects");
}

export async function createProject(
  name: string,
  description = ""
): Promise<ProjectSummary> {
  return request<ProjectSummary>("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function getProject(
  projectId: string
): Promise<ProjectWithSnapshot> {
  return request<ProjectWithSnapshot>(`/projects/${projectId}`);
}

export async function saveSnapshot(
  projectId: string,
  files: ProjectFile[]
): Promise<unknown> {
  return request<unknown>(`/projects/${projectId}/snapshot`, {
    method: "PUT",
    body: JSON.stringify({ files }),
  });
}

export async function updateProject(
  projectId: string,
  data: Partial<Pick<ProjectSummary, "name" | "description" | "isPublic">>
): Promise<ProjectSummary> {
  return request<ProjectSummary>(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  return request<void>(`/projects/${projectId}`, { method: "DELETE" });
}

export async function getGallery(): Promise<GalleryProject[]> {
  return request<GalleryProject[]>("/projects/public/gallery");
}

export async function getPublicProject(slug: string): Promise<PublicProjectDetail> {
  return request<PublicProjectDetail>(`/projects/public/${slug}`);
}

export async function forkProject(projectId: string): Promise<ProjectSummary> {
  return request<ProjectSummary>(`/projects/${projectId}/fork`, {
    method: "POST",
  });
}

export async function getLikeStatus(projectId: string): Promise<LikeStatus> {
  return request<LikeStatus>(`/projects/${projectId}/like-status`);
}

export async function toggleLike(projectId: string): Promise<LikeStatus> {
  return request<LikeStatus>(`/projects/${projectId}/like`, {
    method: "POST",
  });
}

export async function chatWithAI(
  message: string,
  fileContent: string,
  fileName: string,
  selection: string | undefined,
  onChunk: (text: string) => void
): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${BACKEND_URL}/ai/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, fileContent, fileName, selection }),
  });

  if (!response.ok) {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    throw new Error(data?.message ?? "Error al contactar con la IA");
  }

  if (!response.body) throw new Error("Sin respuesta del servidor");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") return;
      try {
        const parsed = JSON.parse(payload) as { text?: string; error?: string };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.text) onChunk(parsed.text);
      } catch (e) {
        if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
      }
    }
  }
}

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "../lib/router";
import { useAuth } from "../context/AuthContext";
import * as api from "../lib/api";

export function ProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<api.ProjectSummary[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      setError(null);
      try {
        const items = await api.getProjects();
        setProjects(items);
      } catch (err) {
        setError((err as Error).message ?? "No se pudieron cargar los proyectos");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newProjectName.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const project = await api.createProject(newProjectName.trim(), "");
      navigate(`/app/${project.id}`);
    } catch (err) {
      setError((err as Error).message ?? "Error al crear proyecto");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublic(project: api.ProjectSummary) {
    try {
      const updated = await api.updateProject(project.id, {
        isPublic: !project.isPublic,
      });
      setProjects((current) =>
        current.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (err) {
      setError((err as Error).message ?? "Error al actualizar el proyecto");
    }
  }

  async function handleDelete(project: api.ProjectSummary) {
    if (!confirm(`¿Eliminar "${project.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.deleteProject(project.id);
      setProjects((current) => current.filter((p) => p.id !== project.id));
    } catch (err) {
      setError((err as Error).message ?? "Error al eliminar el proyecto");
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Mis proyectos</h1>
          <p>{user ? `Hola, ${user.username}` : "Usuario no autenticado"}</p>
        </div>

        <div className="page-actions">
          <Link to="/gallery" className="page-action-link">Galería pública</Link>
          <button type="button" onClick={() => logout()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="card">
        <form onSubmit={handleCreateProject} className="project-form">
          <label>
            Nombre del proyecto
            <input
              type="text"
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              placeholder="Ej. Mi primer IDE"
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creando…" : "Crear proyecto"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Proyectos guardados</h2>

        {loading && <p>Cargando proyectos...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && projects.length === 0 && (
          <p>No tienes proyectos guardados todavía.</p>
        )}

        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-card">
              <div>
                <strong>{project.name}</strong>
                <p>{project.description ?? "Sin descripción"}</p>
                <small>Actualizado: {new Date(project.updatedAt).toLocaleString()}</small>
              </div>
              <div className="project-card-actions">
                <Link to={`/app/${project.id}`}>Abrir IDE</Link>
                <button
                  type="button"
                  className={`visibility-toggle ${project.isPublic ? "is-public" : ""}`}
                  onClick={() => handleTogglePublic(project)}
                  title={project.isPublic ? "Hacer privado" : "Publicar en galería"}
                >
                  {project.isPublic ? "Público" : "Privado"}
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(project)}
                  title="Eliminar proyecto"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

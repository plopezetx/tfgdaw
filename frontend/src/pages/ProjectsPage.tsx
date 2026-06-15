import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "../lib/router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as api from "../lib/api";
import { projectTemplates } from "../data/templates";

export function ProjectsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<api.ProjectSummary[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  // Cierra el menú desplegable al hacer clic en cualquier otra parte
  useEffect(() => {
    if (!openMenuId) return;
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

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

  async function handleCreateFromTemplate(templateId: string) {
    const template = projectTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setCreatingTemplate(templateId);
    setError(null);

    try {
      const project = await api.createProject(template.name, template.description);
      await api.saveSnapshot(project.id, template.files);
      navigate(`/app/${project.id}`);
    } catch (err) {
      setError((err as Error).message ?? "Error al crear el proyecto de muestra");
      setCreatingTemplate(null);
    }
  }

  async function handleTogglePublic(project: api.ProjectSummary) {
    try {
      const updated = await api.updateProject(project.id, {
        isPublic: !project.isPublic,
      });
      setProjects((current) =>
        current.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      toast(updated.isPublic ? "Proyecto publicado" : "Proyecto hecho privado", "success");
    } catch (err) {
      toast((err as Error).message ?? "Error al actualizar el proyecto", "error");
    }
  }

  async function handleEdit(project: api.ProjectSummary) {
    const name = prompt("Nuevo nombre del proyecto", project.name);
    if (name === null) return;

    const description = prompt(
      "Descripción del proyecto",
      project.description ?? ""
    );
    if (description === null) return;

    try {
      const updated = await api.updateProject(project.id, {
        name: name.trim() || project.name,
        description: description.trim(),
      });
      setProjects((current) =>
        current.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      toast("Proyecto actualizado", "success");
    } catch (err) {
      toast((err as Error).message ?? "Error al editar el proyecto", "error");
    }
  }

  async function handleDuplicate(project: api.ProjectSummary) {
    setDuplicatingId(project.id);

    try {
      const full = await api.getProject(project.id);
      const copy = await api.createProject(
        `${project.name} (copia)`,
        project.description ?? ""
      );
      if (full.snapshot?.files?.length) {
        await api.saveSnapshot(copy.id, full.snapshot.files);
      }
      setProjects((current) => [copy, ...current]);
      toast("Proyecto duplicado", "success");
    } catch (err) {
      toast((err as Error).message ?? "Error al duplicar el proyecto", "error");
    } finally {
      setDuplicatingId(null);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      project.name.toLowerCase().includes(term) ||
      (project.description ?? "").toLowerCase().includes(term)
    );
  });

  async function handleDelete(project: api.ProjectSummary) {
    if (!confirm(`¿Eliminar "${project.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.deleteProject(project.id);
      setProjects((current) => current.filter((p) => p.id !== project.id));
      toast("Proyecto eliminado", "success");
    } catch (err) {
      toast((err as Error).message ?? "Error al eliminar el proyecto", "error");
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
          <Link to="/profile" className="page-action-link">Perfil</Link>
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
        <h2>Empezar desde una plantilla</h2>
        <div className="template-grid">
          {projectTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className="template-card"
              onClick={() => handleCreateFromTemplate(template.id)}
              disabled={creatingTemplate !== null}
            >
              <span className="template-icon">{template.icon}</span>
              <span className="template-name">{template.name}</span>
              <span className="template-desc">{template.description}</span>
              {creatingTemplate === template.id && (
                <span className="template-loading">Creando…</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Proyectos guardados</h2>
          {projects.length > 0 && (
            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar proyecto…"
            />
          )}
        </div>

        {loading && <p>Cargando proyectos...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && projects.length === 0 && (
          <p>No tienes proyectos guardados todavía.</p>
        )}

        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <p>No hay proyectos que coincidan con la búsqueda.</p>
        )}

        <ul className="project-list">
          {filteredProjects.map((project) => (
            <li
              key={project.id}
              className={`project-card${openMenuId === project.id ? " project-card--menu-open" : ""}`}
            >
              <div>
                <strong>{project.name}</strong>
                <p>{project.description || "Sin descripción"}</p>
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

                <div className="card-menu">
                  <button
                    type="button"
                    className="card-menu-trigger"
                    aria-label="Más acciones"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId((current) =>
                        current === project.id ? null : project.id
                      );
                    }}
                  >
                    ⋯
                  </button>

                  {openMenuId === project.id && (
                    <div className="card-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleEdit(project);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={duplicatingId === project.id}
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDuplicate(project);
                        }}
                      >
                        {duplicatingId === project.id ? "Duplicando…" : "Duplicar"}
                      </button>
                      <button
                        type="button"
                        className="card-menu-danger"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDelete(project);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

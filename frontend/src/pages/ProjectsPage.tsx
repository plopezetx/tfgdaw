import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "../lib/router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as api from "../lib/api";
import { projectTemplates } from "../data/templates";
import {
  getUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
  type UserTemplate,
} from "../data/userTemplates";

const PROJECT_EMOJIS = ["📁", "🚀", "🎮", "🎨", "🧮", "🕒", "✅", "🌐", "💡", "🔥", "⚛️", "📝"];

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>(() =>
    user ? getUserTemplates(user.id) : []
  );

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

  function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newProjectName.trim()) return;
    // Abre el pop-up para elegir el icono antes de crear.
    setShowIconModal(true);
  }

  async function createWithIcon(icon?: string) {
    setShowIconModal(false);
    setSubmitting(true);
    setError(null);

    try {
      const project = await api.createProject(newProjectName.trim(), "", icon);
      navigate(`/app/${project.id}`);
    } catch (err) {
      setError((err as Error).message ?? "Error al crear proyecto");
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

  async function handleCreateFromUserTemplate(template: UserTemplate) {
    setCreatingTemplate(template.id);
    setError(null);
    try {
      const project = await api.createProject(
        template.name,
        template.description,
        template.icon
      );
      await api.saveSnapshot(project.id, template.files);
      navigate(`/app/${project.id}`);
    } catch (err) {
      setError((err as Error).message ?? "Error al crear desde la plantilla");
      setCreatingTemplate(null);
    }
  }

  async function handleSaveAsTemplate(project: api.ProjectSummary) {
    if (!user) return;
    try {
      const full = await api.getProject(project.id);
      const files = full.snapshot?.files ?? [];
      if (files.length === 0) {
        toast("El proyecto no tiene archivos para guardar", "error");
        return;
      }
      saveUserTemplate(
        user.id,
        project.name,
        project.description ?? "",
        project.icon ?? "📦",
        files
      );
      setUserTemplates(getUserTemplates(user.id));
      toast("Guardado en Mis plantillas", "success");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo guardar la plantilla", "error");
    }
  }

  function handleDeleteUserTemplate(id: string) {
    if (!user) return;
    deleteUserTemplate(user.id, id);
    setUserTemplates(getUserTemplates(user.id));
    toast("Plantilla eliminada", "success");
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

  function startEdit(project: api.ProjectSummary) {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description ?? "");
    setEditIcon(project.icon ?? "📁");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(project: api.ProjectSummary) {
    const name = editName.trim();
    if (!name) {
      toast("El nombre no puede estar vacío", "error");
      return;
    }

    setSavingEdit(true);
    try {
      const updated = await api.updateProject(project.id, {
        name,
        description: editDescription.trim(),
        icon: editIcon, // string para fijarlo, null para quitarlo
      });
      setProjects((current) =>
        current.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      setEditingId(null);
      toast("Proyecto actualizado", "success");
    } catch (err) {
      toast((err as Error).message ?? "Error al editar el proyecto", "error");
    } finally {
      setSavingEdit(false);
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
    if (filter === "public" && !project.isPublic) return false;
    if (filter === "private" && project.isPublic) return false;
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      project.name.toLowerCase().includes(term) ||
      (project.description ?? "").toLowerCase().includes(term)
    );
  });

  async function handleDelete(project: api.ProjectSummary) {
    setConfirmingDeleteId(null);
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
          <Link to="/following" className="page-action-link">Siguiendo</Link>
          <Link to="/favorites" className="page-action-link">Favoritos</Link>
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

      {userTemplates.length > 0 && (
        <section className="card">
          <h2>Mis plantillas</h2>
          <div className="template-grid">
            {userTemplates.map((template) => (
              <div key={template.id} className="template-card-wrap">
                <button
                  type="button"
                  className="template-card"
                  onClick={() => handleCreateFromUserTemplate(template)}
                  disabled={creatingTemplate !== null}
                >
                  <span className="template-icon">{template.icon || "📦"}</span>
                  <span className="template-name">{template.name}</span>
                  <span className="template-desc">
                    {template.description || "Plantilla guardada"}
                  </span>
                  {creatingTemplate === template.id && (
                    <span className="template-loading">Creando…</span>
                  )}
                </button>
                <button
                  type="button"
                  className="template-delete"
                  onClick={() => handleDeleteUserTemplate(template.id)}
                  title="Eliminar plantilla"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

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

        {projects.length > 0 && (
          <div className="segmented project-filter">
            <button
              className={`segmented-btn${filter === "all" ? " segmented-btn--active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`segmented-btn${filter === "public" ? " segmented-btn--active" : ""}`}
              onClick={() => setFilter("public")}
            >
              Públicos
            </button>
            <button
              className={`segmented-btn${filter === "private" ? " segmented-btn--active" : ""}`}
              onClick={() => setFilter("private")}
            >
              Privados
            </button>
          </div>
        )}

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
              {editingId === project.id ? (
                <div className="project-edit">
                  <input
                    className="project-edit-name"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(project);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    placeholder="Nombre del proyecto"
                  />
                  <input
                    className="project-edit-desc"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(project);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    placeholder="Descripción (opcional)"
                  />
                  <div className="emoji-picker">
                    <button
                      type="button"
                      className={`emoji-option emoji-option--none${editIcon === null ? " emoji-option--active" : ""}`}
                      onClick={() => setEditIcon(null)}
                      title="Sin icono"
                    >
                      ⊘
                    </button>
                    {PROJECT_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`emoji-option${editIcon === emoji ? " emoji-option--active" : ""}`}
                        onClick={() => setEditIcon(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="project-edit-actions">
                    <button
                      type="button"
                      className="run-button"
                      onClick={() => saveEdit(project)}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "…" : "Guardar"}
                    </button>
                    <button type="button" className="action-button" onClick={cancelEdit}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : confirmingDeleteId === project.id ? (
                <div className="project-delete-confirm">
                  <span>
                    ¿Eliminar <strong>{project.name}</strong>? Esta acción no se
                    puede deshacer.
                  </span>
                  <div className="project-edit-actions">
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(project)}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => setConfirmingDeleteId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <strong
                      className="project-name-edit"
                      title="Haz clic para renombrar"
                      onClick={() => startEdit(project)}
                    >
                      {project.icon && <span className="project-icon">{project.icon}</span>}
                      {project.name}
                    </strong>
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
                              startEdit(project);
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
                            onClick={() => {
                              setOpenMenuId(null);
                              handleSaveAsTemplate(project);
                            }}
                          >
                            Guardar como plantilla
                          </button>
                          <button
                            type="button"
                            className="card-menu-danger"
                            onClick={() => {
                              setOpenMenuId(null);
                              setConfirmingDeleteId(project.id);
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {showIconModal && (
        <div className="modal-overlay" onClick={() => setShowIconModal(false)}>
          <div className="modal modal--icons" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Elige un icono</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowIconModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="icon-modal-sub">
              Para el proyecto «{newProjectName.trim()}»
            </p>
            <div className="icon-modal-grid">
              {PROJECT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="icon-modal-emoji"
                  onClick={() => createWithIcon(emoji)}
                  disabled={submitting}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="icon-modal-skip"
              onClick={() => createWithIcon()}
              disabled={submitting}
            >
              Crear sin icono
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

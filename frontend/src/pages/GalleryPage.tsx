import { useEffect, useState } from "react";
import { Link, useNavigate } from "../lib/router";
import { useAuth } from "../context/AuthContext";
import * as api from "../lib/api";

export function GalleryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<api.GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .getGallery()
      .then(setProjects)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      project.name.toLowerCase().includes(term) ||
      (project.description ?? "").toLowerCase().includes(term) ||
      project.owner.username.toLowerCase().includes(term)
    );
  });

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Galería pública</h1>
          <p>Proyectos compartidos por la comunidad</p>
        </div>
        <div className="page-actions">
          {projects.length > 0 && (
            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar…"
            />
          )}
          {user ? (
            <button type="button" onClick={() => navigate("/projects")}>
              Mis proyectos
            </button>
          ) : (
            <Link to="/login" className="page-action-link">
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      {loading && <p>Cargando proyectos…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="card">
          <p>Aún no hay proyectos públicos. ¡Sé el primero en publicar uno!</p>
        </div>
      )}

      {!loading && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="card">
          <p>No hay proyectos que coincidan con la búsqueda.</p>
        </div>
      )}

      <div className="gallery-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="gallery-card">
            <div className="gallery-card-body">
              <strong>{project.name}</strong>
              <p>{project.description ?? "Sin descripción"}</p>
              <small>
                por <span className="gallery-owner">{project.owner.username}</span>
                {" · "}
                {new Date(project.updatedAt).toLocaleDateString("es-ES")}
              </small>
              <div className="stat-row">
                <span className="stat" title="Visitas">👁 {project.views}</span>
                <span className="stat" title="Me gusta">❤️ {project.likeCount}</span>
              </div>
            </div>
            <div className="gallery-card-actions">
              <Link to={`/p/${project.slug}`}>Ver proyecto</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

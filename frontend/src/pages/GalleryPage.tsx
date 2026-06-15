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
  const [sort, setSort] = useState<"recent" | "views" | "likes">("recent");

  useEffect(() => {
    api
      .getGallery()
      .then(setProjects)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return (
        project.name.toLowerCase().includes(term) ||
        (project.description ?? "").toLowerCase().includes(term) ||
        project.owner.username.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sort === "views") return b.views - a.views;
      if (sort === "likes") return b.likeCount - a.likeCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Galería pública</h1>
          <p>Proyectos compartidos por la comunidad</p>
        </div>
        <div className="page-actions">
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

      {projects.length > 0 && (
        <div className="gallery-toolbar">
          <div className="search-box">
            <span className="search-box-icon">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, descripción o autor…"
            />
          </div>

          <div className="segmented">
            <button
              className={`segmented-btn${sort === "recent" ? " segmented-btn--active" : ""}`}
              onClick={() => setSort("recent")}
            >
              Recientes
            </button>
            <button
              className={`segmented-btn${sort === "views" ? " segmented-btn--active" : ""}`}
              onClick={() => setSort("views")}
            >
              Más vistos
            </button>
            <button
              className={`segmented-btn${sort === "likes" ? " segmented-btn--active" : ""}`}
              onClick={() => setSort("likes")}
            >
              Más gustados
            </button>
          </div>
        </div>
      )}

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
                por{" "}
                <Link className="gallery-owner" to={`/u/${project.owner.username}`}>
                  {project.owner.username}
                </Link>
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

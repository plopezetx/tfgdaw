import { useEffect, useState } from "react";
import { Link, useNavigate } from "../lib/router";
import * as api from "../lib/api";

export function FollowingPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<api.GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFollowingFeed()
      .then(setProjects)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Siguiendo</h1>
          <p>Lo último de los autores que sigues</p>
        </div>
        <div className="page-actions">
          <Link to="/gallery" className="page-action-link">Galería pública</Link>
          <button type="button" onClick={() => navigate("/projects")}>
            Mis proyectos
          </button>
        </div>
      </header>

      {loading && <p>Cargando…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="card">
          <p>
            Aún no sigues a nadie (o no han publicado nada). Entra en el perfil de
            un autor desde la galería y pulsa <strong>Seguir</strong>.
          </p>
        </div>
      )}

      <div className="gallery-grid">
        {projects.map((project) => (
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

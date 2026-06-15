import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../lib/router";
import * as api from "../lib/api";

export function AuthorPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<api.AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    api
      .getAuthorProfile(username)
      .then(setProfile)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return <main className="page-shell"><p>Cargando perfil…</p></main>;
  }

  if (error || !profile) {
    return (
      <main className="page-shell">
        <p className="form-error">{error ?? "Usuario no encontrado"}</p>
        <button type="button" className="action-button" onClick={() => navigate("/gallery")}>
          Volver a la galería
        </button>
      </main>
    );
  }

  const totalViews = profile.projects.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = profile.projects.reduce((sum, p) => sum + p.likeCount, 0);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>{profile.user.username}</h1>
          <p>
            Miembro desde {new Date(profile.user.createdAt).toLocaleDateString("es-ES")}
            {" · "}
            {profile.projects.length} proyecto(s) público(s)
          </p>
        </div>
        <div className="page-actions">
          <Link to="/gallery" className="page-action-link">Galería pública</Link>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{profile.projects.length}</span>
          <span className="stat-label">Proyectos</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalViews}</span>
          <span className="stat-label">Visitas</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalLikes}</span>
          <span className="stat-label">Me gusta</span>
        </div>
      </div>

      {profile.projects.length === 0 ? (
        <div className="card">
          <p>Este usuario todavía no tiene proyectos públicos.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {profile.projects.map((project) => (
            <div key={project.id} className="gallery-card">
              <div className="gallery-card-body">
                <strong>{project.name}</strong>
                <p>{project.description ?? "Sin descripción"}</p>
                <small>{new Date(project.updatedAt).toLocaleDateString("es-ES")}</small>
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
      )}
    </main>
  );
}

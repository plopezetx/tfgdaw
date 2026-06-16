import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "../lib/router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ContributionCalendar } from "../components/ContributionCalendar";
import * as api from "../lib/api";

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [projects, setProjects] = useState<api.ProjectSummary[]>([]);

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
  }, []);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const result = await api.updateProfile(username.trim(), email.trim());
      updateUser(result.user);
      toast("Perfil actualizado", "success");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo actualizar el perfil", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("Las contraseñas nuevas no coinciden", "error");
      return;
    }
    setSavingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      toast("Contraseña actualizada", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo cambiar la contraseña", "error");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await api.deleteAccount();
      toast("Cuenta eliminada", "success");
      logout();
      navigate("/login");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo eliminar la cuenta", "error");
      setDeleting(false);
    }
  }

  const totalViews = projects.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const totalLikes = projects.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);
  const publicCount = projects.filter((p) => p.isPublic).length;

  // Actividad por día (creación y última edición de cada proyecto)
  const activity: Record<string, number> = {};
  for (const p of projects) {
    const created = p.createdAt.slice(0, 10);
    const updated = p.updatedAt.slice(0, 10);
    activity[created] = (activity[created] ?? 0) + 1;
    if (updated !== created) activity[updated] = (activity[updated] ?? 0) + 1;
  }

  const mostPopular = [...projects].sort(
    (a, b) =>
      (b.likeCount ?? 0) - (a.likeCount ?? 0) || (b.views ?? 0) - (a.views ?? 0)
  )[0];

  const initials = (user?.username ?? "?").slice(0, 2).toUpperCase();

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Perfil</h1>
          <p>Tu actividad y ajustes de cuenta</p>
        </div>
        <div className="page-actions">
          <button type="button" onClick={() => navigate("/projects")}>
            Volver
          </button>
        </div>
      </header>

      <section className="card profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <strong>{user?.username}</strong>
          <span>{user?.email}</span>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{projects.length}</span>
          <span className="stat-label">Proyectos ({publicCount} públicos)</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalViews}</span>
          <span className="stat-label">Visitas totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalLikes}</span>
          <span className="stat-label">Me gusta totales</span>
        </div>
      </div>

      <section className="card">
        <h2>Actividad</h2>
        <ContributionCalendar activity={activity} />
      </section>

      {mostPopular && (totalLikes > 0 || totalViews > 0) && (
        <section className="card popular-card">
          <h2>Proyecto más popular</h2>
          <div className="popular-row">
            <div>
              <strong>{mostPopular.name}</strong>
              <p>{mostPopular.description || "Sin descripción"}</p>
            </div>
            <div className="stat-row">
              <span className="stat">👁 {mostPopular.views ?? 0}</span>
              <span className="stat">❤️ {mostPopular.likeCount ?? 0}</span>
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <h2>Editar perfil</h2>
        <form onSubmit={handleSaveProfile} className="project-form">
          <label>
            Nombre de usuario
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit" disabled={savingProfile}>
            {savingProfile ? "Guardando…" : "Guardar perfil"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handleChangePassword} className="project-form">
          <label>
            Contraseña actual
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </label>
          <label>
            Nueva contraseña
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
          </label>
          <label>
            Repetir nueva contraseña
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
          </label>
          <button type="submit" disabled={savingPassword}>
            {savingPassword ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </section>

      <section className="card danger-zone">
        <h2>Zona peligrosa</h2>
        {confirmingDelete ? (
          <div className="danger-confirm">
            <p>
              Se borrará tu cuenta y <strong>todos tus proyectos</strong>. Esta
              acción no se puede deshacer.
            </p>
            <div className="project-edit-actions">
              <button
                type="button"
                className="delete-button"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Eliminando…" : "Sí, eliminar mi cuenta"}
              </button>
              <button
                type="button"
                className="action-button"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="delete-button"
            onClick={() => setConfirmingDelete(true)}
          >
            Eliminar mi cuenta
          </button>
        )}
      </section>
    </main>
  );
}

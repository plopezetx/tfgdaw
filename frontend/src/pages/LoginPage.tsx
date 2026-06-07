import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      navigate("/projects", { replace: true });
    } catch (err) {
      setError((err as Error).message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          {mode === "register" && (
            <label>
              Nombre de usuario
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
          )}

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Iniciando..."
                : "Registrando..."
              : mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => setMode("register")}>Registrarse</button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setMode("login")}>Iniciar sesión</button>
            </>
          )}
        </div>

        <div className="auth-hint">
          <p>
            Si aún no has configurado el backend, asegúrate de ejecutar el servidor en{' '}
            <code>http://localhost:3000</code> y fijar <code>VITE_BACKEND_URL</code> si es necesario.
          </p>
          <p>
            <Link to="/projects">Ir a proyectos</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

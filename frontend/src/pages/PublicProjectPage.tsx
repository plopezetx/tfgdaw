/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "../lib/router";
import { FileExplorer } from "../components/FileExplorer";
import { EditorTabs } from "../components/EditorTabs";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { TerminalPanel } from "../components/TerminalPanel";
import { CommentsModal } from "../components/CommentsModal";
import { useWebContainer } from "../hooks/useWebContainer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as api from "../lib/api";
import type { ProjectFile } from "../types/projects";

export function PublicProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState<api.PublicProjectDetail | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState("");
  const [runKey, setRunKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forking, setForking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const { status, serverUrl, logs, isCompatible } = useWebContainer(files, runKey, 0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getPublicProject(slug)
      .then((p) => {
        setProject(p);
        setLikeCount(p.likeCount);
        const projectFiles = p.snapshot?.files ?? [];
        setFiles(projectFiles);
        setActiveFilePath(projectFiles[0]?.path ?? "");

        api
          .getComments(p.slug)
          .then((c) => setCommentCount(c.length))
          .catch(() => {});

        // Si hay sesión, comprobamos si el usuario ya le dio like
        if (user) {
          api
            .getLikeStatus(p.id)
            .then((s) => {
              setLiked(s.liked);
              setLikeCount(s.likeCount);
            })
            .catch(() => {});
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [slug, user]);

  async function handleLike() {
    if (!project) return;
    if (!user) {
      navigate("/login");
      return;
    }

    setLiking(true);
    try {
      const result = await api.toggleLike(project.id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (err) {
      toast((err as Error).message ?? "No se pudo registrar el me gusta", "error");
    } finally {
      setLiking(false);
    }
  }

  async function handleFork() {
    if (!project) return;
    setForking(true);
    try {
      const forked = await api.forkProject(project.id);
      toast("Fork creado en tus proyectos", "success");
      navigate(`/app/${forked.id}`);
    } catch (err) {
      toast((err as Error).message ?? "No se pudo hacer fork", "error");
    } finally {
      setForking(false);
    }
  }

  const activeFile = useMemo(
    () => files.find((f) => f.path === activeFilePath) ?? files[0],
    [files, activeFilePath]
  );

  if (loading) {
    return <main className="page-shell"><p>Cargando proyecto…</p></main>;
  }

  if (error || !project) {
    return (
      <main className="page-shell">
        <p className="form-error">{error ?? "Proyecto no encontrado"}</p>
        <button type="button" className="action-button" onClick={() => navigate("/gallery")}>
          Volver a la galería
        </button>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-title">
          <strong>{project.name}</strong>
          <span className="topbar-owner">
            por{" "}
            <Link className="gallery-owner" to={`/u/${project.owner.username}`}>
              {project.owner.username}
            </Link>
          </span>
          <span className="stat" title="Visitas">👁 {project.views}</span>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className={`like-button${liked ? " like-button--active" : ""}`}
            onClick={handleLike}
            disabled={liking}
            title={user ? (liked ? "Quitar me gusta" : "Me gusta") : "Inicia sesión para dar me gusta"}
          >
            {liked ? "❤️" : "🤍"} {likeCount}
          </button>

          <button
            type="button"
            className="action-button"
            onClick={() => setShowComments(true)}
            title="Ver comentarios"
          >
            💬 {commentCount}
          </button>

          <button
            type="button"
            className="action-button"
            onClick={() => navigate("/gallery")}
          >
            Galería
          </button>

          <button
            type="button"
            className="run-button"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Ejecutar
          </button>

          {user ? (
            <button
              type="button"
              className="action-button"
              onClick={handleFork}
              disabled={forking}
            >
              {forking ? "Copiando…" : "Hacer fork"}
            </button>
          ) : (
            <button
              type="button"
              className="action-button"
              onClick={() => navigate("/login")}
            >
              Inicia sesión para hacer fork
            </button>
          )}
        </div>
      </header>

      {!isCompatible && (
        <div className="compatibility-warning">
          WebContainers requiere un navegador Chromium moderno y aislamiento COOP/COEP.
          La previsualización puede no arrancar.
        </div>
      )}

      <div className="workspace">
        <FileExplorer
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={setActiveFilePath}
        />

        <div className="editor-panel">
          <EditorTabs
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFilePath}
          />
          {activeFile && (
            <CodeEditor file={activeFile} onChange={() => {}} readOnly />
          )}
        </div>

        <div className="right-column">
          <PreviewFrame
            serverUrl={serverUrl}
            status={status}
            onRun={() => setRunKey((k) => k + 1)}
          />
          <TerminalPanel logs={logs} />
        </div>
      </div>

      {showComments && (
        <CommentsModal
          slug={project.slug}
          projectId={project.id}
          ownerId={project.owner.id}
          onClose={() => setShowComments(false)}
          onCountChange={setCommentCount}
        />
      )}
    </main>
  );
}

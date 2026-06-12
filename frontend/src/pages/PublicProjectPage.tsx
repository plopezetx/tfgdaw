/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "../lib/router";
import { FileExplorer } from "../components/FileExplorer";
import { EditorTabs } from "../components/EditorTabs";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { TerminalPanel } from "../components/TerminalPanel";
import { useWebContainer } from "../hooks/useWebContainer";
import { useAuth } from "../context/AuthContext";
import * as api from "../lib/api";
import type { ProjectFile } from "../types/projects";

export function PublicProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<api.PublicProjectDetail | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState("");
  const [runKey, setRunKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forking, setForking] = useState(false);

  const { status, serverUrl, logs, isCompatible } = useWebContainer(files, runKey, 0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getPublicProject(slug)
      .then((p) => {
        setProject(p);
        const projectFiles = p.snapshot?.files ?? [];
        setFiles(projectFiles);
        setActiveFilePath(projectFiles[0]?.path ?? "");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleFork() {
    if (!project) return;
    setForking(true);
    try {
      const forked = await api.forkProject(project.id);
      navigate(`/app/${forked.id}`);
    } catch (err) {
      setError((err as Error).message);
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
          <span className="topbar-owner">por {project.owner.username}</span>
        </div>

        <div className="topbar-actions">
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
          <PreviewFrame serverUrl={serverUrl} status={status} />
          <TerminalPanel logs={logs} />
        </div>
      </div>
    </main>
  );
}

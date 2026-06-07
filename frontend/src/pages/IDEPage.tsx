import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileExplorer } from "../components/FileExplorer";
import { EditorTabs } from "../components/EditorTabs";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { TerminalPanel } from "../components/TerminalPanel";
import { AIPanel } from "../components/AIPanel";
import { useWebContainer } from "../hooks/useWebContainer";
import { initialFiles } from "../data/initialFiles";
import { createProjectFile, renameProjectFile } from "../utils/projectFiles";
import { useAuth } from "../context/AuthContext";
import * as api from "../lib/api";
import type { ProjectFile } from "../types/projects";

export function IDEPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [activeFilePath, setActiveFilePath] = useState<string>("/index.html");
  const [runKey, setRunKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [saveLabel, setSaveLabel] = useState<"idle" | "saved">("idle");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [bottomPanel, setBottomPanel] = useState<"terminal" | "ai">("terminal");
  const [editorSelection, setEditorSelection] = useState<string>("");
  const saveLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status, serverUrl, logs, isCompatible } = useWebContainer(
    files,
    runKey,
    resetKey
  );

  useEffect(() => {
    if (!projectId) {
      setError("ID de proyecto inválido");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .getProject(projectId)
      .then((project) => {
        setProjectName(project.name);
        setProjectSlug(project.slug);
        setIsPublic(project.isPublic);
        const nextFiles = project.snapshot?.files ?? initialFiles;
        setFiles(nextFiles.length > 0 ? nextFiles : initialFiles);
        setActiveFilePath(nextFiles[0]?.path ?? "/index.html");
      })
      .catch((err) => {
        setError((err as Error).message ?? "No se pudo cargar el proyecto");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    if (saveLabel === "saved") return;

    const timer = setTimeout(() => {
      api.saveSnapshot(projectId, files).catch(() => {
        // Silenciar el error automático; el usuario puede usar Guardar manual.
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [files, projectId, saveLabel]);

  function handleChangeFileContent(newContent: string) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.path === activeFilePath ? { ...file, content: newContent } : file
      )
    );
  }

  async function handleSave() {
    if (!projectId) return;

    setSaving(true);
    setError(null);

    try {
      await api.saveSnapshot(projectId, files);
      setSaveLabel("saved");

      if (saveLabelTimerRef.current) {
        clearTimeout(saveLabelTimerRef.current);
      }

      saveLabelTimerRef.current = setTimeout(() => setSaveLabel("idle"), 2000);
    } catch (err) {
      setError((err as Error).message ?? "Error al guardar el proyecto");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublic() {
    if (!projectId) return;
    setTogglingPublic(true);
    try {
      const updated = await api.updateProject(projectId, { isPublic: !isPublic });
      setIsPublic(updated.isPublic);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setTogglingPublic(false);
    }
  }

  function handleCopyPublicUrl() {
    if (!projectSlug) return;
    const url = `${window.location.origin}/p/${projectSlug}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  function handleNewProject() {
    if (!confirm("Crear un nuevo proyecto? Se perderá el trabajo actual.")) return;

    setFiles(initialFiles);
    setActiveFilePath("/index.html");
    setRunKey((current) => current + 1);
  }

  function handleCreateFile() {
    const path = prompt("Ruta del nuevo archivo", "/src/new-file.js");
    if (!path) return;

    const nextFile = createProjectFile(path);

    if (!nextFile) {
      alert("La ruta no es válida.");
      return;
    }

    if (files.some((file) => file.path === nextFile.path)) {
      alert("Ya existe un archivo con esa ruta.");
      return;
    }

    setFiles((currentFiles) => [...currentFiles, nextFile]);
    setActiveFilePath(nextFile.path);
  }

  function handleRenameFile(path: string) {
    const file = files.find((candidate) => candidate.path === path);
    if (!file) return;

    const nextPath = prompt("Nueva ruta del archivo", file.path);
    if (!nextPath || nextPath === file.path) return;

    const renamedFile = renameProjectFile(file, nextPath);

    if (!renamedFile) {
      alert("La ruta no es válida.");
      return;
    }

    if (files.some((candidate) => candidate.path === renamedFile.path)) {
      alert("Ya existe un archivo con esa ruta.");
      return;
    }

    setFiles((currentFiles) =>
      currentFiles.map((candidate) =>
        candidate.path === path ? renamedFile : candidate
      )
    );

    if (activeFilePath === path) {
      setActiveFilePath(renamedFile.path);
    }
  }

  function handleDeleteFile(path: string) {
    if (files.length <= 1) {
      alert("El proyecto debe mantener al menos un archivo.");
      return;
    }

    if (!confirm(`Eliminar ${path}?`)) return;

    const nextFiles = files.filter((file) => file.path !== path);
    setFiles(nextFiles);

    if (activeFilePath === path) {
      setActiveFilePath(nextFiles[0]?.path ?? "/index.html");
    }
  }

  const activeFile = useMemo(
    () => files.find((file) => file.path === activeFilePath) ?? files[0],
    [files, activeFilePath]
  );

  if (loading) {
    return (
      <main className="page-shell">
        <p>Cargando proyecto…</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-title">
          <strong>{projectName || "IDE Web"}</strong>
        </div>

        <div className="topbar-actions">
          <button className="action-button" onClick={() => navigate("/projects")}>Volver</button>
          <button className="action-button" onClick={handleSave} disabled={saving}>
            {saveLabel === "saved" ? "Guardado ✓" : "Guardar"}
          </button>
          <button
            className={`action-button${isPublic ? " action-button-active" : ""}`}
            onClick={handleTogglePublic}
            disabled={togglingPublic}
            title={isPublic ? "Hacer privado" : "Publicar en galería"}
          >
            {isPublic ? "Público" : "Privado"}
          </button>
          {isPublic && (
            <button
              className="action-button"
              onClick={handleCopyPublicUrl}
              title="Copiar enlace público"
            >
              Copiar enlace
            </button>
          )}
          <button className="action-button" onClick={() => setResetKey((current) => current + 1)}>
            Reset
          </button>
          <button
            className={`action-button${bottomPanel === "ai" ? " action-button-active" : ""}`}
            onClick={() => setBottomPanel((p) => p === "ai" ? "terminal" : "ai")}
            title="Asistente de IA"
          >
            IA
          </button>
          <button className="run-button" onClick={() => setRunKey((key) => key + 1)}>
            Ejecutar
          </button>
          <button className="action-button" onClick={() => logout()}>
            Salir
          </button>
        </div>
      </header>

      {error && <div className="compatibility-warning">{error}</div>}

      {!isCompatible && (
        <div className="compatibility-warning">
          WebContainers requiere un navegador Chromium moderno y aislamiento COOP/COEP.
          La edición sigue disponible, pero la ejecución puede no arrancar.
        </div>
      )}

      <div className="workspace">
        <FileExplorer
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={setActiveFilePath}
          onCreateFile={handleCreateFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />

        <div className="editor-panel">
          <EditorTabs
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFilePath}
          />
          <CodeEditor file={activeFile} onChange={handleChangeFileContent} />
        </div>

        <div className="right-column">
          <PreviewFrame serverUrl={serverUrl} status={status} />

          <div className="bottom-panel-tabs">
            <button
              className={`panel-tab${bottomPanel === "terminal" ? " panel-tab--active" : ""}`}
              onClick={() => setBottomPanel("terminal")}
            >
              Terminal
            </button>
            <button
              className={`panel-tab${bottomPanel === "ai" ? " panel-tab--active" : ""}`}
              onClick={() => setBottomPanel("ai")}
            >
              IA Asistente
            </button>
          </div>

          {bottomPanel === "terminal" ? (
            <TerminalPanel logs={logs} />
          ) : (
            <AIPanel
              fileContent={activeFile?.content ?? ""}
              fileName={activeFile?.path ?? ""}
              selection={editorSelection || undefined}
              onApplyCode={(code) => handleChangeFileContent(code)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

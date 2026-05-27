import { useEffect, useMemo, useRef, useState } from "react";
import { FileExplorer } from "./components/FileExplorer";
import { EditorTabs } from "./components/EditorTabs";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewFrame } from "./components/PreviewFrame";
import { TerminalPanel } from "./components/TerminalPanel";
import { useWebContainer } from "./hooks/useWebContainer";
import { initialFiles } from "./data/initialFiles";
import { saveProject, loadProject, clearProject } from "./utils/storage";
import { createProjectFile, renameProjectFile } from "./utils/projectFiles";
import type { ProjectFile } from "./types/projects";

function App() {
  const [files, setFiles] = useState<ProjectFile[]>(
    () => loadProject() ?? initialFiles
  );
  const [activeFilePath, setActiveFilePath] = useState<string>("/index.html");
  const [runKey, setRunKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [saveLabel, setSaveLabel] = useState<"idle" | "saved">("idle");
  const saveLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status, serverUrl, logs, isCompatible } = useWebContainer(
    files,
    runKey,
    resetKey
  );

  const activeFile = useMemo(
    () => files.find((file) => file.path === activeFilePath) ?? files[0],
    [files, activeFilePath]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(files);
    }, 1000);

    return () => clearTimeout(timer);
  }, [files]);

  function handleChangeFileContent(newContent: string) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.path === activeFilePath ? { ...file, content: newContent } : file
      )
    );
  }

  function handleSave() {
    saveProject(files);
    setSaveLabel("saved");

    if (saveLabelTimerRef.current) {
      clearTimeout(saveLabelTimerRef.current);
    }

    saveLabelTimerRef.current = setTimeout(() => setSaveLabel("idle"), 2000);
  }

  function handleNewProject() {
    if (!confirm("Crear un nuevo proyecto? Se perdera el trabajo actual.")) return;

    clearProject();
    setFiles(initialFiles);
    setActiveFilePath("/index.html");
    setRunKey((current) => current + 1);
  }

  function handleCreateFile() {
    const path = prompt("Ruta del nuevo archivo", "/src/new-file.js");
    if (!path) return;

    const nextFile = createProjectFile(path);

    if (!nextFile) {
      alert("La ruta no es valida.");
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
      alert("La ruta no es valida.");
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-title">
          <strong>IDE Web</strong>
        </div>

        <div className="topbar-actions">
          <button className="action-button" onClick={handleNewProject}>
            Nuevo
          </button>
          <button className="action-button" onClick={handleSave}>
            {saveLabel === "saved" ? "Guardado" : "Guardar"}
          </button>
          <button
            className="action-button"
            onClick={() => setResetKey((current) => current + 1)}
          >
            Reset runtime
          </button>
          <button className="run-button" onClick={() => setRunKey((key) => key + 1)}>
            Ejecutar
          </button>
        </div>
      </header>

      {!isCompatible && (
        <div className="compatibility-warning">
          WebContainers requiere un navegador Chromium moderno y aislamiento COOP/COEP.
          La edicion sigue disponible, pero la ejecucion puede no arrancar.
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
          <TerminalPanel logs={logs} />
        </div>
      </div>
    </main>
  );
}

export default App;

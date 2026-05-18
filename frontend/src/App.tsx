import { useEffect, useMemo, useRef, useState } from "react";
import { FileExplorer } from "./components/FileExplorer";
import { EditorTabs } from "./components/EditorTabs";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewFrame } from "./components/PreviewFrame";
import { TerminalPanel } from "./components/TerminalPanel";
import { useWebContainer } from "./hooks/useWebContainer";
import { initialFiles } from "./data/initialFiles";
import { saveProject, loadProject, clearProject } from "./utils/storage";
import type { ProjectFile } from "./types/projects";

function App() {
  const [files, setFiles] = useState<ProjectFile[]>(
    () => loadProject() ?? initialFiles
  );
  const [activeFilePath, setActiveFilePath] = useState<string>("/index.html");
  const [runKey, setRunKey] = useState(0);
  const [saveLabel, setSaveLabel] = useState<"idle" | "saved">("idle");
  const saveLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status, serverUrl, logs } = useWebContainer(files, runKey);

  const activeFile = useMemo(
    () => files.find((f) => f.path === activeFilePath) ?? files[0],
    [files, activeFilePath]
  );

  // Autosave: 1 segundo después del último cambio en archivos
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(files);
    }, 1000);
    return () => clearTimeout(timer);
  }, [files]);

  function handleChangeFileContent(newContent: string) {
    setFiles((current) =>
      current.map((f) =>
        f.path === activeFilePath ? { ...f, content: newContent } : f
      )
    );
  }

  function handleSave() {
    saveProject(files);
    setSaveLabel("saved");
    if (saveLabelTimerRef.current) clearTimeout(saveLabelTimerRef.current);
    saveLabelTimerRef.current = setTimeout(() => setSaveLabel("idle"), 2000);
  }

  function handleNewProject() {
    if (!confirm("¿Crear un nuevo proyecto? Se perderá el trabajo actual.")) return;
    clearProject();
    setFiles(initialFiles);
    setActiveFilePath("/index.html");
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
            {saveLabel === "saved" ? "Guardado ✓" : "Guardar"}
          </button>
          <button className="run-button" onClick={() => setRunKey((k) => k + 1)}>
            Ejecutar
          </button>
        </div>
      </header>

      <div className="workspace">
        <FileExplorer
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={setActiveFilePath}
        />

        <div className="editor-panel">
          <EditorTabs activeFile={activeFile} />
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

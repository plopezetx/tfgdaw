import { useMemo, useState } from "react";
import { FileExplorer } from "./components/FileExplorer";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { TerminalPanel } from "./components/TerminalPanel";
import { WebContainerRunner } from "./components/WebContainerRunner";
import { initialFiles } from "./data/initialFiles";
import type { ProjectFile } from "./types/projects";

function App() {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [activeFilePath, setActiveFilePath] = useState<string>("/index.html");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    "> Proyecto cargado correctamente",
    "> Preview inicial generada",
  ]);

  const activeFile = useMemo(() => {
    return files.find((file) => file.path === activeFilePath) ?? files[0];
  }, [files, activeFilePath]);

  function handleChangeFileContent(newContent: string) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.path === activeFilePath
          ? {
              ...file,
              content: newContent,
            }
          : file
      )
    );
  }

  function handleRunProject() {
    setRefreshKey((currentKey) => currentKey + 1);

    setLogs((currentLogs) => [
      ...currentLogs,
      "> Ejecutando proyecto...",
      "> Preview actualizada correctamente",
    ]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <strong>IDE Web Colaborativo</strong>
          <span>Spike técnico Fase 1</span>
        </div>

        <button className="run-button" onClick={handleRunProject}>
          Ejecutar
        </button>
      </header>

      <div className="workspace">
        <FileExplorer
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={setActiveFilePath}
        />

        <CodeEditor file={activeFile} onChange={handleChangeFileContent} />

        <div className="right-column">
          <PreviewPanel files={files} refreshKey={refreshKey} />
          <TerminalPanel logs={logs} />
        </div>
      </div>

      <WebContainerRunner />
    </main>
  );
}

export default App;
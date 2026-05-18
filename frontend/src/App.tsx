import { useMemo, useState } from "react";
import { FileExplorer } from "./components/FileExplorer";
import { EditorTabs } from "./components/EditorTabs";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewFrame } from "./components/PreviewFrame";
import { TerminalPanel } from "./components/TerminalPanel";
import { useWebContainer } from "./hooks/useWebContainer";
import { initialFiles } from "./data/initialFiles";
import type { ProjectFile } from "./types/projects";

function App() {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [activeFilePath, setActiveFilePath] = useState<string>("/index.html");
  const [runKey, setRunKey] = useState(0);

  const { status, serverUrl, logs } = useWebContainer(files, runKey);

  const activeFile = useMemo(
    () => files.find((f) => f.path === activeFilePath) ?? files[0],
    [files, activeFilePath]
  );

  function handleChangeFileContent(newContent: string) {
    setFiles((current) =>
      current.map((f) =>
        f.path === activeFilePath ? { ...f, content: newContent } : f
      )
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-title">
          <strong>IDE Web</strong>
        </div>
        <button className="run-button" onClick={() => setRunKey((k) => k + 1)}>
          Ejecutar
        </button>
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

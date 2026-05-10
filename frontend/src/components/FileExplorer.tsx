import type { ProjectFile } from "../types/projects";

type FileExplorerProps = {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
};

export function FileExplorer({
  files,
  activeFilePath,
  onSelectFile,
}: FileExplorerProps) {
  return (
    <aside className="file-explorer">
      <div className="panel-title">Archivos</div>

      {files.map((file) => (
        <button
          key={file.path}
          className={
            file.path === activeFilePath
              ? "file-button file-button-active"
              : "file-button"
          }
          onClick={() => onSelectFile(file.path)}
        >
          {file.name}
        </button>
      ))}
    </aside>
  );
}
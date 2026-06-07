import type { ProjectFile } from "../types/projects";

type FileExplorerProps = {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile?: () => void;
  onRenameFile?: (path: string) => void;
  onDeleteFile?: (path: string) => void;
};

export function FileExplorer({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  return (
    <aside className="file-explorer">
      <div className="panel-title explorer-title">
        <span>Archivos</span>
        {onCreateFile && (
          <button className="icon-action" onClick={onCreateFile} title="Nuevo archivo">
            +
          </button>
        )}
      </div>

      <div className="file-list">
        {sortedFiles.map((file) => (
          <div
            key={file.path}
            className={
              file.path === activeFilePath
                ? "file-row file-row-active"
                : "file-row"
            }
          >
            <button className="file-button" onClick={() => onSelectFile(file.path)}>
              <span className="file-name">{file.name}</span>
              <span className="file-path">{file.path}</span>
            </button>

            {(onRenameFile || onDeleteFile) && (
              <div className="file-actions">
                {onRenameFile && (
                  <button
                    className="icon-action"
                    onClick={() => onRenameFile(file.path)}
                    title="Renombrar"
                  >
                    R
                  </button>
                )}
                {onDeleteFile && (
                  <button
                    className="icon-action danger-action"
                    onClick={() => onDeleteFile(file.path)}
                    title="Eliminar"
                  >
                    x
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

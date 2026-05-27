import type { ProjectFile } from "../types/projects";

type EditorTabsProps = {
  files: ProjectFile[];
  activeFile: ProjectFile;
  onSelectFile: (path: string) => void;
};

export function EditorTabs({ files, activeFile, onSelectFile }: EditorTabsProps) {
  return (
    <div className="editor-tabs">
      {files.map((file) => (
        <button
          key={file.path}
          className={
            file.path === activeFile.path
              ? "editor-tab editor-tab-active"
              : "editor-tab"
          }
          onClick={() => onSelectFile(file.path)}
          title={file.path}
        >
          {file.name}
        </button>
      ))}
    </div>
  );
}

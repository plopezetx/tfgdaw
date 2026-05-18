import type { ProjectFile } from "../types/projects";

type EditorTabsProps = {
  activeFile: ProjectFile;
};

export function EditorTabs({ activeFile }: EditorTabsProps) {
  return (
    <div className="editor-tabs">
      <span className="editor-tab editor-tab-active">{activeFile.name}</span>
    </div>
  );
}

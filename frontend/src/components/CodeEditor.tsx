import Editor from "@monaco-editor/react";
import type { ProjectFile } from "../types/projects";

type CodeEditorProps = {
  file: ProjectFile;
  onChange: (newContent: string) => void;
};

export function CodeEditor({ file, onChange }: CodeEditorProps) {
  return (
    <section className="code-editor">
      <div className="panel-title">{file.path}</div>

      <Editor
        height="100%"
        language={file.language}
        value={file.content}
        theme="vs-dark"
        onChange={(value) => onChange(value ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </section>
  );
}

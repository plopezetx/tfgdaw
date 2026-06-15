import { useState } from "react";
import Editor from "@monaco-editor/react";
import { marked } from "marked";
import type { ProjectFile } from "../types/projects";
import { canFormat, formatCode } from "../utils/formatCode";
import { useTheme } from "../context/ThemeContext";

type CodeEditorProps = {
  file: ProjectFile;
  onChange: (newContent: string) => void;
  readOnly?: boolean;
};

const MIN_FONT = 11;
const MAX_FONT = 22;

export function CodeEditor({ file, onChange, readOnly = false }: CodeEditorProps) {
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState(14);
  const [showPreview, setShowPreview] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [formatError, setFormatError] = useState(false);

  const isMarkdown = file.language === "markdown";
  const formattable = !readOnly && canFormat(file.language);
  const lineCount = file.content ? file.content.split("\n").length : 0;
  const charCount = file.content.length;

  async function handleFormat() {
    setFormatting(true);
    setFormatError(false);
    try {
      const formatted = await formatCode(file.content, file.language);
      if (formatted !== file.content) onChange(formatted);
    } catch {
      // Normalmente por errores de sintaxis en el código
      setFormatError(true);
      setTimeout(() => setFormatError(false), 2500);
    } finally {
      setFormatting(false);
    }
  }

  return (
    <section className="code-editor">
      <div className="panel-title code-editor-bar">
        <span className="code-editor-path">{file.path}</span>

        <div className="code-editor-actions">
          {isMarkdown && (
            <button
              type="button"
              className={`mini-button${showPreview ? " mini-button--active" : ""}`}
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? "Código" : "Vista previa"}
            </button>
          )}
          {formattable && (
            <button
              type="button"
              className="mini-button"
              onClick={handleFormat}
              disabled={formatting}
              title="Formatear el archivo con Prettier"
            >
              {formatError ? "Error de sintaxis" : formatting ? "Formateando…" : "Formatear"}
            </button>
          )}
        </div>
      </div>

      <div className="code-editor-main">
        {isMarkdown && showPreview ? (
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: marked.parse(file.content) as string }}
          />
        ) : (
          <Editor
            height="100%"
            language={file.language}
            value={file.content}
            theme={theme === "dark" ? "vs-dark" : "light"}
            onChange={(value) => onChange(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize,
              wordWrap: "on",
              automaticLayout: true,
              readOnly,
            }}
          />
        )}
      </div>

      <div className="code-editor-status">
        <span>{file.language}</span>
        <span>{lineCount} líneas · {charCount} caracteres</span>
        <div className="font-controls">
          <button
            type="button"
            className="mini-button"
            onClick={() => setFontSize((s) => Math.max(MIN_FONT, s - 1))}
            title="Reducir fuente"
          >
            A−
          </button>
          <span className="font-size-label">{fontSize}px</span>
          <button
            type="button"
            className="mini-button"
            onClick={() => setFontSize((s) => Math.min(MAX_FONT, s + 1))}
            title="Aumentar fuente"
          >
            A+
          </button>
        </div>
      </div>
    </section>
  );
}

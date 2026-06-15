import { useEffect, useRef } from "react";
import type { PreviewLog } from "../hooks/usePreviewConsole";

type PreviewConsoleProps = {
  logs: PreviewLog[];
  onClear: () => void;
};

export function PreviewConsole({ logs, onClear }: PreviewConsoleProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <section className="preview-console">
      <div className="preview-console-bar">
        <span>{logs.length} mensaje(s)</span>
        <button type="button" className="mini-button" onClick={onClear}>
          Limpiar
        </button>
      </div>

      <div className="preview-console-content">
        {logs.length === 0 && (
          <p className="console-empty">
            Aquí aparecen los console.log y errores de tu programa al ejecutarlo.
          </p>
        )}
        {logs.map((log, index) => (
          <div key={index} className={`console-line console-line--${log.level}`}>
            <span className="console-level">{log.level}</span>
            <span className="console-text">{log.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

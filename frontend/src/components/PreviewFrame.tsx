import { useState } from "react";

type PreviewFrameProps = {
  serverUrl: string | null;
  status: string;
  onRun: () => void;
};

export function PreviewFrame({ serverUrl, status, onRun }: PreviewFrameProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={`preview-panel${expanded ? " preview-panel--expanded" : ""}`}>
      <div className="panel-title">
        <span>Preview</span>
        <div className="preview-title-right">
          <span className="preview-status">{status}</span>
          <button
            type="button"
            className="preview-expand"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Salir de pantalla completa" : "Ver en grande"}
          >
            {expanded ? "✕ Cerrar" : "⛶ Ampliar"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="preview-toolbar">
          <button type="button" className="preview-run" onClick={onRun}>
            ▶ Ejecutar
          </button>
          <button
            type="button"
            className="preview-close"
            onClick={() => setExpanded(false)}
          >
            ✕ Cerrar
          </button>
        </div>
      )}

      {serverUrl ? (
        <iframe
          title="preview"
          className="preview-frame"
          src={serverUrl}
        />
      ) : (
        <div className="preview-placeholder">
          {status}
        </div>
      )}
    </section>
  );
}

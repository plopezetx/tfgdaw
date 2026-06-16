import { useMemo, useState } from "react";
import type { ProjectFile } from "../types/projects";

type SearchInFilesModalProps = {
  files: ProjectFile[];
  onOpenFile: (path: string) => void;
  onClose: () => void;
};

type Match = {
  path: string;
  line: number;
  text: string;
};

export function SearchInFilesModal({
  files,
  onOpenFile,
  onClose,
}: SearchInFilesModalProps) {
  const [query, setQuery] = useState("");

  const matches = useMemo<Match[]>(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];

    const result: Match[] = [];
    for (const file of files) {
      const lines = file.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(term)) {
          result.push({ path: file.path, line: i + 1, text: lines[i].trim() });
          if (result.length >= 100) return result;
        }
      }
    }
    return result;
  }, [query, files]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Buscar en archivos</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          className="search-input search-modal-input"
          value={query}
          autoFocus
          placeholder="Texto a buscar en todos los archivos…"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />

        <div className="search-results">
          {query.trim().length >= 2 && matches.length === 0 && (
            <p className="comment-empty">Sin coincidencias.</p>
          )}
          {matches.length > 0 && (
            <p className="search-count">{matches.length} coincidencia(s)</p>
          )}
          {matches.map((match, i) => (
            <button
              key={i}
              type="button"
              className="search-result"
              onClick={() => {
                onOpenFile(match.path);
                onClose();
              }}
            >
              <span className="search-result-path">
                {match.path}:{match.line}
              </span>
              <span className="search-result-text">{match.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

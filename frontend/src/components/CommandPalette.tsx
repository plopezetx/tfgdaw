import { useMemo, useState } from "react";
import type { ProjectFile } from "../types/projects";

export type Command = {
  label: string;
  run: () => void;
};

type CommandPaletteProps = {
  files: ProjectFile[];
  commands: Command[];
  onOpenFile: (path: string) => void;
  onClose: () => void;
};

type Item = {
  key: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette({
  files,
  commands,
  onOpenFile,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const items = useMemo<Item[]>(() => {
    const term = query.trim().toLowerCase();

    const commandItems: Item[] = commands.map((c) => ({
      key: `cmd:${c.label}`,
      label: c.label,
      hint: "Comando",
      run: c.run,
    }));

    const fileItems: Item[] = files.map((f) => ({
      key: `file:${f.path}`,
      label: f.path,
      hint: "Archivo",
      run: () => onOpenFile(f.path),
    }));

    const all = [...commandItems, ...fileItems];
    if (!term) return all;
    return all.filter((item) => item.label.toLowerCase().includes(term));
  }, [query, files, commands, onOpenFile]);

  function runItem(item: Item) {
    item.run();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--palette" onClick={(e) => e.stopPropagation()}>
        <input
          className="search-input search-modal-input"
          value={query}
          autoFocus
          placeholder="Escribe un archivo o comando…"
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((s) => Math.min(s + 1, items.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected((s) => Math.max(s - 1, 0));
            }
            if (e.key === "Enter" && items[selected]) {
              e.preventDefault();
              runItem(items[selected]);
            }
          }}
        />

        <div className="palette-list">
          {items.length === 0 && <p className="comment-empty">Sin resultados.</p>}
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              className={`palette-item${i === selected ? " palette-item--active" : ""}`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => runItem(item)}
            >
              <span className="palette-label">{item.label}</span>
              <span className="palette-hint">{item.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

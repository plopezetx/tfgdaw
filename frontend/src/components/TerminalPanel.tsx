import { useEffect, useRef } from "react";

type TerminalPanelProps = {
  logs: string[];
};

// Elimina las secuencias de escape ANSI (colores, control de cursor) que
// WebContainers emite y que de otro modo se mostrarian como texto basura
// del tipo "[32m" o "[2K". Cubre el caracter ESC () y sus codigos.
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = new RegExp("\\u001b\\[[0-9;?]*[A-Za-z]|\\[[0-9;]+[A-Za-z]", "g");

function cleanLog(log: string): string {
  return log.replace(ANSI_PATTERN, "");
}

export function TerminalPanel({ logs }: TerminalPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <section className="terminal-panel">
      <div className="terminal-content">
        {logs.map((log, index) => (
          <div key={index}>{cleanLog(log)}</div>
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

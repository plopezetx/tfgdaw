import { useEffect, useRef } from "react";

type TerminalPanelProps = {
  logs: string[];
};

export function TerminalPanel({ logs }: TerminalPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <section className="terminal-panel">
      <div className="panel-title">Terminal</div>

      <div className="terminal-content">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}
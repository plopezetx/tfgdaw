type TerminalPanelProps = {
  logs: string[];
};

export function TerminalPanel({ logs }: TerminalPanelProps) {
  return (
    <section className="terminal-panel">
      <div className="panel-title">Terminal</div>

      <div className="terminal-content">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </section>
  );
}
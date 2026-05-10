import { useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { webcontainerProject } from "../data/webcontainerProject";

export function WebContainerRunner() {
  const webcontainerRef = useRef<WebContainer | null>(null);
  const hasBootedRef = useRef(false);

  const [status, setStatus] = useState("WebContainer sin iniciar");
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    setLogs((currentLogs) => [...currentLogs, message]);
  }

  useEffect(() => {
    async function bootWebContainer() {
      if (hasBootedRef.current) return;

      try {
        hasBootedRef.current = true;

        setStatus("Arrancando WebContainer...");
        addLog("> Booting WebContainer");

        const webcontainer = await WebContainer.boot();
        webcontainerRef.current = webcontainer;

        setStatus("Montando archivos...");
        addLog("> Mounting project files");

        await webcontainer.mount(webcontainerProject);

        setStatus("Instalando dependencias...");
        addLog("> npm install");

        const installProcess = await webcontainer.spawn("npm", ["install"]);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              addLog(data);
            },
          })
        );

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          setStatus("Error instalando dependencias");
          addLog(`> npm install failed with exit code ${installExitCode}`);
          return;
        }

        setStatus("Arrancando servidor de desarrollo...");
        addLog("> npm run start");

        webcontainer.on("server-ready", (_port, url) => {
          setServerUrl(url);
          setStatus("Servidor listo");
          addLog(`> Server ready at ${url}`);
        });

        const startProcess = await webcontainer.spawn("npm", ["run", "start"]);

        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              addLog(data);
            },
          })
        );
      } catch (error) {
        console.error(error);
        setStatus("Error arrancando WebContainer");
        addLog(`> Error: ${String(error)}`);
      }
    }

    bootWebContainer();
  }, []);

  return (
    <section className="webcontainer-runner">
      <div className="panel-title">WebContainer real</div>

      <div className="webcontainer-status">
        <strong>Estado:</strong> {status}
      </div>

      {serverUrl ? (
        <iframe
          title="webcontainer-preview"
          className="webcontainer-preview"
          src={serverUrl}
        />
      ) : (
        <div className="webcontainer-placeholder">
          Esperando a que el servidor esté listo...
        </div>
      )}

      <div className="webcontainer-logs">
        {logs.map((log, index) => (
          <pre key={index}>{log}</pre>
        ))}
      </div>
    </section>
  );
}
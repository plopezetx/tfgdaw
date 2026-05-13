import { useEffect, useRef, useState } from "react";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import type { ProjectFile } from "../types/projects";
import { createRunnableFileSystemTree } from "../utils/projectToFileSystemTree";

type WebContainerRunnerProps = {
  files: ProjectFile[];
  runKey: number;
};

export function WebContainerRunner({ files, runKey }: WebContainerRunnerProps) {
  const webcontainerRef = useRef<WebContainer | null>(null);
  const hasBootedRef = useRef(false);
  const filesRef = useRef<ProjectFile[]>(files);
  const currentRunRef = useRef(0);
  const startProcessRef = useRef<WebContainerProcess | null>(null);

  const [status, setStatus] = useState("WebContainer sin iniciar");
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    setLogs((currentLogs) => [...currentLogs, message]);
  }

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    async function bootAndRunProject() {
      const runId = currentRunRef.current + 1;
      currentRunRef.current = runId;

      try {
        let webcontainer = webcontainerRef.current;

        if (!hasBootedRef.current) {
          hasBootedRef.current = true;

          setStatus("Arrancando WebContainer...");
          addLog("> Booting WebContainer");

          webcontainer = await WebContainer.boot();
          webcontainerRef.current = webcontainer;

          webcontainer.on("server-ready", (_port, url) => {
            setServerUrl(url);
            setStatus("Servidor listo");
            addLog(`> Server ready at ${url}`);
          });
        }

        if (!webcontainer) {
          return;
        }

        startProcessRef.current?.kill();
        startProcessRef.current = null;
        setServerUrl(null);

        setStatus("Montando archivos...");
        addLog("> Mounting editor files");

        await webcontainer.mount(createRunnableFileSystemTree(filesRef.current));

        setStatus("Instalando dependencias...");
        addLog("> npm install");

        const installProcess = await webcontainer.spawn("npm", ["install"]);

        installProcess.output
          .pipeTo(
            new WritableStream({
              write(data) {
                addLog(data);
              },
            })
          )
          .catch(() => {
            addLog("> Install output stream closed");
          });

        const installExitCode = await installProcess.exit;

        if (currentRunRef.current !== runId) {
          return;
        }

        if (installExitCode !== 0) {
          setStatus("Error instalando dependencias");
          addLog(`> npm install failed with exit code ${installExitCode}`);
          return;
        }

        setStatus("Arrancando servidor de desarrollo...");
        addLog("> npm run start");

        const startProcess = await webcontainer.spawn("npm", ["run", "start"]);
        startProcessRef.current = startProcess;

        startProcess.output
          .pipeTo(
            new WritableStream({
              write(data) {
                addLog(data);
              },
            })
          )
          .catch(() => {
            addLog("> Runtime output stream closed");
          });
      } catch (error) {
        console.error(error);
        setStatus("Error arrancando WebContainer");
        addLog(`> Error: ${String(error)}`);
      }
    }

    bootAndRunProject();
  }, [runKey]);

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

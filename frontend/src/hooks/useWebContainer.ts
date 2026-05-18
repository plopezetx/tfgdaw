import { useEffect, useRef, useState } from "react";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import type { ProjectFile } from "../types/projects";
import { createRunnableFileSystemTree } from "../utils/projectToFileSystemTree";

export function useWebContainer(
  files: ProjectFile[],
  runKey: number
): {
  status: string;
  serverUrl: string | null;
  logs: string[];
} {
  const webcontainerRef = useRef<WebContainer | null>(null);
  const hasBootedRef = useRef(false);
  const filesRef = useRef<ProjectFile[]>(files);
  const currentRunRef = useRef(0);
  const startProcessRef = useRef<WebContainerProcess | null>(null);

  const [status, setStatus] = useState("Esperando ejecución...");
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    setLogs((prev) => [...prev, message]);
  }

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    async function bootAndRun() {
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
            addLog(`> Servidor listo en ${url}`);
          });
        }

        if (!webcontainer) return;

        startProcessRef.current?.kill();
        startProcessRef.current = null;
        setServerUrl(null);

        setStatus("Montando archivos...");
        addLog("> Montando archivos del editor");
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
            addLog("> Stream de instalación cerrado");
          });

        const installExitCode = await installProcess.exit;

        if (currentRunRef.current !== runId) return;

        if (installExitCode !== 0) {
          setStatus("Error instalando dependencias");
          addLog(`> npm install falló (código ${installExitCode})`);
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
            addLog("> Stream del servidor cerrado");
          });
      } catch (error) {
        console.error(error);
        setStatus("Error en WebContainer");
        addLog(`> Error: ${String(error)}`);
      }
    }

    bootAndRun();
  }, [runKey]);

  return { status, serverUrl, logs };
}

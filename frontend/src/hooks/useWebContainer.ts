import { useEffect, useRef, useState } from "react";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import type { ProjectFile } from "../types/projects";
import { createRunnableFileSystemTree } from "../utils/projectToFileSystemTree";

type WebContainerState = {
  status: string;
  serverUrl: string | null;
  logs: string[];
  isCompatible: boolean;
};

function getPackageJsonContent(files: ProjectFile[]): string {
  return files.find((file) => file.path === "/package.json")?.content ?? "";
}

function canRunWebContainers(): boolean {
  return Boolean(window.crossOriginIsolated && window.SharedArrayBuffer);
}

export function useWebContainer(
  files: ProjectFile[],
  runKey: number,
  resetKey: number
): WebContainerState {
  const [isCompatible] = useState(canRunWebContainers);
  const webcontainerRef = useRef<WebContainer | null>(null);
  const hasBootedRef = useRef(false);
  const filesRef = useRef<ProjectFile[]>(files);
  const currentRunRef = useRef(0);
  const startProcessRef = useRef<WebContainerProcess | null>(null);
  const installedPackageJsonRef = useRef<string | null>(null);

  const [status, setStatus] = useState(() =>
    canRunWebContainers()
      ? "Esperando ejecucion..."
      : "Navegador no compatible con WebContainers"
  );
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    const lines = message.split("\n").filter((l) => l.length > 0);
    setLogs((currentLogs) => [...currentLogs, ...lines]);
  }

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    if (!isCompatible) {
      return;
    }

    currentRunRef.current += 1;
    startProcessRef.current?.kill();
    startProcessRef.current = null;
    installedPackageJsonRef.current = null;

    queueMicrotask(() => {
      setServerUrl(null);
      setLogs((currentLogs) => [...currentLogs, "> Runtime reiniciado"]);
    });

    if (webcontainerRef.current) {
      webcontainerRef.current.teardown();
      webcontainerRef.current = null;
      hasBootedRef.current = false;
    }
  }, [isCompatible, resetKey]);

  useEffect(() => {
    if (!isCompatible) {
      return;
    }

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

        const currentPackageJson = getPackageJsonContent(filesRef.current);

        if (installedPackageJsonRef.current !== currentPackageJson) {
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
              addLog("> Stream de instalacion cerrado");
            });

          const installExitCode = await installProcess.exit;

          if (currentRunRef.current !== runId) return;

          if (installExitCode !== 0) {
            setStatus("Error instalando dependencias");
            addLog(`> npm install fallo (codigo ${installExitCode})`);
            return;
          }

          installedPackageJsonRef.current = currentPackageJson;
        } else {
          addLog("> Dependencias sin cambios, se omite npm install");
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
  }, [isCompatible, runKey]);

  return { status, serverUrl, logs, isCompatible };
}

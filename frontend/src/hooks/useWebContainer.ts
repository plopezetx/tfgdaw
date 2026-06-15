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

// WebContainer solo puede arrancarse UNA vez por pestana del navegador.
// Guardamos la instancia a nivel de modulo (no en un ref del componente) para
// reutilizarla cuando el IDE se vuelve a montar tras navegar a /projects y
// volver. De lo contrario, al remontar se intentaba bootear una segunda
// instancia y fallaba con "Only a single WebContainer instance can be booted".
let bootPromise: Promise<WebContainer> | null = null;
// package.json con el que se hizo el ultimo npm install (persiste entre montajes
// porque el sistema de archivos del contenedor reutilizado tambien persiste).
let installedPackageJson: string | null = null;

function getWebContainer(): Promise<WebContainer> {
  if (!bootPromise) {
    bootPromise = WebContainer.boot();
  }
  return bootPromise;
}

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
  const filesRef = useRef<ProjectFile[]>(files);
  const currentRunRef = useRef(0);
  const startProcessRef = useRef<WebContainerProcess | null>(null);
  const didMountRef = useRef(false);

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

  // Arranque + ejecucion. Reutiliza el contenedor de modulo si ya existe.
  useEffect(() => {
    if (!isCompatible) {
      return;
    }

    let cancelled = false;
    const runId = currentRunRef.current + 1;
    currentRunRef.current = runId;

    async function bootAndRun() {
      try {
        const booting = !bootPromise;
        if (booting) {
          setStatus("Arrancando WebContainer...");
          addLog("> Booting WebContainer");
        }

        const webcontainer = await getWebContainer();
        if (cancelled || currentRunRef.current !== runId) return;

        startProcessRef.current?.kill();
        startProcessRef.current = null;
        setServerUrl(null);

        setStatus("Montando archivos...");
        addLog("> Montando archivos del editor");
        await webcontainer.mount(createRunnableFileSystemTree(filesRef.current));
        if (cancelled || currentRunRef.current !== runId) return;

        const currentPackageJson = getPackageJsonContent(filesRef.current);

        if (installedPackageJson !== currentPackageJson) {
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

          if (cancelled || currentRunRef.current !== runId) return;

          if (installExitCode !== 0) {
            setStatus("Error instalando dependencias");
            addLog(`> npm install fallo (codigo ${installExitCode})`);
            return;
          }

          installedPackageJson = currentPackageJson;
        } else {
          addLog("> Dependencias sin cambios, se omite npm install");
        }

        setStatus("Arrancando servidor de desarrollo...");
        addLog("> npm run start");
        const startProcess = await webcontainer.spawn("npm", ["run", "start"]);

        if (cancelled || currentRunRef.current !== runId) {
          startProcess.kill();
          return;
        }

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
        if (cancelled) return;
        console.error(error);
        setStatus("Error en WebContainer");
        addLog(`> Error: ${String(error)}`);
      }
    }

    bootAndRun();

    return () => {
      cancelled = true;
      currentRunRef.current += 1;
      startProcessRef.current?.kill();
      startProcessRef.current = null;
    };
  }, [isCompatible, runKey]);

  // Listener de servidor listo: se registra una vez por montaje y se limpia al
  // desmontar, sin tocar la instancia de modulo (que sigue viva para reusarse).
  useEffect(() => {
    if (!isCompatible) {
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    getWebContainer().then((webcontainer) => {
      if (cancelled) return;
      unsubscribe = webcontainer.on("server-ready", (_port, url) => {
        setServerUrl(url);
        setStatus("Servidor listo");
        addLog(`> Servidor listo en ${url}`);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isCompatible]);

  // Reset: detiene el proceso y fuerza reinstalacion limpia en el proximo
  // Ejecutar, pero NO destruye el contenedor (evita el reboot que rompia).
  useEffect(() => {
    if (!isCompatible) {
      return;
    }

    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    currentRunRef.current += 1;
    startProcessRef.current?.kill();
    startProcessRef.current = null;
    installedPackageJson = null;
    setServerUrl(null);
    addLog("> Runtime reiniciado");
  }, [isCompatible, resetKey]);

  return { status, serverUrl, logs, isCompatible };
}

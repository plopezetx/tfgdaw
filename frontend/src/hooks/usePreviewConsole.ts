import { useEffect, useState } from "react";

export type PreviewLog = {
  level: "log" | "warn" | "error" | "info";
  text: string;
};

// Escucha los mensajes que el preview (iframe) envía mediante postMessage con
// la consola reenviada. Se limpia cada vez que cambia `resetSignal` (al
// re-ejecutar el proyecto).
export function usePreviewConsole(resetSignal: number) {
  const [logs, setLogs] = useState<PreviewLog[]>([]);

  useEffect(() => {
    setLogs([]);
  }, [resetSignal]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (data && data.source === "preview-console") {
        setLogs((current) => [
          ...current,
          { level: data.level, text: String(data.text) },
        ]);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { logs, clear: () => setLogs([]) };
}

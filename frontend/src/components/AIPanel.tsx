import { useRef, useState } from "react";
import * as api from "../lib/api";

type AIPanelProps = {
  fileContent: string;
  fileName: string;
  selection?: string;
  onApplyCode: (code: string) => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  codeBlock?: string;
};

function extractFirstCodeBlock(text: string): string | null {
  const match = text.match(/```(?:\w*)\n([\s\S]*?)```/);
  return match ? match[1] : null;
}

export function AIPanel({ fileContent, fileName, selection, onApplyCode }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    let accumulated = "";
    const assistantIndex = messages.length + 1;

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      await api.chatWithAI(
        text,
        fileContent,
        fileName,
        selection,
        (chunk) => {
          accumulated += chunk;
          const codeBlock = extractFirstCodeBlock(accumulated);
          setMessages((prev) => {
            const next = [...prev];
            next[assistantIndex] = {
              role: "assistant",
              content: accumulated,
              codeBlock: codeBlock ?? undefined,
            };
            return next;
          });
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      );

      const codeBlock = extractFirstCodeBlock(accumulated);
      setMessages((prev) => {
        const next = [...prev];
        next[assistantIndex] = {
          role: "assistant",
          content: accumulated,
          codeBlock: codeBlock ?? undefined,
        };
        return next;
      });
    } catch (err) {
      setError((err as Error).message ?? "Error desconocido");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="ai-panel">
      <div className="ai-messages">
        {messages.length === 0 && (
          <p className="ai-hint">
            Escribe una pregunta sobre el archivo activo.<br />
            Usa Shift+Enter para nueva línea, Enter para enviar.
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ai-message--${msg.role}`}>
            <div className="ai-message-content">
              {msg.content || (msg.role === "assistant" && loading && i === messages.length - 1 ? "…" : "")}
            </div>
            {msg.role === "assistant" && msg.codeBlock && (
              <button
                className="action-button action-button-active"
                onClick={() => onApplyCode(msg.codeBlock!)}
                title="Reemplaza el contenido del archivo activo con este código"
              >
                Aplicar al editor
              </button>
            )}
          </div>
        ))}

        {error && <div className="ai-error">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="ai-input-row">
        <textarea
          ref={textareaRef}
          className="ai-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selection ? "Pregunta sobre la selección…" : "Pregunta sobre este archivo…"}
          rows={2}
          disabled={loading}
        />
        <button
          className="run-button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? "…" : "Enviar"}
        </button>
      </div>
    </section>
  );
}

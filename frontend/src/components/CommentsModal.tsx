import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as api from "../lib/api";

type CommentsModalProps = {
  slug: string;
  projectId: string;
  ownerId: string;
  onClose: () => void;
  onCountChange: (count: number) => void;
};

export function CommentsModal({
  slug,
  projectId,
  ownerId,
  onClose,
  onCountChange,
}: CommentsModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<api.Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api
      .getComments(slug)
      .then((items) => {
        setComments(items);
        onCountChange(items.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, onCountChange]);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content) return;

    setPosting(true);
    try {
      const comment = await api.addComment(projectId, content);
      setComments((current) => {
        const next = [comment, ...current];
        onCountChange(next.length);
        return next;
      });
      setText("");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo publicar el comentario", "error");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteComment(projectId, id);
      setComments((current) => {
        const next = current.filter((c) => c.id !== id);
        onCountChange(next.length);
        return next;
      });
    } catch (err) {
      toast((err as Error).message ?? "No se pudo borrar el comentario", "error");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Comentarios</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {user ? (
          <form onSubmit={handleAdd} className="comment-form">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un comentario…"
              rows={2}
            />
            <button type="submit" className="run-button" disabled={posting || !text.trim()}>
              {posting ? "…" : "Publicar"}
            </button>
          </form>
        ) : (
          <p className="comment-login-hint">Inicia sesión para comentar.</p>
        )}

        <div className="comment-list">
          {loading && <p className="comment-empty">Cargando comentarios…</p>}
          {!loading && comments.length === 0 && (
            <p className="comment-empty">Aún no hay comentarios. ¡Sé el primero!</p>
          )}
          {comments.map((comment) => {
            const canDelete =
              user && (user.id === comment.userId || user.id === ownerId);
            return (
              <div key={comment.id} className="comment">
                <div className="comment-meta">
                  <strong>{comment.user.username}</strong>
                  <span>{new Date(comment.createdAt).toLocaleDateString("es-ES")}</span>
                  {canDelete && (
                    <button
                      type="button"
                      className="comment-delete"
                      onClick={() => handleDelete(comment.id)}
                      title="Borrar comentario"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

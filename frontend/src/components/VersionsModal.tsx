import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import * as api from "../lib/api";
import type { ProjectFile } from "../types/projects";

type VersionsModalProps = {
  projectId: string;
  currentFiles: ProjectFile[];
  onRestore: (files: ProjectFile[]) => void;
  onClose: () => void;
};

export function VersionsModal({
  projectId,
  currentFiles,
  onRestore,
  onClose,
}: VersionsModalProps) {
  const { toast } = useToast();
  const [versions, setVersions] = useState<api.ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getVersions(projectId)
      .then(setVersions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleSaveVersion() {
    setSaving(true);
    try {
      const version = await api.createVersion(projectId, currentFiles, label.trim());
      setVersions((current) => [version, ...current]);
      setLabel("");
      toast("Versión guardada", "success");
    } catch (err) {
      toast((err as Error).message ?? "No se pudo guardar la versión", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore(versionId: string) {
    setRestoringId(versionId);
    try {
      const result = await api.getVersionFiles(projectId, versionId);
      onRestore(result.files);
      toast("Versión restaurada", "success");
      onClose();
    } catch (err) {
      toast((err as Error).message ?? "No se pudo restaurar la versión", "error");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Historial de versiones</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="version-save">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Etiqueta (opcional): ej. antes del refactor"
          />
          <button
            type="button"
            className="run-button"
            onClick={handleSaveVersion}
            disabled={saving}
          >
            {saving ? "…" : "Guardar versión actual"}
          </button>
        </div>

        <div className="version-list">
          {loading && <p className="comment-empty">Cargando versiones…</p>}
          {!loading && versions.length === 0 && (
            <p className="comment-empty">
              Todavía no hay versiones guardadas. Guarda una para poder volver a ella.
            </p>
          )}
          {versions.map((version) => (
            <div key={version.id} className="version-item">
              <div className="version-info">
                <strong>{version.label || "Sin etiqueta"}</strong>
                <span>{new Date(version.createdAt).toLocaleString("es-ES")}</span>
              </div>
              <button
                type="button"
                className="mini-button"
                onClick={() => handleRestore(version.id)}
                disabled={restoringId === version.id}
              >
                {restoringId === version.id ? "Restaurando…" : "Restaurar"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

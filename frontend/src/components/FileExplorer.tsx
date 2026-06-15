import { useMemo, useState } from "react";
import type { ProjectFile } from "../types/projects";

type FileExplorerProps = {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile?: (path: string) => void;
  onRenameFile?: (path: string, newName: string) => void;
  onDeleteFile?: (path: string) => void;
};

type TreeNode = {
  name: string;
  path: string;
  isFolder: boolean;
  file?: ProjectFile;
  children: TreeNode[];
};

// Convierte la lista plana de archivos en un árbol de carpetas a partir de
// sus rutas (p. ej. "/src/main.js" → carpeta "src" con archivo "main.js").
function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode = { name: "", path: "", isFolder: true, children: [] };

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;
    let accumulated = "";

    parts.forEach((part, index) => {
      accumulated += `/${part}`;
      const isLast = index === parts.length - 1;

      if (isLast) {
        current.children.push({
          name: part,
          path: file.path,
          isFolder: false,
          file,
          children: [],
        });
      } else {
        let folder = current.children.find(
          (child) => child.isFolder && child.name === part
        );
        if (!folder) {
          folder = { name: part, path: accumulated, isFolder: true, children: [] };
          current.children.push(folder);
        }
        current = folder;
      }
    });
  }

  function sortNode(node: TreeNode) {
    node.children.sort((a, b) => {
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNode);
  }
  sortNode(root);

  return root.children;
}

export function FileExplorer({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newPath, setNewPath] = useState("");

  function commitCreate() {
    const value = newPath.trim();
    setCreating(false);
    setNewPath("");
    if (value) onCreateFile?.(value);
  }

  function toggleFolder(path: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function startRename(node: TreeNode) {
    setConfirmingDelete(null);
    setEditingPath(node.path);
    setEditValue(node.name);
  }

  function commitRename(node: TreeNode) {
    const value = editValue.trim();
    setEditingPath(null);
    if (value && value !== node.name) onRenameFile?.(node.path, value);
  }

  function renderNode(node: TreeNode, depth: number) {
    const indent = { paddingLeft: `${8 + depth * 14}px` };

    if (node.isFolder) {
      const isOpen = !collapsed.has(node.path);
      return (
        <div key={node.path}>
          <button
            className="tree-folder"
            style={indent}
            onClick={() => toggleFolder(node.path)}
          >
            <span className="tree-caret">{isOpen ? "▾" : "▸"}</span>
            <span className="tree-label">{node.name}</span>
          </button>
          {isOpen && node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      );
    }

    const isEditing = editingPath === node.path;
    const isConfirming = confirmingDelete === node.path;

    return (
      <div
        key={node.path}
        className={
          node.path === activeFilePath ? "file-row file-row-active" : "file-row"
        }
      >
        {isEditing ? (
          <input
            className="file-rename-input"
            style={indent}
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => setEditingPath(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename(node);
              if (e.key === "Escape") setEditingPath(null);
            }}
          />
        ) : (
          <button
            className="file-button tree-file"
            style={indent}
            onClick={() => onSelectFile(node.path)}
          >
            <span className="tree-label">{node.name}</span>
          </button>
        )}

        {!isEditing && (onRenameFile || onDeleteFile) && (
          <div className="file-actions">
            {isConfirming ? (
              <>
                <button
                  className="icon-action danger-action"
                  onClick={() => {
                    setConfirmingDelete(null);
                    onDeleteFile?.(node.path);
                  }}
                  title="Confirmar borrado"
                >
                  ✓
                </button>
                <button
                  className="icon-action"
                  onClick={() => setConfirmingDelete(null)}
                  title="Cancelar"
                >
                  ✗
                </button>
              </>
            ) : (
              <>
                {onRenameFile && (
                  <button
                    className="icon-action"
                    onClick={() => startRename(node)}
                    title="Renombrar"
                  >
                    R
                  </button>
                )}
                {onDeleteFile && (
                  <button
                    className="icon-action danger-action"
                    onClick={() => setConfirmingDelete(node.path)}
                    title="Eliminar"
                  >
                    x
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="file-explorer">
      <div className="panel-title explorer-title">
        <span>Archivos</span>
        {onCreateFile && (
          <button
            className="icon-action"
            onClick={() => {
              setNewPath("/src/");
              setCreating(true);
            }}
            title="Nuevo archivo"
          >
            +
          </button>
        )}
      </div>

      <div className="file-list">
        {creating && (
          <div className="file-row">
            <input
              className="file-rename-input"
              style={{ paddingLeft: "8px" }}
              value={newPath}
              autoFocus
              placeholder="/src/archivo.js"
              onChange={(e) => setNewPath(e.target.value)}
              onBlur={() => setCreating(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCreate();
                if (e.key === "Escape") setCreating(false);
              }}
            />
          </div>
        )}
        {tree.map((node) => renderNode(node, 0))}
      </div>
    </aside>
  );
}

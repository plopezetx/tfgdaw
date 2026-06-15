import { useMemo, useState } from "react";
import type { ProjectFile } from "../types/projects";

type FileExplorerProps = {
  files: ProjectFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile?: () => void;
  onRenameFile?: (path: string) => void;
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

  // Ordena: carpetas primero, luego alfabético
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

  function toggleFolder(path: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
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

    return (
      <div
        key={node.path}
        className={
          node.path === activeFilePath ? "file-row file-row-active" : "file-row"
        }
      >
        <button
          className="file-button tree-file"
          style={indent}
          onClick={() => onSelectFile(node.path)}
        >
          <span className="tree-label">{node.name}</span>
        </button>

        {(onRenameFile || onDeleteFile) && (
          <div className="file-actions">
            {onRenameFile && (
              <button
                className="icon-action"
                onClick={() => onRenameFile(node.path)}
                title="Renombrar"
              >
                R
              </button>
            )}
            {onDeleteFile && (
              <button
                className="icon-action danger-action"
                onClick={() => onDeleteFile(node.path)}
                title="Eliminar"
              >
                x
              </button>
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
          <button className="icon-action" onClick={onCreateFile} title="Nuevo archivo">
            +
          </button>
        )}
      </div>

      <div className="file-list">{tree.map((node) => renderNode(node, 0))}</div>
    </aside>
  );
}

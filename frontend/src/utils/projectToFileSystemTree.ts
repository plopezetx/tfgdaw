import type { FileSystemTree } from "@webcontainer/api";
import type { ProjectFile } from "../types/projects";

const DEFAULT_PACKAGE_JSON = {
  scripts: {
    start: "vite --host 0.0.0.0",
  },
  dependencies: {
    "@vitejs/plugin-react": "latest",
    vite: "latest",
    react: "latest",
    "react-dom": "latest",
  },
  devDependencies: {},
};

function normalizeProjectPath(path: string) {
  return path.replace(/\\/g, "/").replace(/^\/+/, "").trim();
}

function createFile(contents: string) {
  return {
    file: {
      contents,
    },
  };
}

export function projectToFileSystemTree(files: ProjectFile[]): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    const normalizedPath = normalizeProjectPath(file.path);

    if (!normalizedPath) {
      continue;
    }

    const pathParts = normalizedPath.split("/").filter(Boolean);
    const fileName = pathParts.pop();

    if (!fileName) {
      continue;
    }

    let currentDirectory = tree;

    for (const directoryName of pathParts) {
      const currentEntry = currentDirectory[directoryName];

      if (!currentEntry || !("directory" in currentEntry)) {
        currentDirectory[directoryName] = {
          directory: {},
        };
      }

      const directoryEntry = currentDirectory[directoryName];

      if ("file" in directoryEntry) {
        throw new Error(
          `No se puede crear la carpeta "${directoryName}" porque ya existe un archivo con ese nombre.`
        );
      }

      currentDirectory = directoryEntry.directory;
    }

    currentDirectory[fileName] = createFile(file.content);
  }

  return tree;
}

export function createRunnableFileSystemTree(
  files: ProjectFile[]
): FileSystemTree {
  const tree = projectToFileSystemTree(files);

  if (!tree["package.json"]) {
    tree["package.json"] = createFile(JSON.stringify(DEFAULT_PACKAGE_JSON, null, 2));
  }

  return tree;
}

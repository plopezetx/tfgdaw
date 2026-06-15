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

// Script que se inyecta en el HTML servido para reenviar la consola y los
// errores del preview a la ventana padre mediante postMessage. La fuente del
// usuario no se modifica: solo se altera la copia que se monta para ejecutar.
const CONSOLE_FORWARDER = `<script>
(function(){
  function send(level, args){
    try {
      var text = Array.prototype.map.call(args, function(a){
        try { return typeof a === "object" ? JSON.stringify(a) : String(a); }
        catch(e){ return String(a); }
      }).join(" ");
      parent.postMessage({ source: "preview-console", level: level, text: text }, "*");
    } catch(e){}
  }
  ["log","warn","error","info"].forEach(function(level){
    var original = console[level];
    console[level] = function(){ send(level, arguments); original.apply(console, arguments); };
  });
  window.addEventListener("error", function(e){
    send("error", [e.message + " (" + (e.filename||"") + ":" + (e.lineno||0) + ")"]);
  });
  window.addEventListener("unhandledrejection", function(e){
    var r = e.reason;
    send("error", ["Promesa rechazada: " + (r && r.message ? r.message : r)]);
  });
})();
</script>`;

function injectConsoleForwarder(files: ProjectFile[]): ProjectFile[] {
  return files.map((file) => {
    if (!file.path.toLowerCase().endsWith(".html")) return file;

    const content = file.content;
    const injected = content.includes("</head>")
      ? content.replace("</head>", `${CONSOLE_FORWARDER}</head>`)
      : `${CONSOLE_FORWARDER}${content}`;

    return { ...file, content: injected };
  });
}

export function createRunnableFileSystemTree(
  files: ProjectFile[]
): FileSystemTree {
  const tree = projectToFileSystemTree(injectConsoleForwarder(files));

  if (!tree["package.json"]) {
    tree["package.json"] = createFile(JSON.stringify(DEFAULT_PACKAGE_JSON, null, 2));
  }

  return tree;
}

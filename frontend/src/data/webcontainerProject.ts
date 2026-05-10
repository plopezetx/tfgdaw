import type { FileSystemTree } from "@webcontainer/api";

export const webcontainerProject: FileSystemTree = {
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
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
        },
        null,
        2
      ),
    },
  },

  "index.html": {
    file: {
      contents: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Preview WebContainer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    },
  },

  src: {
    directory: {
      "main.jsx": {
        file: {
          contents: `import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <main className="demo-page">
      <h1>Proyecto ejecutado con WebContainers</h1>
      <p>Esta preview viene de un servidor Vite arrancado dentro del navegador.</p>
      <button onClick={() => alert("Funciona desde WebContainer")}>
        Probar interacción
      </button>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);`,
        },
      },

      "style.css": {
        file: {
          contents: `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #111827;
  color: white;
}

.demo-page {
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 16px;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}`,
        },
      },
    },
  },
};
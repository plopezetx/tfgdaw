import type { ProjectFile } from "../types/projects";

export const initialFiles: ProjectFile[] = [
  {
    name: "index.html",
    path: "/index.html",
    language: "html",
    content: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Proyecto TFG</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div id="app">
      <h1>Hola desde el IDE Web</h1>
      <p>Edita el codigo y pulsa ejecutar.</p>
    </div>

    <script src="/src/main.js"></script>
  </body>
</html>`,
  },
  {
    name: "main.js",
    path: "/src/main.js",
    language: "javascript",
    content: `const app = document.querySelector("#app");

const button = document.createElement("button");
button.textContent = "Pulsame";

button.addEventListener("click", () => {
  alert("El proyecto se esta ejecutando desde el navegador");
});

app.appendChild(button);`,
  },
  {
    name: "styles.css",
    path: "/src/styles.css",
    language: "css",
    content: `body {
  font-family: Arial, sans-serif;
  background: #111827;
  color: white;
  padding: 40px;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}`,
  },
];

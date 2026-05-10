import type { ProjectFile } from "../types/projects";

type PreviewPanelProps = {
  files: ProjectFile[];
  refreshKey: number;
};

export function PreviewPanel({ files, refreshKey }: PreviewPanelProps) {
  const html = files.find((file) => file.path === "/index.html")?.content ?? "";
  const js = files.find((file) => file.path === "/src/main.js")?.content ?? "";
  const css =
    files.find((file) => file.path === "/src/styles.css")?.content ?? "";

  const cleanHtml = html
    .replace('<script src="/src/main.js"></script>', "")
    .replace('<link rel="stylesheet" href="/src/styles.css">', "")
    .replace('<link rel="stylesheet" href="/src/styles.css" />', "");

  const srcDoc = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <style>${css}</style>
      </head>
      <body>
        ${cleanHtml}
        <script>
          try {
            ${js}
          } catch (error) {
            document.body.innerHTML += '<pre style="color:red;">' + error + '</pre>';
          }
        </script>
      </body>
    </html>
  `;

  return (
    <section className="preview-panel">
      <div className="panel-title">Preview</div>

      <iframe
        key={refreshKey}
        title="preview"
        className="preview-frame"
        sandbox="allow-scripts allow-modals"
        srcDoc={srcDoc}
      />
    </section>
  );
}
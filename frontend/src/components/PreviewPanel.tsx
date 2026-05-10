import type { ProjectFile } from "../types/projects";

type PreviewPanelProps = {
  files: ProjectFile[];
};

export function PreviewPanel({ files }: PreviewPanelProps) {
  const html = files.find((file) => file.path === "/index.html")?.content ?? "";
  const js = files.find((file) => file.path === "/src/main.js")?.content ?? "";
  const css =
    files.find((file) => file.path === "/src/styles.css")?.content ?? "";

  const srcDoc = `
    ${html}
    <style>${css}</style>
    <script>
      ${js}
    </script>
  `;

  return (
    <section className="preview-panel">
      <div className="panel-title">Preview</div>

      <iframe
        title="preview"
        className="preview-frame"
        sandbox="allow-scripts allow-modals"
        srcDoc={srcDoc}
      />
    </section>
  );
}
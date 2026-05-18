type PreviewFrameProps = {
  serverUrl: string | null;
  status: string;
};

export function PreviewFrame({ serverUrl, status }: PreviewFrameProps) {
  return (
    <section className="preview-panel">
      <div className="panel-title">
        <span>Preview</span>
        <span className="preview-status">{status}</span>
      </div>

      {serverUrl ? (
        <iframe
          title="preview"
          className="preview-frame"
          src={serverUrl}
        />
      ) : (
        <div className="preview-placeholder">
          {status}
        </div>
      )}
    </section>
  );
}

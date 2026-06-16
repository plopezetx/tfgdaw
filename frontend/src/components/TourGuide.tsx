import { useLayoutEffect, useState } from "react";

export type TourStep = {
  selector: string;
  title: string;
  text: string;
};

type TourGuideProps = {
  steps: TourStep[];
  onClose: () => void;
};

export function TourGuide({ steps, onClose }: TourGuideProps) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = steps[index];

  useLayoutEffect(() => {
    function measure() {
      const el = document.querySelector(step.selector);
      setRect(el ? el.getBoundingClientRect() : null);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step.selector]);

  const isLast = index === steps.length - 1;

  // Posición del cuadro de texto: debajo del elemento si cabe, si no encima.
  let tooltipStyle: React.CSSProperties = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  if (rect) {
    const below = rect.bottom + 170 < window.innerHeight;
    const left = Math.min(Math.max(rect.left, 16), window.innerWidth - 320);
    tooltipStyle = below
      ? { top: rect.bottom + 12, left }
      : { top: Math.max(rect.top - 160, 16), left };
  }

  return (
    <div className="tour">
      <div className="tour-dim" />

      {rect && (
        <div
          className="tour-highlight"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
        />
      )}

      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-step-count">
          Paso {index + 1} de {steps.length}
        </div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <div className="tour-actions">
          <button type="button" className="action-button" onClick={onClose}>
            Saltar
          </button>
          <button
            type="button"
            className="run-button"
            onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
          >
            {isLast ? "¡Entendido!" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterClip, caseStart, fiberPath, fiberPoints, sequenceOf } from "../experience/fiber.mjs";
gsap.registerPlugin(ScrollTrigger);

const LAYERS = ["shadow", "body", "mid", "light", "spec"];
// Server-rendered state (also what visitors without JavaScript see): halfway, fibre drawn.
const START = fiberPoints(0.5, 0.48);
const phaseOf = (p) => 0.2 + p * 0.55;

function Photo({ c, side }) {
  if (c.placeholder)
    return (
      <div className={`ba-ph ba-ph-${side}`} aria-hidden="true">
        <span>{side === "before" ? "antes" : "depois"}</span>
      </div>
    );
  // One size per photo (2:3, at most 1200 px wide and never enlarged): the frame is about 300–500 px wide.
  const base = `/images/resultados/${c.slug}-${side === "before" ? "antes" : "depois"}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}.avif`} />
      <img src={`${base}.webp`} width="800" height="1200" alt={c.alt[side]} loading="lazy" decoding="async" />
    </picture>
  );
}

/**
 * Before/after: one collagen fibre crosses each case in turn while the visitor scrolls (the stage is
 * sticky; the scroll stays native), so every case gets its own pass without scrolling back. The
 * buttons jump to a case; the slider compares at the visitor's own pace.
 */
export default function Results({ cases }) {
  const track = useRef();
  const frame = useRef();
  const range = useRef();
  const trigger = useRef(null);
  const state = useRef({ index: 0, draw: 1, p: 0.5, manualAt: null });
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = cases.length;
  const c = cases[Math.min(index, n - 1)];

  const paint = () => {
    const el = frame.current;
    if (!el) return;
    const { index: active, draw, p } = state.current;
    const pts = fiberPoints(p, phaseOf(p));
    const d = fiberPath(pts);
    // On the stage, so the slider track and the labels follow the fibre too.
    el.parentElement.style.setProperty("--draw", draw.toFixed(3));
    el.parentElement.style.setProperty("--p", p.toFixed(3));
    el.querySelectorAll(".ba-case").forEach((node, i) => node.classList.toggle("is-active", i === active));
    el.querySelectorAll(".ba-after")[active].style.clipPath = afterClip(pts);
    for (const path of el.querySelectorAll(".ba-fiber path")) path.setAttribute("d", d);
    if (range.current) range.current.value = String(Math.round(p * 100));
    setIndex(active);
  };

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    if (rm.matches) {
      state.current = { index: 0, draw: 1, p: 0.5, manualAt: null };
      paint();
      return;
    }
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const s = state.current;
        const next = sequenceOf(self.progress, n);
        // A manual comparison holds until the visitor really scrolls on.
        if (s.manualAt !== null && next.index === s.index && Math.abs(self.progress - s.manualAt) < 0.04) {
          s.draw = next.draw;
        } else {
          state.current = { ...next, manualAt: null };
        }
        paint();
      },
    });
    trigger.current = st;
    state.current = { ...sequenceOf(st.progress, n), manualAt: null };
    paint();
    return () => st.kill();
  }, [n]);

  const onRange = (e) => {
    state.current = {
      ...state.current,
      draw: 1,
      p: Number(e.target.value) / 100,
      manualAt: trigger.current ? trigger.current.progress : 0,
    };
    paint();
  };

  // The buttons take the visitor to the start of that case's pass instead of swapping the photo mid-scroll.
  const goTo = (i) => {
    const st = trigger.current;
    if (!st || reduced) {
      state.current = { index: i, draw: 1, p: 0.5, manualAt: null };
      paint();
      return;
    }
    window.scrollTo({ top: st.start + (st.end - st.start) * caseStart(i, n), behavior: "smooth" });
  };

  return (
    <section className="results" id="resultados" aria-labelledby="results-title">
      <div
        className={`results-track ${reduced ? "is-static" : ""}`}
        ref={track}
        style={{ "--cases": n }}
      >
        {/* The title stays on screen with the photo while the fibre crosses it. */}
        <div className={`results-stage ${n > 1 ? "has-cases" : ""}`} style={{ "--draw": 1, "--p": 0.5 }}>
          <div className="results-intro">
            <span className="eyebrow">03 — RESULTADO REAL</span>
            <h2 id="results-title">
              <span>Sem filtro.</span> <em>Sem promessa.</em> <span>Só o real.</span>
            </h2>
            <p>
              A mesma fibra do colágeno atravessa cada foto enquanto você rola. Em qualquer momento, arraste
              para comparar com calma.
            </p>
          </div>
          <div
            className="ba-frame"
            ref={frame}
            role={c.placeholder ? "img" : undefined}
            aria-label={c.placeholder ? "Espaço reservado para as fotos de antes e depois" : undefined}
          >
            {cases.map((x, i) => (
              <div className={`ba-case ${i === index ? "is-active" : ""}`} key={x.slug} aria-hidden={i !== index}>
                <div className="ba-layer ba-before">
                  <Photo c={x} side="before" />
                </div>
                <div className="ba-layer ba-after" style={{ clipPath: afterClip(START) }}>
                  <Photo c={x} side="after" />
                </div>
              </div>
            ))}
            <svg className="ba-fiber" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {LAYERS.map((k) => (
                <path key={k} className={`fiber-${k}`} d={fiberPath(START)} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <span className="ba-tag ba-tag-after" aria-hidden="true">
              Depois
            </span>
            <span className="ba-tag ba-tag-before" aria-hidden="true">
              Antes
            </span>
          </div>
          <div className="ba-aside">
            <span className="ba-procedure">{c.procedure || c.label}</span>
            {n > 1 && (
              <div className="ba-cases" role="group" aria-label="Ir para o caso">
                {cases.map((x, i) => (
                  <button key={x.slug} aria-pressed={i === index} onClick={() => goTo(i)}>
                    {x.label}
                  </button>
                ))}
              </div>
            )}
            <label className="ba-range">
              <span>Arraste para comparar</span>
              <input
                ref={range}
                type="range"
                min="0"
                max="100"
                step="1"
                defaultValue="50"
                onInput={onRange}
                aria-label="Comparar antes e depois: à esquerda o depois, à direita o antes"
              />
            </label>
            {c.placeholder && <p className="ba-legal">As fotos reais de pacientes da Mariana entram aqui em breve.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

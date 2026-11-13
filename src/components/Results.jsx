import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resultCaption } from "../lib.mjs";
import { afterClip, fiberPath, fiberPoints, sweepOf } from "../experience/fiber.mjs";
gsap.registerPlugin(ScrollTrigger);

const SIZES = "(max-width: 700px) 86vw, 62vh";
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
  const base = `/images/resultados/${c.slug}-${side === "before" ? "antes" : "depois"}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-600.avif 600w, ${base}-1200.avif 1200w`} sizes={SIZES} />
      <img
        src={`${base}-1200.webp`}
        srcSet={`${base}-600.webp 600w, ${base}-1200.webp 1200w`}
        sizes={SIZES}
        width="1200"
        height="1500"
        alt={c.alt[side]}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

/**
 * Before/after: one collagen fibre crosses the photo while the visitor scrolls (the stage is
 * sticky; the scroll stays native), then the slider lets them compare at their own pace.
 */
export default function Results({ cases }) {
  const track = useRef();
  const frame = useRef();
  const range = useRef();
  const state = useRef({ draw: 1, p: 0.5, manualAt: null });
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const c = cases[Math.min(index, cases.length - 1)];

  const paint = () => {
    const el = frame.current;
    if (!el) return;
    const { draw, p } = state.current;
    const pts = fiberPoints(p, phaseOf(p));
    const d = fiberPath(pts);
    // On the stage, so the slider track and the labels follow the fibre too.
    el.parentElement.style.setProperty("--draw", draw.toFixed(3));
    el.parentElement.style.setProperty("--p", p.toFixed(3));
    el.querySelector(".ba-after").style.clipPath = afterClip(pts);
    for (const path of el.querySelectorAll(".ba-fiber path")) path.setAttribute("d", d);
    if (range.current) range.current.value = String(Math.round(p * 100));
  };

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    if (rm.matches) {
      state.current = { draw: 1, p: 0.5, manualAt: null };
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
        const next = sweepOf(self.progress);
        // A manual comparison holds until the visitor really scrolls on.
        if (s.manualAt !== null && Math.abs(self.progress - s.manualAt) < 0.04) {
          s.draw = next.draw;
        } else {
          s.manualAt = null;
          s.draw = next.draw;
          s.p = next.p;
        }
        paint();
      },
    });
    const first = sweepOf(st.progress);
    state.current = { ...first, manualAt: null };
    paint();
    return () => st.kill();
  }, []);

  useEffect(paint, [index]);

  const onRange = (e) => {
    const st = ScrollTrigger.getAll().find((t) => t.trigger === track.current);
    state.current = { draw: 1, p: Number(e.target.value) / 100, manualAt: st ? st.progress : 0 };
    paint();
  };

  return (
    <section className="results" id="resultados" aria-labelledby="results-title">
      <div className={`results-track ${reduced ? "is-static" : ""}`} ref={track}>
        {/* The title stays on screen with the photo while the fibre crosses it. */}
        <div className="results-stage" style={{ "--draw": 1, "--p": 0.5 }}>
          <div className="results-intro">
            <span className="eyebrow">03 — RESULTADO REAL</span>
            <h2 id="results-title">
              <span>Sem filtro.</span> <em>Sem promessa.</em> <span>Só o real.</span>
            </h2>
            <p>
              A mesma fibra do colágeno atravessa a foto enquanto você rola. No fim, arraste para comparar com
              calma.
            </p>
          </div>
            <div
              className="ba-frame"
              ref={frame}
              role={c.placeholder ? "img" : undefined}
              aria-label={c.placeholder ? "Espaço reservado para as fotos de antes e depois" : undefined}
            >
              <div className="ba-layer ba-before" key={`${c.slug}-b`}>
                <Photo c={c} side="before" />
              </div>
              <div className="ba-layer ba-after" key={`${c.slug}-a`} style={{ clipPath: afterClip(START) }}>
                <Photo c={c} side="after" />
              </div>
              <svg className="ba-fiber" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {LAYERS.map((k) => (
                  <path key={k} className={`fiber-${k}`} d={fiberPath(START)} vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <span className="ba-tag ba-tag-after" aria-hidden="true">
                Depois{c.interval ? ` · ${c.interval}` : ""}
              </span>
              <span className="ba-tag ba-tag-before" aria-hidden="true">
                Antes
              </span>
            </div>
            <div className="ba-aside">
              <span className="ba-procedure">{c.procedure}</span>
              {cases.length > 1 && (
                <div className="ba-cases" role="group" aria-label="Escolher o caso">
                  {cases.map((x, i) => (
                    <button key={x.slug} aria-pressed={i === index} onClick={() => setIndex(i)}>
                      {x.procedure}
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
              <p className="ba-legal">
                {c.placeholder
                  ? "As fotos reais de pacientes da Mariana entram aqui em breve."
                  : resultCaption()}
              </p>
            </div>
        </div>
      </div>
    </section>
  );
}

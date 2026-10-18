import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCENE_STOPS } from "./choreography.mjs";
import { Contact, Arrow } from "../components/UI.jsx";
import { site } from "../site.config.mjs";
const Sculpture = lazy(() => import("./Sculpture.jsx"));
gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const section = useRef();
  const progress = useRef(0);
  const chapterRef = useRef(0);
  // Mobile only: the free band between each chapter's text and the stage footer.
  const bands = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [render3D, setRender3D] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [finish, setFinish] = useState("champagne");
  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => {
    setFailed(true);
    setReady(false);
    setRender3D(false);
  }, []);
  useEffect(() => {
    const mq = matchMedia("(max-width: 700px)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(mq.matches);
      setReduced(rm.matches);
    };
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    const timer = setTimeout(() => {
      if (rm.matches || navigator.connection?.saveData) return;
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      if (!gl) {
        setFailed(true);
        return;
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setRender3D(true);
    }, 350);
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(section.current);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (reduced) return;
    const el = section.current;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".chapter");
      gsap.set(panels, { yPercent: mobile ? 0 : -46, y: 0 });
      gsap.set(panels.slice(1), { autoAlpha: 0, pointerEvents: "none" });
      gsap.fromTo(
        ".chapter-0 .line-inner",
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.35,
          stagger: 0.12,
          ease: "power4.out",
          delay: 0.08,
        },
      );
      gsap.fromTo(
        ".chapter-0 .chapter-extra",
        { y: 10 },
        { y: 0, duration: 1, delay: 0.15 },
      );
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            progress.current = self.progress;
            const c = self.progress < 0.29 ? 0 : self.progress < 0.64 ? 1 : 2;
            chapterRef.current = c;
            setChapter(c);
          },
        },
      });
      tl.to(
        ".chapter-0",
        { autoAlpha: 0, y: -60, duration: 0.14, ease: "power2.inOut" },
        0.15,
      )
        .fromTo(
          ".chapter-1",
          { autoAlpha: 0, y: 65 },
          { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" },
          0.27,
        )
        .fromTo(
          ".chapter-1 .line-inner",
          { yPercent: 105 },
          { yPercent: 0, stagger: 0.035, duration: 0.14 },
          0.27,
        )
        .to(".chapter-1", { autoAlpha: 0, y: -55, duration: 0.13 }, 0.53)
        .fromTo(
          ".chapter-2",
          { autoAlpha: 0, y: 70 },
          { autoAlpha: 1, y: 0, duration: 0.16 },
          0.64,
        )
        .fromTo(
          ".chapter-2 .line-inner",
          { yPercent: 105 },
          { yPercent: 0, stagger: 0.035, duration: 0.14 },
          0.64,
        )
        .to(
          ".experience-progress-fill",
          { scaleX: 1, duration: 1, ease: "none" },
          0,
        )
        .to(
          ".poster-motion",
          {
            rotation: mobile ? 0 : -14,
            scale: 1.02,
            xPercent: mobile ? 0 : -63,
            duration: 0.55,
            ease: "power1.inOut",
          },
          0.38,
        )
        .to(".poster-mid", { opacity: 1, duration: 0.15, ease: "none" }, 0.24)
        .to(".poster-loose", { opacity: 0, duration: 0.15, ease: "none" }, 0.24)
        .to(".poster-tight", { opacity: 1, duration: 0.18, ease: "none" }, 0.57)
        .to(".poster-mid", { opacity: 0, duration: 0.18, ease: "none" }, 0.57)
        .to({}, { duration: 0.07 }, 0.93);
      gsap.set(".chapter-1, .chapter-2", { pointerEvents: "auto" });
    }, el);
    return () => ctx.revert();
  }, [reduced, mobile]);
  useEffect(() => {
    const stage = section.current.querySelector(".experience-stage");
    const measure = () => {
      if (!matchMedia("(max-width: 700px)").matches) {
        bands.current = null;
        return;
      }
      const bottom = stage.querySelector(".stage-footer").offsetTop - 14;
      bands.current = {
        height: stage.offsetHeight,
        list: [...stage.querySelectorAll(".chapter")].map((c) => ({
          top: c.offsetTop + c.offsetHeight + 16,
          bottom,
        })),
      };
      placePoster(stage, bands.current, chapterRef.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (bands.current)
      placePoster(
        section.current.querySelector(".experience-stage"),
        bands.current,
        chapter,
      );
  }, [chapter]);
  const goTo = (i) => {
    if (i > 2) {
      document
        .getElementById("mariana")
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      return;
    }
    const el = section.current;
    const start = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: start + (el.offsetHeight - window.innerHeight) * SCENE_STOPS[i],
      behavior: reduced ? "auto" : "smooth",
    });
  };
  return (
    <section
      className={`experience ${reduced ? "is-reduced" : ""} ${ready ? "scene-ready" : ""}`}
      ref={section}
      id="experiencia"
      aria-label="Uma experiência sobre singularidade e cuidado, ilustrada pela tripla hélice do colágeno"
    >
      <div className="experience-stage">
        <div className="stage-hairline" aria-hidden="true" />
        <div className="sculpture-poster" aria-hidden="true">
          <div className="poster-motion">
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet="/images/helix-loose-wide.webp"
              />
              <img
                className="poster-loose"
                src="/images/helix-loose.webp"
                srcSet="/images/helix-loose-small.webp 600w, /images/helix-loose.webp 1200w"
                sizes="65vw"
                alt=""
                fetchPriority="high"
                width="1200"
                height="1300"
              />
            </picture>
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet="/images/helix-mid-wide.webp"
              />
              <img
                className="poster-mid"
                src="/images/helix-mid.webp"
                alt=""
                width="1000"
                height="1100"
                loading="lazy"
              />
            </picture>
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet="/images/helix-tight-wide.webp"
              />
              <img
                className="poster-tight"
                src="/images/helix-tight.webp"
                alt=""
                width="1000"
                height="1100"
                loading="lazy"
              />
            </picture>
          </div>
        </div>
        {render3D && !reduced && (
          <Suspense fallback={null}>
            <Sculpture
              progress={progress}
              chapter={chapterRef}
              bands={bands}
              mobile={mobile}
              finish={finish}
              paused={paused}
              active={active}
              onReady={onReady}
              onFail={onFail}
            />
          </Suspense>
        )}
        <div
          className="chapter chapter-0"
          aria-hidden={!reduced && chapter !== 0}
          inert={!reduced && chapter !== 0}
        >
          <p className="eyebrow chapter-extra">
            <span className="tiny-star">✳</span> CAXIAS DO SUL · BIOMEDICINA
            ESTÉTICA
          </p>
          <h1>
            <Line>A sua beleza</Line>
            <Line>
              <em>não segue</em>
            </Line>
            <Line>um padrão.</Line>
          </h1>
          <div className="chapter-extra hero-tail">
            <p>
              Rejuvenescimento com propósito e naturalidade.
              <span className="hero-extra">
                <br />
                Uma conversa antes de qualquer escolha.
              </span>
            </p>
            <div className="hero-signature">
              <img
                src="/images/mariana-avatar.webp"
                alt=""
                width="96"
                height="96"
              />
              <span>
                Dra. Mariana Strey
                <small>
                  Biomédica esteta · {site.registration || "CRBM a confirmar"}
                </small>
              </span>
            </div>
            <Contact position="hero" variant="line">
              Começar uma conversa
            </Contact>
          </div>
        </div>
        <div
          className="chapter chapter-1"
          aria-hidden={!reduced && chapter !== 1}
          inert={!reduced && chapter !== 1}
        >
          <p className="eyebrow">01 — UM OUTRO PONTO DE VISTA</p>
          <h2>
            <Line>O conjunto.</Line>
            <Line>
              <em>Antes do</em>
            </Line>
            <Line>detalhe.</Line>
          </h2>
          <p className="chapter-description">
            Como as fibras do colágeno:
            <br />é o conjunto que dá estrutura.
          </p>
        </div>
        <div
          className="chapter chapter-2"
          aria-hidden={!reduced && chapter !== 2}
          inert={!reduced && chapter !== 2}
        >
          <p className="eyebrow">02 — CADA ESCOLHA TEM SEU TEMPO</p>
          <h2>
            <Line>Precisão</Line>
            <Line>
              <em>é também</em>
            </Line>
            <Line>saber parar.</Line>
          </h2>
          <p className="chapter-description">
            Possibilidades, limites e próximos passos.
            <br />
            Uma decisão de cada vez.
          </p>
          <a className="text-link" href="#mariana">
            Conheça a Mariana <Arrow />
          </a>
        </div>
        <div className="stage-footer">
          <button
            className="scroll-cue"
            onClick={() => goTo(chapter + 1)}
            aria-label="Avançar na experiência"
          >
            <span className="scroll-line" /> <span>ROLE PARA DESCOBRIR</span>
          </button>
          <div className="chapter-nav" aria-label="Etapas da experiência">
            {["Identidade", "Proporção", "Cuidado"].map((label, i) => (
              <button
                key={label}
                aria-label={`0${i + 1} ${label}`}
                aria-current={chapter === i ? "step" : undefined}
                onClick={() => goTo(i)}
              >
                <span>0{i + 1}</span>
                <b>{label}</b>
              </button>
            ))}
          </div>
          {ready && !failed ? (
            <div className="scene-tools">
              <span className="drag-hint">ARRASTE PARA GIRAR</span>
              <button
                className={`finish-dot champagne ${finish === "champagne" ? "selected" : ""}`}
                aria-label="Acabamento champanhe"
                aria-pressed={finish === "champagne"}
                onClick={() => setFinish("champagne")}
              />
              <button
                className={`finish-dot pearl ${finish === "pearl" ? "selected" : ""}`}
                aria-label="Acabamento pérola"
                aria-pressed={finish === "pearl"}
                onClick={() => setFinish("pearl")}
              />
              <button
                className="pause-button"
                aria-label={
                  paused ? "Retomar movimento sutil" : "Pausar movimento sutil"
                }
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? "▷" : "Ⅱ"}
              </button>
            </div>
          ) : (
            <span className="art-label">
              COLÁGENO <span>— TRIPLA HÉLICE</span>
            </span>
          )}
        </div>
        <div className="experience-progress" aria-hidden="true">
          <span className="experience-progress-fill" />
        </div>
      </div>
    </section>
  );
}
function placePoster(stage, bands, chapter) {
  const band = bands.list[chapter];
  stage.style.setProperty("--band-top", `${band.top}px`);
  stage.style.setProperty("--band-bottom", `${bands.height - band.bottom}px`);
}
function Line({ children }) {
  return (
    <span className="display-line">
      <span className="line-inner">{children}</span>
    </span>
  );
}

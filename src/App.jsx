import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./experience/Experience.jsx";
import { Contact, Arrow, Mark, Portrait } from "./components/UI.jsx";
import { site, procedures } from "./site.config.mjs";
import { mapHref } from "./lib.mjs";
import { applyConsent, getConsent, track } from "./tracking.mjs";
gsap.registerPlugin(ScrollTrigger);

function Header() {
  const [light, setLight] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    let frame;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const s = document.querySelector(".about");
        const r = s?.getBoundingClientRect();
        setLight(Boolean(r && r.top <= 104 && r.bottom > 104));
      });
    };
    const esc = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("keydown", esc);
    check();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("keydown", esc);
    };
  }, []);
  return (
    <header
      className={`header ${light ? "on-light" : ""} ${menu ? "menu-open" : ""}`}
    >
      <a href="/" className="brand" aria-label="Mariana Strey, início">
        <Mark />
        <span>
          MARIANA STREY<small>BIOMEDICINA ESTÉTICA</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Principal">
        <a href="/#mariana">A Mariana</a>
        <a href="/#cuidados">Cuidados</a>
        <a href="/#contato">Localização</a>
      </nav>
      <div className="header-actions">
        <Contact position="header" variant="outline">
          Agendar <span className="desktop-label">avaliação</span>
        </Contact>
        <button
          className="menu-toggle"
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          <span />
          <span />
        </button>
      </div>
      {menu && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Navegação móvel"
        >
          {[
            ["A experiência", "experiencia"],
            ["A Mariana", "mariana"],
            ["Cuidados", "cuidados"],
            ["Localização", "contato"],
          ].map(([text, id], i) => (
            <a key={id} href={`/#${id}`} onClick={() => setMenu(false)}>
              <small>0{i + 1}</small>
              {text}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
function About() {
  return (
    <section className="about" id="mariana">
      <div className="about-topline">
        <span>03 — A PESSOA POR TRÁS DO CUIDADO</span>
        <span>ESCUTA. CRITÉRIO. PRESENÇA.</span>
      </div>
      <div className="about-grid">
        <div className="portrait-composition reveal">
          <div className="portrait-frame">
            <Portrait />
          </div>
          <span className="portrait-side">
            MARIANA STREY — CAXIAS DO SUL / RS
          </span>
          <div className="portrait-caption">
            <span>Mariana Strey</span>
            <small>Biomédica esteta</small>
          </div>
          <span className="portrait-seal" aria-hidden="true">
            <Mark />
          </span>
        </div>
        <div className="about-copy">
          <span className="eyebrow reveal">PRAZER, MARIANA.</span>
          <h2 className="reveal">
            Antes de
            <br />
            qualquer escolha,
            <br />
            <em>uma conversa.</em>
          </h2>
          <p className="about-intro reveal">
            Você não precisa chegar com um procedimento escolhido. Pode chegar
            com uma dúvida. Com algo que quer mudar. Ou com algo que quer
            preservar.
          </p>
          <div className="about-detail reveal">
            <span>01</span>
            <p>Entender sua intenção.</p>
          </div>
          <div className="about-detail reveal">
            <span>02</span>
            <p>Conversar sobre possibilidades e limites.</p>
          </div>
          <div className="about-detail reveal">
            <span>03</span>
            <p>Decidir o próximo passo com clareza.</p>
          </div>
          <Contact position="about" variant="line" className="reveal">
            Conversar com a equipe
          </Contact>
        </div>
      </div>
    </section>
  );
}
const shortCare = [
  ["Harmonização facial", "O rosto como um conjunto.", "harmonizacao-facial"],
  ["Lábios", "Forma, contorno e proporção.", "preenchimento-labial"],
  [
    "Qualidade da pele",
    "Textura, firmeza e cuidado.",
    "bioestimuladores-de-colageno",
  ],
  ["Linhas de expressão", "Um olhar para o movimento.", "toxina-botulinica"],
];
function Care() {
  const [selected, setSelected] = useState(null);
  return (
    <section className="care" id="cuidados">
      <div className="care-heading">
        <span className="eyebrow reveal">04 — POSSIBILIDADES</span>
        <h2 className="reveal">
          O que você
          <br />
          quer <em>cuidar?</em>
        </h2>
        <p className="reveal">
          Comece pelo que importa para você.
          <br />A indicação vem depois da avaliação.
        </p>
        <span className="care-art" aria-hidden="true">
          m.
        </span>
      </div>
      <div className="care-list reveal">
        {shortCare.map(([label, short, slug], i) => {
          const p = procedures.find((x) => x.slug === slug);
          const open = selected === i;
          return (
            <div className={`care-item ${open ? "is-open" : ""}`} key={slug}>
              <button
                className="care-trigger"
                onClick={() => setSelected(open ? null : i)}
                aria-expanded={open}
                aria-controls={`care-${slug}`}
              >
                <span className="care-number">0{i + 1}</span>
                <span className="care-name">
                  {label}
                  <small>{short}</small>
                </span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </button>
              {open && (
                <div className="care-panel" id={`care-${slug}`}>
                  <p>{p.intro}</p>
                  <p className="care-boundary">{p.boundary}</p>
                  <div className="care-links">
                    <Contact
                      label={p.label}
                      position="procedure"
                      variant="line"
                    >
                      Tirar minha dúvida
                    </Contact>
                    <a href={`/procedimentos/${slug}/`}>
                      Indicação e cuidados <Arrow diagonal />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <a href="/procedimentos/microagulhamento/" className="all-care">
          Também quero entender os cuidados com a textura da pele{" "}
          <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
const questions = [
  [
    "Preciso saber qual procedimento quero?",
    "Não. Conte o que você deseja entender, mudar ou preservar. A avaliação ajuda a discutir possibilidades, limites e também a opção de não realizar um procedimento.",
  ],
  [
    "Como funciona o agendamento?",
    "A conversa começa pelo WhatsApp. A equipe confirma o local, os horários disponíveis, o valor da avaliação e as condições de reserva antes de você decidir.",
  ],
  [
    "E sobre resultado, riscos e recuperação?",
    "Esses pontos dependem da técnica e da sua avaliação. Procedimentos podem ter contraindicações, reações e intercorrências. Pergunte sobre os riscos, os cuidados e o acompanhamento antes de contratar. Nenhum resultado pode ser garantido.",
  ],
];
function Questions() {
  return (
    <section className="questions">
      <p className="eyebrow">ANTES DE AGENDAR</p>
      <div>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function Closing() {
  return (
    <section className="closing" id="contato">
      <div className="closing-top">
        <span className="eyebrow">05 — SEU PRÓXIMO PASSO</span>
        <span className="closing-place">SÃO PELEGRINO · CAXIAS DO SUL</span>
      </div>
      <div className="closing-main">
        <h2 className="reveal">
          Vamos começar
          <br />
          pela sua <em>dúvida.</em>
        </h2>
        <Contact position="final" className="closing-contact">
          Agendar minha avaliação
        </Contact>
      </div>
      <div className="closing-bottom">
        <p>
          Um passo de cada vez.
          <br />O primeiro pode ser uma conversa.
        </p>
        <a
          href={mapHref()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("map_click", { position: "location" })}
        >
          <span>
            {site.street}, {site.suite}
            <small>
              {site.neighborhood} · {site.city}, RS
            </small>
          </span>
          <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
function Footer({ onPrivacy }) {
  return (
    <footer className="footer">
      <div className="footer-signature" aria-hidden="true">
        mariana strey<span>MS</span>
      </div>
      <div className="footer-links">
        <span>© {new Date().getFullYear()} Mariana Strey</span>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("instagram_click")}
        >
          Instagram <Arrow diagonal />
        </a>
        <a href="/privacidade/">Privacidade</a>
        <button onClick={onPrivacy}>Cookies</button>
        <a href="#top" className="back-top">
          Voltar ao topo ↑
        </a>
      </div>
      <p className="regulatory">
        {site.name} · {site.profession} ·{" "}
        {site.registration || "[CRBM-5: a confirmar]"}
        <br />
        {site.legalName} ·{" "}
        {site.companyRegistration || "[Registro PJ: a confirmar]"} ·{" "}
        {site.qualification || "[Habilitação: a confirmar]"}
        <br />
        Horários: {site.hours || "[a confirmar]"}. Conceito privado em revisão.
        A escultura é um estudo artístico, sem representação de procedimento ou
        resultado.
      </p>
    </footer>
  );
}
function StickyContact() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const intro = document.querySelector(".experience");
      setVisible(window.scrollY > (intro ? intro.offsetHeight - 160 : 180));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className={`sticky-contact ${visible ? "visible" : ""}`}>
      <span>SUA DÚVIDA É UM COMEÇO.</span>
      <Contact position="sticky">Agendar avaliação</Contact>
    </div>
  );
}
function Consent({ open, close }) {
  const dialog = useRef();
  const [allow, setAllow] = useState(false);
  useEffect(() => {
    if (open) {
      setAllow(Boolean(getConsent()?.analytics));
      if (!dialog.current.open) dialog.current.showModal();
    } else dialog.current?.close();
  }, [open]);
  const save = (value) => {
    applyConsent({ analytics: value, marketing: false });
    close();
  };
  return (
    <dialog
      className="consent"
      ref={dialog}
      onCancel={() => save(false)}
      aria-labelledby="consent-heading"
    >
      <span className="eyebrow">PRIVACIDADE</span>
      <h2 id="consent-heading">Você escolhe.</h2>
      <p>
        O contato funciona sem cookies de análise. Sua dúvida e seu interesse
        clínico não são enviados para plataformas de anúncios.
      </p>
      <label>
        <input
          type="checkbox"
          checked={allow}
          onChange={(e) => setAllow(e.target.checked)}
        />
        Permitir análise de navegação
      </label>
      <div>
        <button onClick={() => save(allow)}>Salvar escolha</button>
        <button onClick={() => save(false)}>Continuar sem análise</button>
      </div>
      <a href="/privacidade/">Ler política de privacidade</a>
    </dialog>
  );
}
function Privacy() {
  return (
    <main className="document-page">
      <a className="text-link" href="/">
        ← Voltar à experiência
      </a>
      <p className="eyebrow">TRANSPARÊNCIA</p>
      <h1>
        Privacidade
        <br />
        <em>e escolhas.</em>
      </h1>
      <p>
        Versão de 18 de outubro de 2026. Texto em revisão pela responsável antes
        da divulgação pública.
      </p>
      <h2>Responsável pelo site</h2>
      <p>
        {site.legalName}. {site.street}, {site.suite}, {site.city},{" "}
        {site.region}. Contato para exercer seus direitos:{" "}
        {site.privacyContact || "[CONTATO DE PRIVACIDADE A CONFIRMAR]"}.
      </p>
      <h2>Contato e dados de saúde</h2>
      <p>
        O site não recebe anamnese ou arquivos clínicos. O WhatsApp é um serviço
        externo. A mensagem sugerida inclui o assunto escolhido e uma referência
        de origem. Você pode editar ou apagar o texto antes de enviá-lo. Evite
        enviar dados de saúde no primeiro contato.
      </p>
      <h2>Cookies e medição</h2>
      <p>
        A preferência de cookies fica armazenada no seu navegador. Por padrão,
        não carregamos análise ou anúncios. Se o Google Analytics for ativado
        após revisão e você consentir, ele poderá receber eventos gerais.
        Interesse em procedimento, telefone, mensagens e parâmetros brutos da
        URL não são enviados. Meta Pixel, API de Conversões e gravação de
        sessões permanecem desativados.
      </p>
      <h2>Finalidade, base e retenção</h2>
      <p>
        Mensagens voluntárias são usadas para responder ao contato e discutir o
        agendamento. A clínica deve validar as bases legais de cada etapa,
        incluindo dados sensíveis, prazos de retenção e operadores. Essas
        informações serão completadas antes da divulgação pública.
      </p>
      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar confirmação, acesso, correção e as demais medidas
        cabíveis na LGPD. Consentimentos opcionais podem ser revogados nas
        preferências de cookies. A eliminação está sujeita às hipóteses legais
        de conservação.
      </p>
      <h2>Serviços externos</h2>
      <p>
        WhatsApp, Instagram e Google Maps têm suas próprias políticas. Não
        incorporamos automaticamente mapas ou feeds sociais.
      </p>
    </main>
  );
}
function Procedure({ p }) {
  return (
    <main className="document-page procedure-page">
      <a className="text-link" href="/#cuidados">
        ← Todos os cuidados
      </a>
      <p className="eyebrow">AVALIAÇÃO INDIVIDUAL · CAXIAS DO SUL</p>
      <h1>
        {p.label}
        <em> com critério.</em>
      </h1>
      <p className="document-intro">{p.intro}</p>
      <Contact position="hero" label={p.label}>
        Conversar sobre minha avaliação
      </Contact>
      <dl>
        {[
          ["Para quem", p.audience],
          ["O que avaliar", p.focus],
          ["Duração", p.duration],
          ["Sessão", p.session],
          ["Recuperação", p.recovery],
          ["Limites e riscos", p.boundary],
        ].map(([q, a]) => (
          <div key={q}>
            <dt>{q}</dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
      <Contact position="procedure" label={p.label} variant="line">
        Tirar minha dúvida com a equipe
      </Contact>
    </main>
  );
}
function Bio() {
  return (
    <main className="bio-page">
      <Mark />
      <p className="eyebrow">BIOMEDICINA ESTÉTICA · CAXIAS DO SUL</p>
      <h1>
        Mariana <em>Strey.</em>
      </h1>
      <p>Um olhar para o que é só seu.</p>
      <Contact position="bio">Agendar avaliação</Contact>
      <a href="/">
        Conhecer a experiência <Arrow diagonal />
      </a>
      <a href="/#cuidados">
        Possibilidades de cuidado <Arrow diagonal />
      </a>
      <a href={mapHref()}>
        Como chegar <Arrow diagonal />
      </a>
    </main>
  );
}
export default function App({ initialPath }) {
  const path =
    initialPath || (typeof window !== "undefined" ? location.pathname : "/");
  const [privacy, setPrivacy] = useState(false);
  const p = procedures.find((x) => path.includes(`/procedimentos/${x.slug}`));
  const landing =
    !p && !path.startsWith("/privacidade") && !path.startsWith("/links");
  useEffect(() => {
    const c = getConsent();
    if (c) applyConsent(c, false);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils
        .toArray(".reveal")
        .forEach((el) =>
          gsap.fromTo(
            el,
            { y: 38, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 91%", once: true },
            },
          ),
        );
    });
    return () => ctx.revert();
  }, [path]);
  return (
    <>
      <div id="top" />
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <div id="main">
        {landing ? (
          <main>
            <Experience />
            <About />
            <Care />
            <Questions />
            <Closing />
          </main>
        ) : p ? (
          <Procedure p={p} />
        ) : path.startsWith("/privacidade") ? (
          <Privacy />
        ) : (
          <Bio />
        )}
      </div>
      <Footer onPrivacy={() => setPrivacy(true)} />
      <StickyContact />
      <Consent open={privacy} close={() => setPrivacy(false)} />
    </>
  );
}

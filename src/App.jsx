import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./experience/Experience.jsx";
import Results from "./components/Results.jsx";
import { Contact, Arrow, Mark, Portrait } from "./components/UI.jsx";
import { site, procedures } from "./site.config.mjs";
import { mapHref, resultCases } from "./lib.mjs";
import { applyConsent, getConsent, track } from "./tracking.mjs";
gsap.registerPlugin(ScrollTrigger);

function Header() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return (
    <header className={`header ${menu ? "menu-open" : ""}`}>
      <a href="/" className="brand" aria-label="Mariana Strey, início">
        <Mark />
        <span>
          MARIANA STREY<small>BIOMEDICINA ESTÉTICA</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Principal">
        <a href="/#resultados">Resultados</a>
        <a href="/#mariana">A Mariana</a>
        <a href="/#cuidados">Cuidados</a>
        <a href="/#primeira-consulta">Primeira consulta</a>
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
            ["Resultados", "resultados"],
            ["A Mariana", "mariana"],
            ["Cuidados", "cuidados"],
            ["Primeira consulta", "primeira-consulta"],
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
        <span>04 — A PESSOA POR TRÁS DO CUIDADO</span>
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
          <p className="about-solo reveal">
            Quem te avalia é quem te atende.
            <small>
              Do primeiro contato ao retorno, é a Mariana com você. Sem
              intermediários.
            </small>
          </p>
          <a className="about-next reveal" href="#primeira-consulta">
            Como é a primeira consulta <Arrow />
          </a>
          <Contact position="about" variant="line" className="reveal">
            Conversar com a Mariana
          </Contact>
        </div>
      </div>
    </section>
  );
}
// The technical name first, then what it means in everyday words.
const shortCare = [
  ["Perfiloplastia", "Nariz, lábios, queixo e mandíbula em equilíbrio.", "perfiloplastia"],
  ["Harmonização facial", "O rosto como um conjunto.", "harmonizacao-facial"],
  ["Preenchimento labial", "Contorno, definição e proporção.", "preenchimento-labial"],
  ["Bioestimuladores de colágeno", "Firmeza e qualidade da pele.", "bioestimuladores-de-colageno"],
  ["Toxina botulínica", "Linhas de expressão e movimento.", "toxina-botulinica"],
  ["Microagulhamento", "Textura e viço da pele.", "microagulhamento"],
];
function Care() {
  const [selected, setSelected] = useState(null);
  return (
    <section className="care" id="cuidados">
      <div className="care-heading">
        <span className="eyebrow reveal">05 — O QUE ELA FAZ</span>
        <h2 className="reveal">
          O que você
          <br />
          quer <em>cuidar?</em>
        </h2>
        <p className="reveal">
          Rejuvenescimento e perfiloplastia, com técnicas autorais.
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
                <span className="care-number">{p.number}</span>
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
      </div>
    </section>
  );
}
const visitSteps = [
  [
    "Você manda uma mensagem",
    "Pelo WhatsApp, direto com a Mariana. Ela combina o horário e informa o valor da avaliação antes de você confirmar.",
  ],
  [
    "Uma conversa sem pressa",
    "No consultório, em São Pelegrino, ela ouve o que você quer mudar e o que quer preservar, e conhece o seu histórico de saúde e de procedimentos.",
  ],
  [
    "O rosto avaliado como um todo",
    "Proporção, pele e movimento são olhados em conjunto, antes de qualquer detalhe.",
  ],
  [
    "Um plano claro, ou nenhum procedimento",
    "Você sai sabendo o que é indicado, as etapas, os cuidados, os riscos e os valores, e decide com calma. Às vezes, a melhor indicação é esperar.",
  ],
];
function FirstVisit() {
  return (
    <section className="visit" id="primeira-consulta">
      <div className="visit-heading">
        <span className="eyebrow reveal">06 — SUA PRIMEIRA CONSULTA</span>
        <h2 className="reveal">
          Como é a
          <br />
          <em>primeira consulta.</em>
        </h2>
        <p className="reveal">Quatro passos, do primeiro contato ao plano. Quem conduz todos é a Mariana.</p>
      </div>
      <div className="visit-body">
        <ol className="visit-steps">
          {visitSteps.map(([title, text], i) => (
            <li className="reveal" key={title}>
              <span className="visit-number">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Contact position="evaluation" variant="line" className="reveal">
          Agendar minha avaliação
        </Contact>
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
    "A conversa começa pelo WhatsApp, direto com a Mariana. Ela confirma o local, os horários disponíveis, o valor da avaliação e as condições de reserva antes de você decidir.",
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
        <span className="eyebrow">07 — SEU PRÓXIMO PASSO</span>
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
        {[site.name, site.profession, site.registration, site.qualification]
          .filter(Boolean)
          .join(" · ")}
        <br />
        {site.street}, {site.suite} · {site.neighborhood} · {site.city}/
        {site.region}
        {site.hours ? ` · Atendimento: ${site.hours}` : ""}
        <br />A hélice ilustra a estrutura do colágeno, sem representação de
        procedimento ou resultado.
      </p>
    </footer>
  );
}
function StickyContact() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const intro = document.querySelector(".experience");
      // Out of the way while the fibre crosses the before/after: that moment gets the whole screen.
      const r = document.querySelector(".results-track")?.getBoundingClientRect();
      const inResults = r && r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
      setVisible(!inResults && window.scrollY > (intro ? intro.offsetHeight - 160 : 180));
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
      <p>Versão de 13 de novembro de 2026.</p>
      <h2>Responsável pelo site</h2>
      <p>
        {site.legalName}, {site.profession.toLowerCase()} ({site.registration}),
        que atende como pessoa física. {site.street}, {site.suite},{" "}
        {site.neighborhood}, {site.city}/{site.region}. Ela também é a
        encarregada pelos dados. Contato para exercer seus direitos:{" "}
        {site.privacyContact}.
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
        As mensagens que você envia são usadas para responder ao seu contato e
        combinar a avaliação, como procedimento preliminar a seu pedido (LGPD,
        art. 7º, V). Se você se tornar paciente, os dados do atendimento seguem
        as regras do prontuário e são guardados pelo prazo legal de 20 anos a
        partir do último registro. A análise de navegação, quando ativada,
        depende do seu consentimento (art. 7º, I) e pode ser desligada a
        qualquer momento nas preferências de cookies.
      </p>
      <h2>Fotos de pacientes</h2>
      <p>
        As fotos de antes e depois mostradas aqui são de pacientes reais da
        Mariana, sem filtro e sem retoque, e só aparecem com a autorização
        escrita de cada paciente, que pode ser revogada a qualquer momento.
        Revogada a autorização, a foto sai do site. Os arquivos publicados não
        guardam localização nem dados do aparelho.
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
        Tirar minha dúvida com a Mariana
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
  const cases = resultCases();
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
            {cases.length > 0 && <Results cases={cases} />}
            <About />
            <Care />
            <FirstVisit />
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

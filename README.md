# Mariana Strey — Além do padrão / V2

> Resumo do projeto (o que é, onde está no ar, decisões, pendências, como retomar): **[RESUMO.md](RESUMO.md)**.

Experiência editorial com 3D integrado à landing principal. A nova direção substitui a versão anterior: uma narrativa curta em três atos, seguida da apresentação da profissional, cuidados expansíveis e contato.

## Rodar

Node 22+ e npm.

```sh
npm ci
npm run dev
npm run check
npm run build
```

A saída estática está em `dist/`. Dez rotas são pré-renderizadas. Docker/Nginx continuam disponíveis. O build não precisa de Python nem de bibliotecas gráficas: os modelos e renders já estão incluídos.

## Narrativa e interface

1. **Identidade:** abertura com “A sua beleza não segue um padrão”, três fibras soltas, retrato e CRBM da Mariana e convite para conversar.
2. **Proporção:** as fibras começam a se enrolar; títulos entram linha a linha acompanhando o scroll.
3. **Cuidado:** as fibras fecham a tripla hélice do colágeno; a composição troca de lado.
4. **Resultado real (antes e depois):** uma fibra da hélice atravessa a foto conforme a rolagem; por onde ela passa, o antes vira o depois. No fim, um controle permite arrastar e comparar. Título e foto ficam fixos na tela enquanto a fibra passa (palco `sticky`, rolagem nativa). Sem fotos, mostra o espaço reservado na versão de revisão.
5. **Mariana:** transição para nude e retrato real. Atendimento feito só por ela (“Quem te avalia é quem te atende”).
6. **O que ela faz:** seis procedimentos com o nome técnico (Perfiloplastia, Harmonização facial, Preenchimento labial, Bioestimuladores de colágeno, Toxina botulínica, Microagulhamento) e a explicação simples.
7. **Primeira consulta:** quatro passos, ligados pela mesma fibra.
8. **Agendamento:** três perguntas, WhatsApp, endereço e Instagram.

O scroll permanece nativo, sem interceptar a rolagem. A composição móvel tem enquadramento próprio. O cabeçalho mantém acesso ao agendamento; a barra inferior aparece após a narrativa para não cobrir os controles do objeto.

## Arquitetura

```text
src/
  App.jsx                     # Navegação, conteúdo, primeira consulta, páginas auxiliares e privacidade
  components/UI.jsx           # CTA, retrato, marca e ícones
  components/Results.jsx      # Antes e depois: fibra que atravessa a foto + controle de comparação
  experience/
    Experience.jsx            # Palco sticky, títulos e timeline GSAP
    Sculpture.jsx             # Canvas R3F, materiais, luz, interação e limites de DPR
    helix.mjs                 # Geometria da tripla hélice (fibras solto → enrolado)
    fiber.mjs                 # Fibra do antes e depois: onda, recorte e coreografia da rolagem
    choreography.mjs          # Poses, giro e quanto a hélice está enrolada
  site.config.mjs             # Dados reais, conteúdo e revisão
  lib.mjs                     # WhatsApp/UTMs, schema e gate de divulgação
  tracking.mjs                # Consentimento e eventos institucionais
  styles.css                  # Tokens e composições responsivas
public/
  images/helix-*.webp         # Renders da hélice para quando não há WebGL
  images/mariana-*            # Retrato público e avatar do topo
scripts/
  prerender.mjs
  core.test.mjs
  release-check.mjs
  render-assets.mjs           # Gera renders da hélice, avatar e imagem de compartilhamento
  preparar-fotos.mjs          # Antes e depois: corte igual, sem metadados, AVIF/WebP 600/1200
```

## 3D

A **tripla hélice do colágeno** é gerada no código (`src/experience/helix.mjs`), sem arquivo de modelo. São três fibras que começam soltas e se enrolam conforme o scroll, até formar a hélice. É uma ilustração da estrutura do colágeno; não representa procedimento ou previsão de resultado.

- Three.js / React Three Fiber / Drei; a geometria é recalculada só quando a hélice muda de estado.
- Rotação por mouse/toque com amortecimento; gesto vertical preservado no celular.
- Dois acabamentos: champanhe e pérola; botão para pausar a flutuação.
- GSAP dirige pose, luz, enquadramento e o quanto a hélice está enrolada.
- Materiais PBR, ambiente de estúdio local, sem CDN de ambiente ou textura.
- Renderiza em até 2× com antisserrilhado; cai para 1,5× (mínimo 1,25×) se o aparelho não sustentar os quadros.
- No celular, `Experience.jsx` mede o espaço livre entre o texto de cada capítulo e a barra inferior, e a hélice (e o render de fallback) é encaixada nesse espaço. Ela nunca fica por cima do texto, em qualquer altura de tela.
- Renderização suspensa fora da experiência.
- WebGL indisponível: renders da mesma hélice (solta, meio, enrolada), em versão vertical (desktop) e horizontal (`*-wide`, celular).
- Movimento reduzido: conteúdo estático e legível; economia de dados: não baixa a cena.

Para regerar os renders, o avatar e `og-mariana.jpg` depois de mudar a hélice ou as cores: `npm i --no-save puppeteer-core && node scripts/render-assets.mjs` (usa o Chrome ou Edge instalado). As cores do material ficam em `Sculpture.jsx` e `render-assets.client.mjs`; mantenha as duas iguais.

## Paleta

Tirada do feed dela: marfim (`#f7f2ec`), nude (`#ede3d8`), caramelo (`#875935`), champanhe (`#c9a27e`) e chocolate (`#3a2a20`). Fechamento e rodapé em chocolate. Tokens em `src/styles.css`.

## Conteúdo e publicação

Domínio: https://dramarianastrey.com.br. O CRBM-5 6569 veio da bio pública do Instagram (@dramarianastrey).

Conteúdo, retrato, escopo e privacidade foram aprovados pelo Nicolas em nome da Mariana (autorização total, 2026-11-13). Ela atende como pessoa física, sem CNPJ.

Por decisão do Nicolas: sem habilitação, sem horário fixo (hora marcada pelo WhatsApp) e sem o tempo entre o antes e o depois. Com isso, `canRelease()` libera a indexação no Google desde 2026-11-13.

Regras, deploy e o passo a passo das fotos de antes e depois: [CLAUDE.md](CLAUDE.md).

O retrato e os dados públicos vieram das fontes registradas em `docs/estrategia-mariana-strey.md`. O documento da V1 continua como pesquisa e referência de conteúdo/compliance; seus wireframes, direção de arte e orçamento técnico foram substituídos por esta V2.

Google Analytics sem ID ativo. Pixel, CAPI e gravação de sessões permanecem desativados. Mensagens do WhatsApp são editáveis e não são enviadas automaticamente. Não há depoimentos, notas, números de pacientes ou credenciais inventadas.

## Verificação

Ver `docs/validacao-v2.md`. Os testes cobrem WhatsApp/UTMs, dados não inventados, gate de divulgação e invariantes da coreografia. A malha foi aberta com o GLTFLoader real e renderizada offline. O navegador de QA não oferece WebGL; a cena WebGL e o FPS precisam de avaliação num dispositivo compatível.

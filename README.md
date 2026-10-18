# Mariana Strey — Além do padrão / V2

Experiência editorial com 3D integrado à landing principal. A nova direção substitui a versão anterior: uma narrativa curta em três atos, seguida da apresentação da profissional, cuidados expansíveis e contato.

## Rodar

Node 22+ e npm.

```sh
npm ci
npm run dev
npm run check
npm run build
```

A saída estática está em `dist/`. Nove rotas são pré-renderizadas. Docker/Nginx continuam disponíveis. O build não precisa de Python nem de bibliotecas gráficas: os modelos e renders já estão incluídos.

## Narrativa e interface

1. **Identidade:** abertura com “A sua beleza não segue um padrão”, três fibras soltas, retrato e CRBM da Mariana e convite para conversar.
2. **Proporção:** as fibras começam a se enrolar; títulos entram linha a linha acompanhando o scroll.
3. **Cuidado:** as fibras fecham a tripla hélice do colágeno; a composição troca de lado.
4. **Mariana:** transição para nude e retrato real. Atendimento feito só por ela (“Quem te avalia é quem te atende”) e três etapas curtas da conversa.
5. **Cuidados:** quatro linhas expansíveis e acesso ao conteúdo sobre textura da pele.
6. **Agendamento:** três perguntas, WhatsApp, endereço e Instagram.

O scroll permanece nativo, sem interceptar a rolagem. A composição móvel tem enquadramento próprio. O cabeçalho mantém acesso ao agendamento; a barra inferior aparece após a narrativa para não cobrir os controles do objeto.

## Arquitetura

```text
src/
  App.jsx                     # Navegação, conteúdo, páginas auxiliares e privacidade
  components/UI.jsx           # CTA, retrato, marca e ícones
  experience/
    Experience.jsx            # Palco sticky, títulos e timeline GSAP
    Sculpture.jsx             # Canvas R3F, materiais, luz, interação e limites de DPR
    helix.mjs                 # Geometria da tripla hélice (fibras solto → enrolado)
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
```

## 3D

A **tripla hélice do colágeno** é gerada no código (`src/experience/helix.mjs`), sem arquivo de modelo. São três fibras que começam soltas e se enrolam conforme o scroll, até formar a hélice. É uma ilustração da estrutura do colágeno; não representa procedimento ou previsão de resultado.

- Three.js / React Three Fiber / Drei; a geometria é recalculada só quando a hélice muda de estado.
- Rotação por mouse/toque com amortecimento; gesto vertical preservado no celular.
- Dois acabamentos: champanhe e pérola; botão para pausar a flutuação.
- GSAP dirige pose, luz, enquadramento e o quanto a hélice está enrolada.
- Materiais PBR, ambiente de estúdio local, sem CDN de ambiente ou textura.
- DPR limitado e reduzido quando o orçamento de quadros se deteriora.
- Renderização suspensa fora da experiência.
- WebGL indisponível: renders da mesma hélice (solta, meio, enrolada).
- Movimento reduzido: conteúdo estático e legível; economia de dados: não baixa a cena.

Para regerar os renders, o avatar e `og-mariana.jpg` depois de mudar a hélice ou as cores: `npm i --no-save puppeteer-core && node scripts/render-assets.mjs` (usa o Chrome ou Edge instalado). As cores do material ficam em `Sculpture.jsx` e `render-assets.client.mjs`; mantenha as duas iguais.

## Paleta

Tirada do feed dela: marfim (`#f7f2ec`), nude (`#ede3d8`), caramelo (`#875935`), champanhe (`#c9a27e`) e chocolate (`#3a2a20`). Fechamento e rodapé em chocolate. Tokens em `src/styles.css`.

## Conteúdo e publicação

Esta é uma versão privada para revisão. O CRBM-5 6569 veio da bio pública do Instagram (@dramarianastrey). Registro PJ, habilitação, horários, autorização das fotos, escopo profissional, política e demais dados precisam de confirmação. `canRelease()` mantém `noindex` enquanto esses dados e aprovações não estão completos. Não preencher por inferência.

O retrato e os dados públicos vieram das fontes registradas em `docs/estrategia-mariana-strey.md`. O documento da V1 continua como pesquisa e referência de conteúdo/compliance; seus wireframes, direção de arte e orçamento técnico foram substituídos por esta V2.

Google Analytics sem ID ativo. Pixel, CAPI e gravação de sessões permanecem desativados. Mensagens do WhatsApp são editáveis e não são enviadas automaticamente. Não há depoimentos, notas, números de pacientes ou credenciais inventadas.

## Verificação

Ver `docs/validacao-v2.md`. Os testes cobrem WhatsApp/UTMs, dados não inventados, gate de divulgação e invariantes da coreografia. A malha foi aberta com o GLTFLoader real e renderizada offline. O navegador de QA não oferece WebGL; a cena WebGL e o FPS precisam de avaliação num dispositivo compatível.

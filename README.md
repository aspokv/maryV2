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

1. **Identidade:** abertura com “A sua beleza não segue um padrão”, objeto em cobre e convite para conversar.
2. **Proporção:** câmera percorre a forma; títulos entram linha a linha acompanhando o scroll.
3. **Cuidado:** as três peças se abrem e retornam ao conjunto; a composição troca de lado.
4. **Mariana:** transição para marfim e retrato real. Três etapas curtas da conversa.
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
    choreography.mjs          # Poses da câmera, rotação e separação das peças
  site.config.mjs             # Dados reais, conteúdo, revisão e caminho do modelo
  lib.mjs                     # WhatsApp/UTMs, schema e gate de divulgação
  tracking.mjs                # Consentimento e eventos institucionais
  styles.css                  # Tokens e composições responsivas
public/
  models/singular.glb         # Escultura original, 3 partes, sem textura externa
  images/singular-*.webp      # Renders originais de fallback
  images/mariana-*            # Retrato público usado no conceito privado
  draco/                     # Decodificador local para GLBs substitutos
scripts/
  prerender.mjs
  core.test.mjs
  release-check.mjs
  create-sculpture.py         # Autoria opcional da malha e renders via OpenGL/EGL
```

## 3D

A escultura **Singular** é uma malha original de fita entrelaçada, com 26.508 triângulos. Não representa anatomia, procedimento ou previsão de resultado. Nenhum modelo de paciente ou banco de imagens foi usado para construí-la.

- Three.js / React Three Fiber / Drei; GLB carregado de forma assíncrona.
- Rotação por mouse/toque com amortecimento; gesto vertical preservado no celular.
- Dois acabamentos: cobre e pérola; botão para pausar a flutuação.
- GSAP dirige pose, luz, enquadramento, abertura e recomposição pelo scroll.
- Materiais PBR, ambiente de estúdio local, sem CDN de ambiente ou textura.
- DPR limitado e reduzido quando o orçamento de quadros se deteriora.
- Renderização suspensa fora da experiência.
- WebGL indisponível: renders do mesmo objeto com transições de enquadramento e abertura.
- Movimento reduzido: conteúdo estático e legível; economia de dados: não baixa a cena.
- Não há promessa de 60 fps: falta medição em aparelhos reais.

Para substituir o GLB, alterar `sculptureConfig.path` e `parts` em `site.config.mjs`. As peças precisam ter a geometria em coordenadas comuns, com transformações aplicadas no arquivo. Um GLB Draco pode usar o decodificador incluído. O modelo atual não usa compressão Draco e não tem texturas.

## Conteúdo e publicação

Esta é uma versão privada para revisão. Registro profissional/PJ, habilitação, horários, autorização das fotos, escopo profissional, política e demais dados precisam de confirmação. `canRelease()` mantém `noindex` enquanto esses dados e aprovações não estão completos. Não preencher por inferência.

O retrato e os dados públicos vieram das fontes registradas em `docs/estrategia-mariana-strey.md`. O documento da V1 continua como pesquisa e referência de conteúdo/compliance; seus wireframes, direção de arte e orçamento técnico foram substituídos por esta V2.

Google Analytics sem ID ativo. Pixel, CAPI e gravação de sessões permanecem desativados. Mensagens do WhatsApp são editáveis e não são enviadas automaticamente. Não há depoimentos, notas, números de pacientes ou credenciais inventadas.

## Verificação

Ver `docs/validacao-v2.md`. Os testes cobrem WhatsApp/UTMs, dados não inventados, gate de divulgação e invariantes da coreografia. A malha foi aberta com o GLTFLoader real e renderizada offline. O navegador de QA não oferece WebGL; a cena WebGL e o FPS precisam de avaliação num dispositivo compatível.

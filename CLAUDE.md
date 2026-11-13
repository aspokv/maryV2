# CLAUDE.md — site da Dra. Mariana Strey (maryV2)

Landing page pública da Dra. Mariana Strey, biomédica esteta (CRBM-5 6569), em Caxias do Sul. O painel de gestão da clínica é outro projeto ([aspokv/mary-gestao](https://github.com/aspokv/mary-gestao)); não mexer nele daqui.

Resumo para o Nicolas, em linguagem simples: [RESUMO.md](RESUMO.md). **Atualize o RESUMO.md no fim de todo trabalho** (pedido dele, 2026-11-13).

**Este repositório é público.** Nada de segredo, token, `.env`, planilha, dado de paciente ou foto original aqui. Fotos de antes e depois entram só como os arquivos já preparados (ver "Antes e depois").

## Autorização (Nicolas, 2026-11-13)

A Mariana deu ao Nicolas autorização total para decidir e aprovar o site em nome dela. Todas as pacientes dela assinaram consentimento de divulgação de imagem. As aprovações (`portraitApproved`, `clinicalCopyApproved` etc. em `src/site.config.mjs`) estão registradas como dele, em nome dela.

Isso não autoriza inventar dados: preços, procedimentos de um caso e qualquer dado novo só como ela informar. Ela atende como pessoa física, **sem empresa nem CNPJ**: nunca escrever razão social.

Decisões do Nicolas (2026-11-13), que valem até ele mudar:

- **sem habilitação** no site e na legenda;
- **sem horário fixo**: atendimento com hora marcada pelo WhatsApp;
- **sem o tempo** entre o antes e o depois nos casos.

## Regras

- **Celular primeiro.** Hoje o site carrega muito bem no celular; nenhuma mudança pode piorar isso.
  - Conferir em 390×844 e 375×667, sem rolagem lateral.
  - Imagens em AVIF/WebP com `srcset`.
  - Nada de bibliotecas novas pesadas.
  - O 3D continua carregando só quando o aparelho aguenta (`Experience.jsx`).
- **Paleta e tipografia** são as do feed dela (README, "Paleta"). A tripla hélice do colágeno é a marca do site e fica.
- **Ela atende sozinha:** nunca escrever "equipe".
- **Antes e depois** (Código de Ética da Biomedicina, Res. CFBM 330/2020):
  - fotos reais, sem filtro e sem retoque;
  - **sem legenda** embaixo das fotos: o Nicolas mandou tirar (2026-11-13), ciente de que o CFBM pede o texto (paciente real, TCLE, sem garantia, CRBM). Não recolocar sem pedido dele.
  - Nada de transição que funda as duas fotos ou crie imagem intermediária: a fibra é uma cortina entre duas fotos inteiras.
  - Vários casos passam em sequência na mesma rolagem (`sequenceOf`): a fibra atravessa um, recolhe, a foto troca e atravessa o próximo. Os botões levam ao começo de cada caso.
- **Publicação no Google:** `canRelease()` libera a indexação (sitemap, `index,follow`, dados estruturados) com CRBM, forma de agendar (`hours`), domínio, contato de privacidade e as aprovações. Liberado desde 2026-11-13.
- **Procedimentos:** nome técnico primeiro, explicação simples depois. Sem marca de produto ou medicamento.

## Antes e depois

1. Guarde os originais fora do repositório (ou em `fotos-originais/`, que o git ignora).
2. `npm i --no-save sharp`
3. Prepare as fotos. O script faz o mesmo recorte 2:3 nas duas, tira todos os metadados e gera AVIF/WebP de até 1200 px (nunca aumenta):
   - fotos separadas: `node scripts/preparar-fotos.mjs <antes.jpg> <depois.jpg> <slug> [--topo=0.3]`;
   - montagem lado a lado (como ela manda pelo WhatsApp): `node scripts/preparar-fotos.mjs --montagem <imagem.jpg> <slug> [--topo=0.3]`.
   - `--topo` desce o recorte para o rosto ficar inteiro. Confira numa folha de contato antes de publicar.
4. Acrescente o caso em `results` no `src/site.config.mjs`: `slug`, `label` (nome do caso) e `alt` das duas fotos. `procedure` só se ela informar; tempo depois do tratamento não vai.
5. `npm run check` (confere os 4 arquivos de cada caso) e `npm run build`.

Para trocar as fotos de um caso por versões melhores, rode o script com o mesmo `slug`: ele sobrescreve os 4 arquivos. Sem nenhum caso, a seção some do site publicado.

## Comandos

Node 22+.

- `npm ci`
- `npm run check`: testes de WhatsApp, dados não inventados, gate de publicação, casos de antes e depois, fibra, sequência e hélice.
- `npm run build`: Vite + 10 rotas pré-renderizadas.
- `npx vite preview --port 4173`: serve o `dist/`.

## Deploy

- **Coolify** em https://panel.aiexec.com.br, projeto Mariana Strey.
  - App **mary-v2** (`eckdqikjnbm9sgr5cev4wl57`): Dockerfile (build com `npm run check`) servido por nginx na porta **80**.
  - Fonte: GitHub público, branch `main`.
  - Publicar: push na `main`. O webhook do GitHub chama o Coolify; se não publicar, use Deploy no Coolify ou `POST /api/v1/deploy` com `{"uuid":"eckdqikjnbm9sgr5cev4wl57"}`.
- **Domínio:** https://dramarianastrey.com.br. O `www` redireciona para ele.
  - DNS no Cloudflare: A `@` e A `www` para 187.127.48.117, **DNS only** (sem nuvem laranja), para o Let's Encrypt do Coolify funcionar.
  - O `painel.` é a gestão e não deve ser alterado.
- **Endereço de teste:** https://eckdqikjnbm9sgr5cev4wl57.187.127.48.117.sslip.io
- O site antigo (V1) é o app **MAARI** (`wqkfoiqo6tvpspxc4otpfadt`, repo privado Mariana-Site). Em 2026-11-13 ainda rodava só no endereço de teste dele. Parar no Coolify quando o Nicolas decidir (parar, não apagar).
- Publicação automática: webhook do GitHub (push) → `https://panel.aiexec.com.br/webhooks/source/github/events/manual`, com o segredo guardado só no GitHub e no Coolify (2026-11-13).

## Pendente

- **Casos 1 e 2** (fotos de 2026-11-13, montagens de WhatsApp, metades de 509 e 637 px). O Nicolas pediu à Mariana as fotos separadas, em qualidade melhor. Quando chegarem, refazer `caso-1` e `caso-2` no modo de fotos separadas, com o mesmo enquadramento (rosto inteiro, da testa ao queixo).

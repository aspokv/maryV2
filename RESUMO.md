# Resumo — site da Dra. Mariana Strey

*Atualizado em 13/11/2026. Se formatar ou trocar de computador, comece por aqui.*

## O que é

Site público da Dra. Mariana Strey, biomédica esteta (CRBM-5 6569), em Caxias do Sul. É a página que as pacientes veem: apresentação, antes e depois, procedimentos, primeira consulta e contato pelo WhatsApp.

O **painel de gestão** da clínica é outro projeto: [aspokv/mary-gestao](https://github.com/aspokv/mary-gestao), em https://painel.dramarianastrey.com.br.

## Onde está no ar

| O quê | Onde |
|---|---|
| Site | **https://dramarianastrey.com.br** (o `www` leva para o mesmo lugar). Aparece no Google |
| Endereço de teste | https://eckdqikjnbm9sgr5cev4wl57.187.127.48.117.sslip.io |
| Código | https://github.com/aspokv/maryV2, branch `main`. **Repositório público** |
| Servidor | Coolify em https://panel.aiexec.com.br → projeto Mariana Strey → app **mary-v2** |
| Domínio e DNS | Cloudflare: registros A `@` e `www` para 187.127.48.117, "DNS only" (nuvem cinza) |

**Para publicar, basta mandar a mudança para o GitHub (`main`): o site atualiza sozinho em uns 3 minutos.** Se um dia não atualizar, no Coolify abra o app mary-v2 e clique em Deploy.

## O que tem no site

1. **Abertura com a tripla hélice do colágeno em 3D.** As fibras se enrolam conforme a rolagem.
2. **Resultado real (antes e depois).**
   - Uma fibra cor de cobre atravessa cada foto enquanto a pessoa rola, e o antes vira o depois.
   - Os casos passam um depois do outro na mesma rolagem.
   - Botões levam a cada caso, e uma bolinha permite arrastar para comparar.
3. **A Mariana:** foto dela e o "quem te avalia é quem te atende".
4. **O que ela faz:**
   - os procedimentos: Perfiloplastia, Harmonização facial, Preenchimento labial, Bioestimuladores de colágeno, Toxina botulínica e Microagulhamento;
   - cada um com o nome técnico, uma explicação simples e uma página própria.
5. **Primeira consulta:** os 4 passos, da mensagem no WhatsApp ao plano.
6. **Perguntas, agendamento pelo WhatsApp, endereço e Instagram.**
7. **Página de privacidade** com a Mariana como responsável e o WhatsApp como contato.

## O que foi feito

- **18/10/2026:** criada a versão 2, com a hélice 3D, a paleta do Instagram dela e o texto de quem atende sozinha.
- **13/11/2026:**
  - Antes e depois com a fibra, primeiro com espaço reservado e depois com os **casos 1 (frente) e 2 (lateral)** que ela mandou.
  - Os dois casos passam em sequência, sem legenda embaixo.
  - Procedimentos com o nome técnico, incluindo a Perfiloplastia, e a seção da primeira consulta.
  - Saiu uma razão social inventada ("Ltda"): ela atende como pessoa física, sem CNPJ.
  - Rodapé e privacidade sem "a confirmar".
  - Site ligado ao domínio, com cadeado (HTTPS) e publicação automática pelo GitHub.
  - Liberado para o Google: mapa do site e página indexável.

## Decisões do Nicolas (não mudar sem ele)

- **A Mariana deu ao Nicolas autorização total** para decidir e aprovar o site em nome dela. **Todas as pacientes assinaram consentimento de divulgação** das fotos.
- **Sem habilitação, sem horário fixo e sem o tempo depois do tratamento.** O rodapé diz "com hora marcada pelo WhatsApp".
- **Sem legenda embaixo das fotos de antes e depois.** O Código de Ética da Biomedicina pede essa legenda; ele decidiu tirar mesmo assim.
- **Fotos sempre reais, sem filtro e sem retoque.**
- **Celular primeiro:** toda mudança é conferida no celular antes de publicar.
- Ela atende sozinha: nunca escrever "equipe".
- A paleta (marfim, nude, caramelo, champanhe, chocolate) e a hélice ficam.

## Como pôr ou trocar fotos de antes e depois

Peça ao Claude: "coloca estas fotos no antes e depois". Ele segue o passo a passo do `CLAUDE.md`:

- faz o mesmo recorte nas duas fotos;
- tira todos os dados do celular (localização, aparelho);
- gera arquivos leves;
- publica.

Aceita fotos separadas ou a montagem lado a lado do WhatsApp. **Os originais nunca vão para o GitHub**, só as versões limpas.

## O que falta

- **As fotos separadas dos casos 1 e 2**, em qualidade melhor: o Nicolas já pediu à Mariana. Quando chegarem, é só trocar.
- **O site antigo** (app "MAARI" no Coolify) ainda roda num endereço de teste, sem domínio. Pode ser parado no Coolify (Stop, sem apagar).
- **O repositório do site é público.** Pode virar privado se preferir; aí o Coolify precisa usar o acesso privado do GitHub.

## Como retomar o trabalho

- **Pelo celular ou DeX:** abra https://claude.ai/code, conecte o GitHub e escolha o repositório `aspokv/maryV2`. O Claude lê sozinho o `CLAUDE.md` (regras e deploy) e este resumo.
- **Num computador novo:** `git clone https://github.com/aspokv/maryV2`, depois `npm ci`, `npm run check` e `npm run build` (precisa do Node 22 ou mais novo).
- Nada deste site depende de um computador específico: o código está no GitHub e o site no Coolify.

# Validação da entrega — 18/10/2026

## Verificado

- `npm run check`: 4 testes aprovados. Codificação de WhatsApp, minimização/allowlist de atribuição, condição de lançamento e JSON-LD sem prova fictícia.
- `npm run build`: concluído; 9 documentos HTML por rota, metadados específicos e prerender do conteúdo principal.
- Checagem estática das 9 rotas: um H1 em cada documento com conteúdo pré-renderizado, referências internas/arquivos existentes e `noindex` preservado.
- HTML inicial não contém preload/import do bundle `Studio-*`; Three.js está na rota opcional.
- Estimativa conservadora de recursos da landing: 648.383 bytes sem compressão; 291.704 bytes estimados com gzip nos arquivos textuais, fontes WOFF2 e as duas variantes AVIF. Inclui GSAP carregado após montagem. Trata-se de soma de arquivos, não captura de rede nem medição CWV.
- Retrato em formatos AVIF/WebP, fontes locais e Open Graph 1200×630.
- Inspeção visual desktop e quadros de viewport 320, 390 e 768 px no navegador. Sem overflow horizontal nos três quadros; body útil de 305, 375 e 753 px devido à barra de rolagem do ambiente.
- Na composição 390: retrato e CTA na primeira tela; CTA observado aproximadamente de y=506 a y=560. Em 320, ajuste da descrição evitou sobreposição com o retrato.
- Menu mobile abriu/fechou; filtro “Qualidade da pele” reduziu a lista aos dois assuntos esperados; FAQ nativo expandiu.
- Diálogo de preferências abriu; opção “Continuar sem análise” fechou o diálogo. IDs de tracking vazios, Pixel/CAPI/Clarity desativados.
- Modelo carregado com o GLTFLoader real do Three.js em Node: 3 meshes nomeadas, 1.152 vértices e 2.304 triângulos cada, total 6.912 triângulos. Arquivo GLB: 126.728 bytes.
- Navegador reportou WebGL desativado. Error boundary exibiu a versão estática com acesso ao atendimento. Isso confirma fallback, não renderização 3D.
- Contraste dos cinco pares principais: 13,16:1; 7,07:1; 4,80:1; 12,01:1; 11,71:1. Indicador de foco em fundo claro: 4,46:1.
- `npm run check:release` falhou intencionalmente enquanto faltam registros e homologações: comportamento esperado para a prévia privada.
- Documento HTML estratégico foi aberto e inspecionado visualmente; índice com 12 etapas mais fontes, tabelas e wireframes incorporados.

## Limites e homologações pendentes

- Renderização WebGL, toque/rotação reais, câmera/hotspots e FPS devem ser testados em dispositivo com WebGL. Não se afirma 60 fps alcançados.
- Lighthouse e LCP/INP/CLS de campo não foram medidos. A soma do payload não prova velocidade de rede, cache ou processamento.
- Android/iOS no navegador interno do Instagram, WhatsApp instalado/não instalado e compartilhamento no WhatsApp precisam de teste real após domínio definido.
- Auditoria completa WCAG 2.2 AA, leitor de tela, zoom e dispositivos assistivos não foi realizada. Há semântica, foco e controles nativos implementados.
- Docker/Nginx fornecidos, mas a imagem Docker não foi executada neste ambiente. Build Vite validado.
- Nenhuma mensagem foi enviada à clínica. O número/endereço são os divulgados em cadastro público, sujeitos à confirmação de titularidade.
- Instagram direto e Google Business Profile não foram auditados integralmente. Não há contagem de seguidores, nota ou avaliações Google verificadas na entrega.
- Registros PF/PJ, habilitação, escopo jurídico de 2026, condições de avaliação/retorno, dados de privacidade e licença pública do retrato aguardam validação.
- A fonte de dados públicos não substitui comprovação de formação nem autorização de publicidade. Site privado e `noindex` para revisão.

## Como reproduzir

```bash
npm ci
npm run check
npm run build
npm run check:release
```

O último comando deve falhar enquanto os dados/flags de `src/site.config.mjs` não estiverem completos. Depois da homologação, configurar domínio e identificação, revisar o rodapé e gerar novo build antes de divulgar.

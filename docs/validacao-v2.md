# Verificação — V2 / 18 de outubro de 2026

## Escopo

Reconstrução da experiência visual, copy principal, composição móvel e arquitetura 3D. Conteúdo institucional detalhado e restrições de divulgação foram preservados. A experiência 3D faz parte da rota principal; `/estudio/` permanece como endereço compatível que exibe a mesma experiência.

## Verificações

- Testes automatizados: WhatsApp codificado, atribuição com lista permitida, gate de dados profissionais, schema sem provas inventadas, coreografia finita/limitada com recomposição final.
- GLB validado usando `three/examples/jsm/loaders/GLTFLoader.js`: 3 malhas, 13.380 vértices, 26.508 triângulos, valores finitos.
- Renders originais gerados pela mesma malha em OpenGL/EGL, incluindo ângulo alternativo e vista aberta.
- Inspeção visual via navegador em desktop e composição de iframe de 320, 390 e 768 px; barras do navegador descontam 15 px de área útil.
- Navegação por atos, menu móvel, âncoras, expansão de cuidados e destino de WhatsApp verificados na interface.
- Sem envio de mensagens ou agendamento real durante os testes.

## Limites

O navegador disponibilizado para QA não oferece WebGL. A composição, a animação de texto e o fallback foram inspecionados; a cena R3F, a rotação por toque em aparelho real e o FPS não foram certificados. Não foi realizado teste de carga, Lighthouse, medição real de Core Web Vitals em 4G, auditoria integral de acessibilidade ou execução de Docker.

## Antes da divulgação pública

Continuam pendentes os registros/habilitação, a autorização do retrato, os dados operacionais e a validação do escopo profissional vigente. A versão continua privada e sem indexação. O histórico regulatório pesquisado está na estratégia anterior; esta revisão de design não modifica essa conclusão.

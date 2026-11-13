export const site = {
  name: "Dra. Mariana Strey",
  // She works alone, as a natural person: no company name and no CNPJ (Nicolas, 2026-11-07). Never invent one.
  legalName: "Mariana Strey",
  profession: "Biomédica esteta",
  // Public Instagram bio (@dramarianastrey), read 2026-10-18.
  registration: "CRBM-5 6569",
  companyRegistration: "",
  // Not shown: Nicolas decided it is not needed (2026-11-13). If ever filled, it joins the footer and the before/after caption.
  qualification: "",
  whatsapp: "5554999507227",
  phoneDisplay: "(54) 99950-7227",
  instagram: "https://www.instagram.com/dramarianastrey/",
  instagramHandle: "@dramarianastrey",
  street: "Av. Itália, 482",
  suite: "Sala 703",
  neighborhood: "São Pelegrino",
  city: "Caxias do Sul",
  region: "RS",
  postcode: "95010-040",
  // She has no fixed opening hours (Nicolas, 2026-11-13): every visit is booked over WhatsApp.
  hours: "com hora marcada pelo WhatsApp",
  domain: "https://dramarianastrey.com.br",
  portrait: "/images/mariana-800.webp",
  // Approved by Nicolas on Mariana's behalf (she gave him full authorization), 2026-11-13.
  portraitApproved: true,
  businessDataApproved: true,
  clinicalCopyApproved: true,
  legalScopeApproved: true,
  privacyApproved: true,
  googleProfile: "",
  googleReviewLink: "",
  // Same channel as the clinic panel's approved privacy notice.
  privacyContact: "Mariana Strey, pelo WhatsApp (54) 99950-7227",
  reviews: [],
  // Before/after cases. Every patient has signed consent for publication (Nicolas, 2026-11-13).
  // Photos: real, no filter or retouch, same framing. Prepare them with scripts/preparar-fotos.mjs,
  // which strips all metadata and writes /images/resultados/<slug>-antes|depois.avif|webp (2:3).
  // Originals never enter this repository (it is public).
  // `label` names the case. No time since treatment (Nicolas, 2026-11-13); `procedure` only if Mariana tells it.
  results: [
    {
      // Sent by Mariana on 2026-11-13 (montage, front view).
      slug: "caso-1",
      label: "Caso 1 · frente",
      procedure: "",
      alt: {
        before: "Rosto de frente de uma paciente da Mariana, antes do tratamento.",
        after: "O mesmo rosto de frente, depois do tratamento.",
      },
    },
    {
      // Sent by Mariana on 2026-11-13 (montage, three-quarter view).
      slug: "caso-2",
      label: "Caso 2 · lateral",
      procedure: "",
      alt: {
        before: "Rosto de outra paciente da Mariana, visto de lado, antes do tratamento.",
        after: "O mesmo rosto visto de lado, depois do tratamento.",
      },
    },
  ],
  credentials: [],
  analytics: {
    ga4: "",
    clarity: "",
    metaPixel: "",
    metaEnabled: false,
    capiEnabled: false,
  },
};

export const procedures = [
  {
    // "Rejuvenescimento | Perfiloplastia" and "Técnicas autorais" are in her public Instagram bio.
    slug: "perfiloplastia",
    number: "01",
    label: "Perfiloplastia",
    short: "O perfil em equilíbrio.",
    intro:
      "Uma avaliação do rosto visto de lado: nariz, lábios, queixo e mandíbula, buscando equilíbrio entre as partes com técnicas injetáveis, quando indicadas.",
    audience:
      "Para quem quer harmonizar o perfil, como a projeção do queixo, o contorno da mandíbula ou a relação entre nariz e lábios.",
    focus: "Proporção entre nariz, lábios, queixo e mandíbula, respeitando a sua anatomia.",
    duration: "Depende das regiões e dos produtos indicados; é conversada na avaliação.",
    session: "Planejada na avaliação; pode ser feita em etapas.",
    recovery: "Pode haver inchaço, sensibilidade e hematomas nos primeiros dias.",
    boundary:
      "Preenchimentos têm riscos, inclusive complicações vasculares. A avaliação define o que é indicado, e também pode concluir que nada deve ser feito.",
    symbol: "contour",
  },
  {
    slug: "harmonizacao-facial",
    number: "02",
    label: "Harmonização facial",
    short: "O conjunto vem antes do detalhe.",
    intro:
      "Uma conversa sobre proporções, contorno e o que você deseja preservar no seu rosto.",
    audience: "Para quem quer discutir o equilíbrio do rosto como um todo.",
    focus: "Proporções e contorno, conforme a indicação individual.",
    duration: "Varia com as técnicas indicadas; não há um prazo único.",
    session: "Definida junto com o seu plano.",
    recovery: "Depende das intervenções. Pode haver inchaço e hematomas.",
    boundary:
      "O planejamento pode combinar etapas. A avaliação também pode concluir que um procedimento não é indicado.",
    symbol: "contour",
  },
  {
    slug: "preenchimento-labial",
    number: "03",
    label: "Preenchimento labial",
    short: "Contorno. Proporção. Expressão.",
    intro:
      "Converse sobre formato, definição e volume, considerando sua anatomia e seus limites.",
    audience:
      "Para quem deseja avaliar definição, assimetria ou volume dos lábios.",
    focus:
      "Formato e proporção dos lábios, respeitando a sua anatomia.",
    duration:
      "Individual; depende do produto, da região e da resposta do organismo.",
    session: "A Mariana informa o tempo antes da reserva.",
    recovery:
      "Pode haver sensibilidade, inchaço e hematomas; a rotina precisa ser discutida.",
    boundary:
      "Preenchimentos têm riscos, inclusive complicações vasculares. A indicação e o manejo de intercorrências devem ser esclarecidos na avaliação.",
    symbol: "lips",
  },
  {
    slug: "bioestimuladores-de-colageno",
    number: "04",
    label: "Bioestimuladores de colágeno",
    short: "Um olhar para a firmeza da pele.",
    intro:
      "Entenda se uma abordagem voltada à qualidade e à firmeza da pele faz sentido para o seu momento.",
    audience: "Para quem quer conversar sobre flacidez e qualidade da pele.",
    focus: "Estímulo de colágeno quando houver indicação profissional.",
    duration:
      "A evolução é gradual e varia conforme a substância e a resposta individual.",
    session: "Número de sessões e intervalos definidos na avaliação.",
    recovery: "Pode haver desconforto, inchaço, hematomas e outras reações.",
    boundary:
      "Não existe uma indicação igual para todas as pessoas. Produto, região, contraindicações e riscos precisam ser avaliados.",
    symbol: "layers",
  },
  {
    slug: "toxina-botulinica",
    number: "05",
    label: "Toxina botulínica",
    short: "Entender o movimento antes de tratar.",
    intro:
      "Informações sobre a avaliação de linhas de expressão e sobre quando a toxina botulínica pode ser considerada.",
    audience: "Para quem quer avaliar linhas associadas à movimentação facial.",
    focus:
      "Discussão profissional sobre movimento, expressividade e limites de indicação.",
    duration:
      "Temporária. O tempo varia de pessoa para pessoa e é conversado na avaliação.",
    session:
      "Definida pela Mariana conforme a avaliação e a conduta indicada.",
    recovery:
      "Exige orientações específicas. Pode haver reações e efeitos indesejados.",
    boundary:
      "Conteúdo informativo sobre o serviço, sem promoção de medicamento ou marca. A decisão depende de avaliação, contraindicações e escopo profissional vigente.",
    symbol: "movement",
  },
  {
    slug: "microagulhamento",
    number: "06",
    label: "Microagulhamento",
    short: "Cuidar da superfície. Com critério.",
    intro:
      "Uma avaliação para discutir textura e cuidados da pele, incluindo microagulhamento quando indicado.",
    audience: "Para quem busca orientação sobre textura e qualidade da pele.",
    focus:
      "Queixas e características da pele, com avaliação de contraindicações.",
    duration: "Depende da indicação, do protocolo e da resposta individual.",
    session: "Quantidade e intervalos informados depois da avaliação.",
    recovery:
      "Pode haver vermelhidão e sensibilidade. Fotoproteção e cuidados são orientados individualmente.",
    boundary:
      "Não deve ser decidido por uma foto ou teste online. Condições de pele e histórico precisam ser avaliados.",
    symbol: "texture",
  },
];

export const faqs = [
  [
    "Vou perder minhas características?",
    "Esse receio deve fazer parte da conversa. Leve o que você deseja mudar e o que quer preservar. A proposta, os limites e as alternativas precisam estar claros antes de qualquer decisão; nenhum resultado pode ser garantido.",
  ],
  [
    "Preciso saber qual procedimento quero?",
    "Não. Você pode começar pela sua dúvida. A avaliação existe para discutir a queixa, o histórico, as possibilidades e também a opção de não realizar um procedimento.",
  ],
  [
    "A avaliação tem custo?",
    "A Mariana informa o valor da avaliação, as condições de reserva e a política de cancelamento antes de você escolher um horário.",
  ],
  [
    "Os procedimentos doem?",
    "A sensibilidade e as medidas de conforto variam conforme a pessoa e o procedimento. Pergunte sobre o desconforto esperado, as opções disponíveis e as contraindicações durante a avaliação.",
  ],
  [
    "Posso voltar à minha rotina no mesmo dia?",
    "Depende da técnica, da região e da sua resposta. Pode haver inchaço, hematomas e restrições temporárias. Informe viagens, eventos e compromissos para discutir o melhor momento.",
  ],
  [
    "Quem verifica se o procedimento é indicado?",
    "A própria Mariana, biomédica esteta (CRBM-5 6569), avalia seu histórico, as condições da região e as contraindicações antes de indicar qualquer procedimento.",
  ],
  [
    "E se houver uma intercorrência?",
    "Antes de decidir, peça as orientações sobre riscos, sinais de alerta, contato após o atendimento e encaminhamento. Esses pontos precisam fazer parte do plano de cuidado.",
  ],
  [
    "Quanto tempo dura o resultado?",
    "Não existe um prazo igual para todas as pessoas. A duração depende da técnica, do produto, da região e da resposta individual. A estimativa adequada deve ser discutida na avaliação.",
  ],
  [
    "Há retorno depois do procedimento?",
    "Confirme quando ocorre o retorno, o que ele inclui e se há algum custo adicional. Essas condições devem ser informadas antes da contratação.",
  ],
  [
    "Onde é o atendimento?",
    "Av. Itália, 482, sala 703, São Pelegrino, Caxias do Sul. As orientações de acesso são enviadas no agendamento.",
  ],
];

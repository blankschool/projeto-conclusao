export const ENTREPRENEURS = [
  { id: 1, name: "Marcos Oliveira", company: "Óleos Naturais CO.", segment: "Cosméticos naturais", slots: 3, taken: 1, avatar: "MO", bio: "Fundador da Óleos Naturais, referência em cosméticos veganos no Brasil. Mais de 12 anos de experiência no mercado de beleza sustentável." },
  { id: 2, name: "Camila Duarte", company: "Estúdio Fluxo", segment: "Design de interiores", slots: 3, taken: 2, avatar: "CD", bio: "Designer premiada com projetos em São Paulo e Lisboa. O Estúdio Fluxo é reconhecido por transformar espaços comerciais com identidade única." },
  { id: 3, name: "Rafael Mendes", company: "TechPulse", segment: "SaaS B2B", slots: 2, taken: 2, avatar: "RM", bio: "CEO da TechPulse, plataforma de automação para pequenas empresas. Ex-engenheiro do Google com foco em produto e growth." },
  { id: 4, name: "Juliana Reis", company: "Bendita Padaria", segment: "Alimentação artesanal", slots: 4, taken: 1, avatar: "JR", bio: "Empreendedora gastronômica à frente da Bendita Padaria, com 3 unidades em Belo Horizonte. Foco em fermentação natural e ingredientes locais." },
  { id: 5, name: "Thiago Bastos", company: "Move Fitness", segment: "Saúde e bem-estar", slots: 3, taken: 0, avatar: "TB", bio: "Personal trainer e empresário com mais de 50 mil seguidores. A Move Fitness une treino funcional, nutrição e comunidade digital." },
  { id: 6, name: "Fernanda Lima", company: "Ateliê Trama", segment: "Moda autoral", slots: 2, taken: 1, avatar: "FL", bio: "Estilista e fundadora do Ateliê Trama, marca de moda autoral com produção ética. Participou de 4 edições do São Paulo Fashion Week." },
];

export const CALENDAR_EVENTS = [
  { date: "17 Fev", day: "Seg", title: "Abertura da plataforma", desc: "Autenticação e seleção de empresários", active: true },
  { date: "18 Fev", day: "Ter", title: "Encerramento da seleção", desc: "Redistribuição automática dos não selecionados", active: false },
  { date: "19–23 Fev", day: "Qua–Dom", title: "Período de produção", desc: "5 dias para criação e entrega do conteúdo", active: false },
  { date: "24 Fev", day: "Seg", title: "Prazo final de entrega", desc: "Último dia para submeter o conteúdo", active: false },
  { date: "25–26 Fev", day: "Ter–Qua", title: "Avaliação e feedback", desc: "Análise individual de cada entrega", active: false },
  { date: "28 Fev", day: "Sex", title: "Divulgação dos selecionados", desc: "Publicação dos melhores conteúdos nos perfis reais", active: false },
];

export const FLOW_STEPS = [
  { n: "01", title: "Autenticação", desc: "Acesse o app e insira seu e-mail para validação." },
  { n: "02", title: "Seleção", desc: "Escolha o empresário para produzir o conteúdo." },
  { n: "03", title: "Produção", desc: "Crie o conteúdo dentro do prazo estipulado." },
  { n: "04", title: "Feedback", desc: "Receba a avaliação detalhada da equipe Blank." },
  { n: "05", title: "Publicação", desc: "Os melhores são publicados no perfil real do cliente." },
];

export const RULES = [
  "Cada aluno pode selecionar apenas um empresário",
  "As vagas por cliente são limitadas e preenchidas por ordem",
  "Quem não escolher a tempo será atribuído a um cliente aleatório",
  "O conteúdo deve ser entregue dentro do prazo, sem exceções",
  "O design final das peças selecionadas será feito pela equipe Blank",
];

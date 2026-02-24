
-- entrepreneurs
CREATE TABLE public.entrepreneurs (
  id serial PRIMARY KEY,
  name text NOT NULL,
  company text NOT NULL,
  segment text NOT NULL,
  slots integer NOT NULL DEFAULT 3,
  taken integer NOT NULL DEFAULT 0,
  avatar text NOT NULL,
  bio text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.entrepreneurs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read entrepreneurs" ON public.entrepreneurs FOR SELECT USING (true);

-- calendar_events
CREATE TABLE public.calendar_events (
  id serial PRIMARY KEY,
  date text NOT NULL,
  day text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read calendar_events" ON public.calendar_events FOR SELECT USING (true);

-- flow_steps
CREATE TABLE public.flow_steps (
  id serial PRIMARY KEY,
  step_number text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.flow_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read flow_steps" ON public.flow_steps FOR SELECT USING (true);

-- rules
CREATE TABLE public.rules (
  id serial PRIMARY KEY,
  text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rules" ON public.rules FOR SELECT USING (true);

-- selections
CREATE TABLE public.selections (
  id serial PRIMARY KEY,
  user_email text NOT NULL,
  entrepreneur_id integer NOT NULL REFERENCES public.entrepreneurs(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read selections" ON public.selections FOR SELECT USING (true);
CREATE POLICY "Public insert selections" ON public.selections FOR INSERT WITH CHECK (true);

-- Unique constraint: one selection per email
CREATE UNIQUE INDEX idx_selections_email ON public.selections (user_email);

-- Insert entrepreneurs
INSERT INTO public.entrepreneurs (id, name, company, segment, slots, taken, avatar, bio) VALUES
(1, 'Marcos Oliveira', 'Óleos Naturais CO.', 'Cosméticos naturais', 3, 1, 'MO', 'Fundador da Óleos Naturais, referência em cosméticos veganos no Brasil. Mais de 12 anos de experiência no mercado de beleza sustentável.'),
(2, 'Camila Duarte', 'Estúdio Fluxo', 'Design de interiores', 3, 2, 'CD', 'Designer premiada com projetos em São Paulo e Lisboa. O Estúdio Fluxo é reconhecido por transformar espaços comerciais com identidade única.'),
(3, 'Rafael Mendes', 'TechPulse', 'SaaS B2B', 2, 2, 'RM', 'CEO da TechPulse, plataforma de automação para pequenas empresas. Ex-engenheiro do Google com foco em produto e growth.'),
(4, 'Juliana Reis', 'Bendita Padaria', 'Alimentação artesanal', 4, 1, 'JR', 'Empreendedora gastronômica à frente da Bendita Padaria, com 3 unidades em Belo Horizonte. Foco em fermentação natural e ingredientes locais.'),
(5, 'Thiago Bastos', 'Move Fitness', 'Saúde e bem-estar', 3, 0, 'TB', 'Personal trainer e empresário com mais de 50 mil seguidores. A Move Fitness une treino funcional, nutrição e comunidade digital.'),
(6, 'Fernanda Lima', 'Ateliê Trama', 'Moda autoral', 2, 1, 'FL', 'Estilista e fundadora do Ateliê Trama, marca de moda autoral com produção ética. Participou de 4 edições do São Paulo Fashion Week.');

-- Reset sequence
SELECT setval('entrepreneurs_id_seq', 6);

-- Insert calendar_events
INSERT INTO public.calendar_events (date, day, title, description, is_active, sort_order) VALUES
('17 Fev', 'Seg', 'Abertura da plataforma', 'Autenticação e seleção de empresários', true, 0),
('18 Fev', 'Ter', 'Encerramento da seleção', 'Redistribuição automática dos não selecionados', false, 1),
('19–23 Fev', 'Qua–Dom', 'Período de produção', '5 dias para criação e entrega do conteúdo', false, 2),
('24 Fev', 'Seg', 'Prazo final de entrega', 'Último dia para submeter o conteúdo', false, 3),
('25–26 Fev', 'Ter–Qua', 'Avaliação e feedback', 'Análise individual de cada entrega', false, 4),
('28 Fev', 'Sex', 'Divulgação dos selecionados', 'Publicação dos melhores conteúdos nos perfis reais', false, 5);

-- Insert flow_steps
INSERT INTO public.flow_steps (step_number, title, description, sort_order) VALUES
('01', 'Autenticação', 'Acesse o app e insira seu e-mail para validação.', 0),
('02', 'Seleção', 'Escolha o empresário para produzir o conteúdo.', 1),
('03', 'Produção', 'Crie o conteúdo dentro do prazo estipulado.', 2),
('04', 'Feedback', 'Receba a avaliação detalhada da equipe Blank.', 3),
('05', 'Publicação', 'Os melhores são publicados no perfil real do cliente.', 4);

-- Insert rules
INSERT INTO public.rules (text, sort_order) VALUES
('Cada aluno pode selecionar apenas um empresário', 0),
('As vagas por cliente são limitadas e preenchidas por ordem', 1),
('Quem não escolher a tempo será atribuído a um cliente aleatório', 2),
('O conteúdo deve ser entregue dentro do prazo, sem exceções', 3),
('O design final das peças selecionadas será feito pela equipe Blank', 4);

-- Allow anon to update taken count on entrepreneurs
CREATE POLICY "Public update entrepreneurs taken" ON public.entrepreneurs FOR UPDATE USING (true) WITH CHECK (true);

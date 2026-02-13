

# Integrar dados do app com Supabase self-hosted

## Resumo
Mover todos os dados estáticos (empresários, calendário, etapas do fluxo e regras) para tabelas no Supabase self-hosted, mantendo a validação de e-mail apenas no front-end. Também criar uma tabela de inscrições para registrar quando um aluno seleciona um empresário.

## Tabelas no Supabase

### 1. `entrepreneurs`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial (PK) | ID do empresário |
| name | text | Nome completo |
| company | text | Nome da empresa |
| segment | text | Segmento de atuação |
| slots | integer | Total de vagas |
| avatar | text | Iniciais (ex: "MO") |
| bio | text | Biografia |

### 2. `calendar_events`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial (PK) | ID |
| date | text | Data formatada (ex: "17 Fev") |
| day | text | Dia da semana (ex: "Seg") |
| title | text | Título do evento |
| description | text | Descrição |
| is_active | boolean | Se o evento está ativo |
| sort_order | integer | Ordem de exibição |

### 3. `flow_steps`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial (PK) | ID |
| step_number | text | Número (ex: "01") |
| title | text | Título da etapa |
| description | text | Descrição |
| sort_order | integer | Ordem |

### 4. `rules`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial (PK) | ID |
| text | text | Texto da regra |
| sort_order | integer | Ordem |

### 5. `selections` (inscrições dos alunos)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid (PK) | ID da inscrição |
| email | text | E-mail do aluno |
| entrepreneur_id | integer (FK) | Empresário selecionado |
| created_at | timestamptz | Data da inscrição |

## O que NÃO vai para o Supabase
- A lógica de validação de e-mail (continua no front-end, aceitando emails com "blank" ou "teste")

## Mudanças no código

### Novos arquivos
1. **`src/lib/supabase.ts`** -- Cliente Supabase configurado com a URL e anon key fornecidos (chave pública, segura para o front-end)
2. **`src/hooks/useEntrepreneurs.ts`** -- Hook com React Query para buscar empresários e contagem de vagas ocupadas
3. **`src/hooks/useCalendarEvents.ts`** -- Hook para buscar eventos do calendário
4. **`src/hooks/useFlowSteps.ts`** -- Hook para buscar etapas do fluxo
5. **`src/hooks/useRules.ts`** -- Hook para buscar regras

### Arquivos modificados
1. **`src/pages/ExplanationPage.tsx`** -- Usar os hooks em vez dos dados estáticos
2. **`src/pages/SelectionPage.tsx`** -- Usar hook de empresários; ao confirmar inscrição, inserir registro na tabela `selections` e recalcular vagas
3. **`src/data/entrepreneurs.ts`** -- Removido ou esvaziado (dados agora vêm do Supabase)

## Segurança (RLS)
- Tabelas de dados (entrepreneurs, calendar_events, flow_steps, rules): RLS habilitado com policy de SELECT público (dados são de leitura)
- Tabela selections: RLS habilitado com policy de INSERT público (qualquer aluno pode se inscrever) e SELECT público (para contar vagas ocupadas)
- Um aluno não pode se inscrever duas vezes (constraint UNIQUE no email da tabela selections)

## Detalhes técnicos
- A anon key fornecida é uma chave pública (publishable), portanto é seguro armazená-la no código front-end
- O campo `taken` dos empresários será calculado dinamicamente contando os registros em `selections` para cada entrepreneur_id
- Os dados iniciais serão inseridos via migration SQL


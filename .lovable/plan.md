

# Conectar dados ao Supabase

## Visao geral

Criar 4 tabelas no Supabase espelhando os dados estaticos atuais (`entrepreneurs`, `calendar_events`, `flow_steps`, `rules`) e uma tabela `selections` para registrar as escolhas dos alunos. Depois, atualizar as paginas para buscar os dados do Supabase em vez dos arrays locais.

## Tabelas a criar

```text
entrepreneurs
─────────────────────────────────────────
id            serial  PK
name          text    NOT NULL
company       text    NOT NULL
segment       text    NOT NULL
slots         integer NOT NULL DEFAULT 3
taken         integer NOT NULL DEFAULT 0
avatar        text    NOT NULL
bio           text    NOT NULL
created_at    timestamptz DEFAULT now()

calendar_events
─────────────────────────────────────────
id            serial  PK
date          text    NOT NULL
day           text    NOT NULL
title         text    NOT NULL
description   text    NOT NULL
is_active     boolean NOT NULL DEFAULT false
sort_order    integer NOT NULL DEFAULT 0

flow_steps
─────────────────────────────────────────
id            serial  PK
step_number   text    NOT NULL
title         text    NOT NULL
description   text    NOT NULL
sort_order    integer NOT NULL DEFAULT 0

rules
─────────────────────────────────────────
id            serial  PK
text          text    NOT NULL
sort_order    integer NOT NULL DEFAULT 0

selections
─────────────────────────────────────────
id            serial  PK
user_email    text    NOT NULL
entrepreneur_id integer NOT NULL REFERENCES entrepreneurs(id)
created_at    timestamptz DEFAULT now()
```

## Politicas de acesso (RLS)

- **entrepreneurs, calendar_events, flow_steps, rules**: RLS habilitado com politica de leitura publica (`SELECT` para `anon`). Somente voce edita via dashboard.
- **selections**: RLS habilitado com politica de `INSERT` e `SELECT` publica (os alunos nao fazem login via Supabase Auth, apenas validam email contra planilha Google).

## Dados iniciais

Apos criar as tabelas, inserir os dados atuais de `src/data/entrepreneurs.ts` nas respectivas tabelas usando INSERT.

## Mudancas no codigo

### 1. Criar hooks de dados

Criar hooks com `@tanstack/react-query` para buscar dados de cada tabela:
- `src/hooks/useEntrepreneurs.ts` — busca `entrepreneurs` ordenado por `id`
- `src/hooks/useCalendarEvents.ts` — busca `calendar_events` ordenado por `sort_order`
- `src/hooks/useFlowSteps.ts` — busca `flow_steps` ordenado por `sort_order`
- `src/hooks/useRules.ts` — busca `rules` ordenado por `sort_order`
- `src/hooks/useCreateSelection.ts` — mutacao para inserir em `selections` e incrementar `taken`

### 2. `src/pages/ExplanationPage.tsx`
- Substituir imports estaticos pelos hooks
- Adicionar loading states simples
- Mapear campos: `step_number`, `description`, `is_active`

### 3. `src/pages/SelectionPage.tsx`
- Buscar empresarios via `useEntrepreneurs`
- Na confirmacao, chamar `useCreateSelection` que insere em `selections` e atualiza `taken` no banco
- Antes de exibir, checar se o email ja tem selecao existente

### 4. `src/pages/AuthPage.tsx`
- Apos validar email na planilha, consultar `selections` no Supabase para verificar se ja escolheu empresario
- Se sim, redirecionar direto para o perfil

### 5. `src/pages/EntrepreneurProfilePage.tsx`
- Buscar empresario e eventos do calendario via hooks

### 6. Manter fallback
- O arquivo `src/data/entrepreneurs.ts` permanece como referencia, mas nao sera mais importado nas paginas

## Detalhes tecnicos

A confirmacao de selecao fara duas operacoes:
1. `INSERT INTO selections (user_email, entrepreneur_id)`
2. Atualizar `taken` no empresario via RPC ou update direto

Como nao ha autenticacao Supabase (apenas validacao por planilha Google), as politicas RLS serao abertas para `anon` nas operacoes necessarias.


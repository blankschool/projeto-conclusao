

# Remover Supabase e usar dados estaticos locais

## Visao geral

Todas as paginas atualmente buscam dados do Supabase (entrepreneurs, calendar_events, flow_steps, rules, selections). As requisicoes estao falhando ("Failed to fetch"). A proposta e reverter para os dados estaticos que ja existem em `src/data/entrepreneurs.ts` e remover toda dependencia do Supabase.

## Arquivos com dados estaticos disponiveis

O arquivo `src/data/entrepreneurs.ts` ja contem:
- `ENTREPRENEURS` (6 empresarios com id, name, company, segment, slots, taken, avatar, bio)
- `CALENDAR_EVENTS` (6 eventos com date, day, title, desc, active)
- `FLOW_STEPS` (5 etapas com n, title, desc)
- `RULES` (5 regras como strings)

## Mudancas

### 1. `src/pages/ExplanationPage.tsx`
- Remover imports dos hooks Supabase (useFlowSteps, useCalendarEvents, useRules)
- Importar FLOW_STEPS, CALENDAR_EVENTS, RULES de `@/data/entrepreneurs`
- Remover estados de loading e usar os arrays diretamente
- Ajustar propriedades: `s.step_number` → `s.n`, `s.description` → `s.desc`, `ev.is_active` → `ev.active`, `ev.description` → `ev.desc`, `rule.text` → `rule` (string direta)
- Usar index como key em vez de `.id`

### 2. `src/pages/SelectionPage.tsx`
- Remover imports de useEntrepreneurs e useCreateSelection
- Importar ENTREPRENEURS de `@/data/entrepreneurs`
- Usar estado local para controlar selecoes (useState com um contador de taken por empresario)
- A funcao de confirmacao atualiza o estado local em vez de gravar no Supabase
- Remover loading state

### 3. `src/pages/EntrepreneurProfilePage.tsx`
- Remover imports de useEntrepreneurs e useCalendarEvents
- Importar ENTREPRENEURS e CALENDAR_EVENTS de `@/data/entrepreneurs`
- Buscar empresario diretamente do array estatico
- Usar `CALENDAR_EVENTS[1].date` para a data do blur (ja e "18 Fev")
- Campos como `full_bio`, `instagram_url`, `content_guidelines`, `content_examples` nao existem nos dados estaticos, entao os blocos condicionais simplesmente nao renderizam (comportamento correto)

### 4. `src/pages/AuthPage.tsx`
- Remover import do supabase
- Remover a query ao Supabase que verifica selecao existente (`selections` table)
- Ao autenticar com sucesso, sempre redirecionar para a etapa de selecao (sem checar selecao previa)

### 5. Arquivos que podem ser removidos (limpeza)
- `src/hooks/useEntrepreneurs.ts`
- `src/hooks/useCalendarEvents.ts`
- `src/hooks/useFlowSteps.ts`
- `src/hooks/useRules.ts`
- `src/lib/supabase.ts`

## Detalhes tecnicos

Os dados estaticos tem estrutura ligeiramente diferente dos dados do Supabase. As principais diferencas de mapeamento:

```text
Supabase field       →  Static field
───────────────────────────────────
step_number          →  n
description          →  desc
is_active            →  active
rule.text            →  rule (string)
ev.description       →  ev.desc
```

A selecao de empresario passa a ser gerenciada apenas no estado local do React (sem persistencia). Se o usuario recarregar a pagina, perde a selecao -- o que e aceitavel sem backend.


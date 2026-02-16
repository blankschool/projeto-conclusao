

# Sincronizar data do blur com o calendario de eventos

## Visao geral

Remover a constante fixa `SELECTION_CLOSE_DATE = "24/02"` e buscar a data diretamente da tabela `calendar_events` no Supabase. A data correta e a do segundo evento do calendario ("Encerramento da selecao", sort_order 2, data "18 Fev").

## Mudancas

### Arquivo: `src/pages/EntrepreneurProfilePage.tsx`

- Remover a constante `SELECTION_CLOSE_DATE` do topo do arquivo
- Importar o hook `useCalendarEvents` de `@/hooks/useCalendarEvents`
- Dentro do componente, chamar `useCalendarEvents()` para obter os eventos
- Pegar o segundo evento (sort_order 2, ou index 1 da lista ordenada) e usar o campo `date` dele como a data exibida no overlay do blur
- Se os eventos ainda estiverem carregando ou nao existirem, usar um fallback vazio ou "em breve"

Resultado: a data no overlay do blur ("Informacoes disponiveis a partir de 18 Fev") fica automaticamente sincronizada com o calendario de eventos do Supabase. Se a data mudar no banco, muda no perfil tambem.


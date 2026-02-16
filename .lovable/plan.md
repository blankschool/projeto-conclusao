

# Redirecionar usuario ja inscrito direto para o perfil

## Visao geral

Quando o usuario digitar o e-mail na etapa de autenticacao, antes de ir para a pagina de selecao, o sistema consulta a tabela `selections` no Supabase para verificar se ja existe uma inscricao para aquele e-mail. Se existir, pula a etapa de selecao e vai direto para a pagina de perfil do empresario correspondente.

## Mudancas

### 1. Arquivo: `src/pages/Index.tsx`

Alterar o callback `onAuth` para aceitar um segundo parametro opcional com o ID do empresario ja selecionado:

- Se receber o ID, vai direto para `"profile"` com o `confirmedEntId` preenchido
- Se nao receber, vai para `"selection"` como antes

### 2. Arquivo: `src/pages/AuthPage.tsx`

Alterar a interface `onAuth` para `(email: string, existingEntrepreneurId?: number) => void`.

Apos validar o e-mail na planilha (aluno encontrado), antes de redirecionar:
- Consultar `supabase.from("selections").select("entrepreneur_id").eq("email", email).maybeSingle()`
- Se retornar um registro, chamar `onAuth(email, entrepreneur_id)` -- pula a selecao
- Se nao retornar, chamar `onAuth(email)` -- fluxo normal para selecao

A mensagem de "Redirecionando..." continua aparecendo normalmente nos dois casos.

## Detalhes tecnicos

- A consulta ao Supabase e feita logo apos a validacao do e-mail na planilha, antes do `setTimeout` que redireciona
- Usa `maybeSingle()` para retornar `null` se nao houver selecao (sem erro)
- Nenhuma mudanca na tabela `selections` e necessaria -- so leitura
- O indicador de progresso no nav vai mostrar a etapa correta automaticamente (pula de "auth" para "profile")


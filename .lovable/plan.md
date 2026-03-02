

# Limitar a um único envio de conteúdo

## Problema
Atualmente, após enviar o conteúdo, o aluno vê o botão "Enviar outro conteúdo" e pode submeter novamente. O comportamento desejado é permitir apenas um envio por empresário.

## Solução

1. **Verificar submissão existente**: Ao carregar o perfil do empresário, consultar a tabela `submissions` para verificar se já existe um registro com o `user_email` + `entrepreneur_id` do aluno.

2. **Bloquear novo envio**: Se já existe submissão, exibir apenas a mensagem de sucesso sem o botão "Enviar outro conteúdo".

3. **Manter ambos os campos** (link e arquivo) no formulário para quem ainda não enviou.

## Alterações

- **`EntrepreneurProfilePage.tsx`**: Adicionar query para verificar submissão existente. Se existir, iniciar com `submitted = true` e remover o botão "Enviar outro conteúdo" da tela de sucesso.
- **`useCreateSubmission.ts`** ou novo hook: Adicionar hook `useExistingSubmission(entrepreneurId, userEmail)` que faz `SELECT` na tabela `submissions`.




# Popup de Confidencialidade obrigatório ao acessar perfil do empresário

## Resumo
Criar um popup (AlertDialog) de termo de confidencialidade que aparece na primeira vez que o usuário acessa qualquer perfil de empresário. O aceite é registrado no banco de dados. Nas visitas seguintes, o popup não aparece.

## Alterações no banco de dados

1. **Nova tabela `confidentiality_agreements`**:
   - `id` (serial, PK)
   - `user_email` (text, NOT NULL)
   - `accepted_at` (timestamptz, default now())
   - Constraint UNIQUE em `user_email` (aceite é global, uma vez por usuário)
   - RLS: SELECT e INSERT públicos (mesmo padrão das outras tabelas)

## Alterações no código

2. **Novo hook `useConfidentialityAgreement.ts`**:
   - Query: verifica se existe registro em `confidentiality_agreements` para o `userEmail`
   - Mutation: insere registro quando o usuário aceita

3. **Componente de popup em `EntrepreneurProfilePage.tsx`**:
   - Usar `AlertDialog` (sem botão de fechar, forçando interação)
   - Abrir automaticamente quando `userEmail` não tem registro na tabela
   - Checkbox "Declaro que li e concordo" obrigatório para habilitar o botão "Concordo e acessar"
   - Botão "Cancelar" volta à página anterior (`onBack`)
   - Ao aceitar: insere na tabela e fecha o popup, liberando o conteúdo
   - Enquanto o popup está aberto, o conteúdo do perfil fica escondido/bloqueado atrás do overlay

## Conteúdo do popup
Título, texto completo das regras de confidencialidade e penalidades conforme especificado pelo usuário.

## Fluxo
```text
Usuário acessa perfil
  ├─ Já aceitou? → mostra perfil normalmente
  └─ Não aceitou? → AlertDialog bloqueante
       ├─ "Concordo e acessar" (+ checkbox) → INSERT → fecha popup → mostra perfil
       └─ "Cancelar" → volta à página anterior
```


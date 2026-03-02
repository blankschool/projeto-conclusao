

# Formulário de submissão de conteúdo no perfil do empresário

## Visão geral

Adicionar um formulário ao final da página de perfil do empresário para que o aluno submeta seu conteúdo. O formulário terá:
- Campo de **link** (opcional se arquivo for enviado)
- Campo de **arquivo** (opcional se link for preenchido)
- Campo de **observações** (opcional)
- Validação: pelo menos link OU arquivo deve ser preenchido

## Mudanças no banco de dados

### 1. Nova tabela `submissions`
- `id` (serial, PK)
- `entrepreneur_id` (integer, FK para entrepreneurs)
- `user_email` (text, not null)
- `link` (text, nullable)
- `file_url` (text, nullable)
- `file_name` (text, nullable)
- `observations` (text, nullable)
- `created_at` (timestamptz, default now())
- RLS: insert e select público (mesmo padrão das outras tabelas)

### 2. Storage bucket `submissions`
- Bucket público para armazenar os arquivos enviados
- RLS para permitir upload anônimo

## Mudanças no código

### `src/pages/EntrepreneurProfilePage.tsx`
- Adicionar formulário antes do rodapé com:
  - Input de link (URL)
  - Input de arquivo (file upload)
  - Textarea de observações
  - Botão de envio
  - Validação client-side: link ou arquivo obrigatório
  - Feedback de sucesso/erro via toast

### `src/hooks/useCreateSubmission.ts` (novo)
- Hook com mutation para:
  1. Upload do arquivo ao bucket (se houver)
  2. Insert na tabela `submissions`

## Detalhes técnicos

- O formulário usa o `user_email` que já está disponível no fluxo (precisa ser passado como prop)
- Arquivo será salvo no bucket `submissions` com path `{entrepreneur_id}/{timestamp}_{filename}`
- Tipos serão atualizados automaticamente após a migration


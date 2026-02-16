

# Pagina do Empresario apos inscricao

## Visao geral

Apos confirmar a inscricao, em vez de mostrar apenas a tela de sucesso, o aluno sera redirecionado para uma pagina completa do empresario com informacoes detalhadas para ajuda-lo na producao de conteudo. Essa pagina tera: biografia expandida, links uteis (redes sociais, site) e exemplos/referencias de conteudo.

## Estrutura de dados

Como as informacoes atuais no Supabase sao limitadas (apenas bio curta), sera necessario adicionar novos campos a tabela `entrepreneurs` ou criar uma abordagem com dados locais. A solucao mais pratica e adicionar os campos extras diretamente na tabela existente:

- `full_bio` (text) -- biografia completa e detalhada
- `instagram_url` (text, nullable)
- `linkedin_url` (text, nullable)
- `website_url` (text, nullable)
- `content_guidelines` (text, nullable) -- briefing / diretrizes de tom de voz
- `content_examples` (text[], nullable) -- lista de URLs de exemplos de conteudo

Por enquanto, como voce pode nao ter esses dados prontos ainda, vou criar a pagina com os campos que ja existem (bio, foto, empresa, segmento) e deixar espaco visual para os campos extras. Quando voce popular os dados no Supabase, eles aparecem automaticamente.

## Mudancas

### 1. Novo arquivo: `src/pages/EntrepreneurProfilePage.tsx`

Pagina dedicada ao perfil do empresario contendo:
- Foto grande + nome + empresa + segmento
- Secao "Sobre" com a biografia completa (ou bio curta como fallback)
- Secao "Links uteis" com icones para Instagram, LinkedIn e site (quando disponiveis)
- Secao "Diretrizes de conteudo" com orientacoes de tom de voz (quando disponivel)
- Secao "Referencias" com exemplos de conteudo (quando disponivel)
- Botao "Voltar ao inicio"

### 2. Arquivo: `src/hooks/useEntrepreneurs.ts`

- Atualizar a interface `Entrepreneur` para incluir os novos campos opcionais:
  - `full_bio?: string`
  - `instagram_url?: string`
  - `linkedin_url?: string`
  - `website_url?: string`
  - `content_guidelines?: string`
  - `content_examples?: string[]`

### 3. Arquivo: `src/pages/SelectionPage.tsx`

- Alterar o fluxo pos-confirmacao: em vez de mostrar a tela de sucesso inline, chamar um callback `onConfirmed` passando o empresario selecionado
- Manter a tela de sucesso como transicao breve ou remover em favor do redirecionamento direto

### 4. Arquivo: `src/pages/Index.tsx`

- Adicionar novo estado de pagina: `"profile"`
- Armazenar o ID do empresario confirmado
- Renderizar `EntrepreneurProfilePage` quando `page === "profile"`
- Atualizar o indicador de progresso no nav (4 pontos em vez de 3)

### 5. Migracao SQL (Supabase)

Adicionar os novos campos a tabela `entrepreneurs`:

```sql
ALTER TABLE entrepreneurs
  ADD COLUMN IF NOT EXISTS full_bio text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS content_guidelines text,
  ADD COLUMN IF NOT EXISTS content_examples text[];
```

## Detalhes tecnicos

- A pagina de perfil reutiliza o hook `useEntrepreneurs` existente, filtrando pelo ID do empresario selecionado
- O mapa de fotos `entrepreneurPhotos` sera extraido para um utilitario compartilhado para uso tanto no SelectionPage quanto no EntrepreneurProfilePage
- Campos sem dados aparecerao com placeholder sutil ("Informacoes em breve") para que a pagina funcione mesmo antes de popular todos os campos no banco
- Design segue o mesmo padrao visual do projeto: tipografia com serif nos titulos, sans nos labels, cores via tokens do tema


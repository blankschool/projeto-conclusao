

# Adicionar Instagram e seguidores nos cards e dialog da Etapa 2

## Visao geral

Adicionar o link do Instagram e o numero de seguidores de cada empresario nos cards da pagina de selecao e no dialog de detalhes. Isso da mais contexto ao aluno sobre o alcance do empresario antes de escolher.

## Mudancas

### 1. Migracao SQL (Supabase)

Adicionar campo `instagram_followers` na tabela `entrepreneurs`:

```sql
ALTER TABLE entrepreneurs
  ADD COLUMN IF NOT EXISTS instagram_followers integer;
```

O campo `instagram_url` ja existe na tabela.

### 2. Arquivo: `src/hooks/useEntrepreneurs.ts`

Adicionar o campo opcional na interface `Entrepreneur`:

- `instagram_followers?: number`

### 3. Arquivo: `src/pages/SelectionPage.tsx`

**Nos cards (grid):** Abaixo do segmento e acima da barra de vagas, adicionar uma linha com o icone do Instagram + @ handle + numero de seguidores formatado (ex: "12.5k seguidores"). So aparece se `instagram_url` estiver preenchido.

**No dialog de detalhes (step "info"):** Abaixo da bio, adicionar uma secao com:
- Link clicavel para o Instagram (abre em nova aba)
- Numero de seguidores formatado
- Icone do Instagram (do lucide-react)

### 4. Formatacao de seguidores

Funcao utilitaria para formatar numeros:
- Menos de 1000: mostra o numero direto (ex: "850")
- 1k a 999k: mostra com "k" (ex: "12.5k")
- 1M+: mostra com "M" (ex: "1.2M")

## Detalhes tecnicos

- O icone `Instagram` do lucide-react sera usado para o link
- O handle do Instagram sera extraido da URL (removendo "https://instagram.com/")
- Campos vazios nao renderizam nada -- os cards continuam funcionando normalmente sem dados
- A secao de seguidores no card usa texto discreto (text-muted-foreground, text-xs) para nao poluir visualmente


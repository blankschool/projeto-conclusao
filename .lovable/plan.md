

# Preencher perfil detalhado do Tallis

## Visao geral

Adicionar 4 novas colunas na tabela `entrepreneurs` para armazenar o conteudo das secoes do perfil (posicionamento, tom_de_voz, editorias, materiais_extras). Preencher os dados do Tallis via UPDATE. Atualizar a pagina de perfil para exibir o conteudo dessas colunas quando preenchido, e atualizar o admin para permitir edicao.

## Mudancas

### 1. Migracao: adicionar 4 colunas

```sql
ALTER TABLE entrepreneurs
  ADD COLUMN posicionamento text,
  ADD COLUMN tom_de_voz text,
  ADD COLUMN editorias text,
  ADD COLUMN materiais_extras text;
```

Todas nullable — quando vazias, exibem o placeholder "Informacoes em breve".

### 2. Inserir dados do Tallis

UPDATE na tabela `entrepreneurs` onde `name = 'Tallis Gomes'` preenchendo:
- `bio` com o texto completo da secao Historia (Origem + Trajetoria + Transformacao + Vida pessoal)
- `posicionamento` com o texto completo
- `tom_de_voz` com o texto completo
- `editorias` com as 7 editorias
- `materiais_extras` com todos os links e informacoes extras

O conteudo sera armazenado como texto com quebras de linha. Links ficam em texto puro (a pagina os renderizara como clicaveis).

### 3. `src/pages/EntrepreneurProfilePage.tsx`

- Nas secoes Posicionamento, Tom de voz, Editorias e Materiais extras: exibir o conteudo da coluna correspondente quando preenchido, ou manter o placeholder
- Na secao Materiais extras: detectar URLs no texto e renderiza-las como links clicaveis
- O texto usa `whitespace-pre-line` para respeitar quebras de linha

### 4. `src/pages/AdminPage.tsx`

- Adicionar as 4 novas colunas a lista de colunas editaveis de `entrepreneurs`

### 5. Tipos Supabase

O arquivo `types.ts` sera atualizado automaticamente apos a migracao.


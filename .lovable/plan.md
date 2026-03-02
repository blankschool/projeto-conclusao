

# Remover formatação Markdown dos dados da Renata Vichi

## Problema
Os campos `bio`, `posicionamento`, `tom_de_voz` e `editorias` da Renata (id=8) contêm headers Markdown (`##`) que aparecem como texto cru na interface.

## Solução
Executar um `UPDATE` via migration SQL no registro `id = 8` da tabela `entrepreneurs`, removendo todos os `##` e substituindo por texto limpo com quebras de linha adequadas. Os títulos de seção serão mantidos em texto simples (ex: "Origem", "Trajetória profissional") seguidos de quebra de linha, sem marcação Markdown.

## Campos afetados
- **`bio`**: Remover `## Origem`, `## Trajetória profissional`, `## Momento pessoal marcante`, `## Vida pessoal`
- **`posicionamento`**: Remover `## Quem ela é para o mercado`, `## Diferencial central`, `## Missão declarada`, `## Antagonistas do posicionamento`
- **`tom_de_voz`**: Remover `## Características centrais`, `## Vocabulário característico`, `## Linguagem`, `## O que evitar absolutamente` e `**` bold markers
- **`editorias`**: Remover `## 1.`, `## 2.`, etc.

## Detalhes técnicos
- Tabela: `public.entrepreneurs`, registro `id = 8`
- Método: Migration SQL com `UPDATE`
- Todo o conteúdo textual será preservado, apenas a sintaxe Markdown será removida


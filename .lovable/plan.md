

# Atualizar documentos da Renata Vichi

## Problema
Os links atuais no campo `materiais_extras` da Renata (id=8) apontam para URLs do Notion com `expirationTimestamp`, que expiram e deixam de funcionar.

## Solução

1. **Copiar os PDFs para `public/documents/`** para que fiquem acessíveis permanentemente via URL da aplicação:
   - `public/documents/Midia_Kit_Renata_Vichi_2026.pdf`
   - `public/documents/Podcasts_Renata_Vichi.pdf`

2. **Atualizar o campo `materiais_extras`** (id=8) no banco, trocando os links do Notion pelos novos caminhos relativos ao domínio publicado:
   - `https://projeto-conclusao.lovable.app/documents/Midia_Kit_Renata_Vichi_2026.pdf`
   - `https://projeto-conclusao.lovable.app/documents/Podcasts_Renata_Vichi.pdf`

## Detalhes técnicos
- Tabela: `public.entrepreneurs`, registro `id = 8`
- Campo: `materiais_extras`
- Método: UPDATE via insert tool (não é alteração de schema)
- Os PDFs serão servidos diretamente pelo Vite/build como assets estáticos


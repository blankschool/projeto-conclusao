

# Atualizar link do Dossiê do Tallis Gomes

## O que mudar
Atualizar o campo `materiais_extras` do Tallis Gomes (id=11) na tabela `entrepreneurs`, substituindo o link atual do dossiê:

- **De:** `https://www.notion.so/blankschool/Dossi-Completo-Tallis-Gomes-21fd77361cee80f5a7f4e9f88a52d1b0`
- **Para:** `https://blankschool.notion.site/Dossi-Completo-Tallis-Gomes-21fd77361cee80f5a7f4e9f88a52d1b0?source=copy_link`

## Como
Uma migration SQL com `UPDATE` no registro `id = 11`, fazendo `REPLACE` no texto do campo `materiais_extras` para trocar apenas a URL do dossiê, mantendo todo o restante do conteúdo intacto.


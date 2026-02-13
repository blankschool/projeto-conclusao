

# Validar e-mail dos alunos via Google Sheets

## Resumo
Substituir a validacao hardcoded (que aceita emails com "blank" ou "teste") por uma verificacao real contra a planilha publica do Google Sheets que contem todos os alunos matriculados.

## Como funciona

A planilha ja esta publicada como CSV publico. O app vai buscar o CSV diretamente no navegador, extrair a coluna EMAIL e comparar com o e-mail digitado pelo aluno.

URL do CSV:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQcrRsRetEFdFk7tlIFgBLmRprPY5Z5vsZiTbRzgKgqIV-5N2SnTPSQivGyvW3Me2rCMBIQ-4Fy45ei/pub?gid=1657701443&single=true&output=csv
```

## Mudancas no codigo

### Arquivo: `src/pages/AuthPage.tsx`

Substituir o `setTimeout` com logica fake por:

1. Fazer `fetch()` da URL do CSV publico
2. Parsear o CSV para extrair a coluna EMAIL (indice 2)
3. Comparar o e-mail digitado (lowercase/trim) com a lista
4. Se encontrado: sucesso e redirecionar
5. Se nao encontrado: mostrar erro "E-mail nao encontrado na base de alunos"

### Detalhes tecnicos

- O CSV e publico, nao precisa de autenticacao
- A comparacao sera case-insensitive e com trim para evitar problemas de formatacao
- Nenhuma dependencia nova necessaria (usa `fetch` nativo e split para parsear CSV simples)
- A coluna EMAIL e a terceira coluna (indice 2) no CSV
- Mantemos os mesmos estados visuais (idle, loading, error, success) e mensagens



# Mostrar informacoes do aluno apos validacao do e-mail

## Resumo
Apos verificar o e-mail na planilha, exibir o nome, telefone e e-mail do aluno na tela de autenticacao antes de redirecionar, para que o usuario confirme sua identidade.

## Dados disponiveis na planilha (CSV)
- Coluna 1 (indice 1): NAME
- Coluna 2 (indice 2): EMAIL
- Coluna 3 (indice 3): PHONE NUMBER

## Mudancas

### Arquivo: `src/pages/AuthPage.tsx`

1. Adicionar um estado para guardar os dados do aluno encontrado:
   - `studentInfo: { name: string; email: string; phone: string } | null`

2. Quando o e-mail for encontrado no CSV, extrair nome e telefone da mesma linha e salvar no estado.

3. Substituir a mensagem simples de sucesso ("E-mail verificado. Redirecionando...") por um card com as informacoes do aluno:
   - Nome do aluno
   - E-mail
   - Telefone

4. Manter o redirecionamento automatico apos 1.5s (aumentar um pouco o delay para o aluno ter tempo de ver seus dados).

## Visual do card de sucesso

```text
+----------------------------------+
|  Bem-vindo(a)!                   |
|                                  |
|  Nome: Gustavo Oliveira          |
|  E-mail: gustavo@blank...       |
|  Telefone: +55 85 99201-6488    |
|                                  |
|  Redirecionando...               |
+----------------------------------+
```

## Detalhes tecnicos
- O parsing do CSV ja existe; basta guardar a linha inteira quando encontrar o e-mail
- O delay do redirect passa de 800ms para 1500ms para dar tempo de ler
- Nenhuma dependencia nova necessaria


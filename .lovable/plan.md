

# Melhorar layout dos indicadores de vagas

## Problema
Os indicadores de vagas (bolinhas) ficam em uma linha longa quando o empresario tem muitas vagas, ocupando muito espaco e ficando visualmente poluido.

## Solucao
Substituir as bolinhas por uma barra de progresso compacta mostrando vagas ocupadas vs. total, mantendo o texto "X vagas" ao lado.

### Visual proposto

```text
[=======-----]  3 vagas
 (ocupadas)  (livres)
```

- Barra com fundo cinza claro (border color)
- Preenchimento com cor do foreground para as vagas ocupadas
- Texto "X vagas" ao lado (ja existe)

## Mudanca

### Arquivo: `src/pages/SelectionPage.tsx`

Substituir o bloco de bolinhas (linhas 127-135) por uma barra de progresso simples usando divs com largura percentual:

- Container: `h-1.5 flex-1 rounded-full bg-border/50`
- Preenchimento: `h-full rounded-full bg-foreground` com `width` calculado como `(taken/slots)*100%`
- Se esgotado: barra com cor `bg-muted-foreground`

Manter o texto de vagas restantes ao lado como esta hoje.


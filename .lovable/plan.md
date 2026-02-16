

# Blur nas informacoes detalhadas do perfil do empresario

## Visao geral

Manter visivel o cabecalho do perfil (foto, nome, empresa, segmento, redes sociais) e aplicar um efeito de blur sobre todas as secoes de conteudo detalhado (Sobre, Diretrizes de conteudo, Referencias). Por cima do blur, exibir um aviso informando a data em que as informacoes serao liberadas (data de encerramento da etapa de selecao).

## O que fica visivel

- Botao "Voltar ao inicio"
- Foto, nome, empresa, segmento (badge)
- Links uteis (Instagram, LinkedIn, Site)

## O que fica com blur

- Secao "Sobre" (biografia)
- Secao "Diretrizes de conteudo"
- Secao "Referencias de conteudo"
- Rodape com mensagem de prazo e botao "Voltar"

## Como funciona o blur

Um wrapper `div` com `position: relative` envolve todas as secoes bloqueadas. Dentro dele:

1. O conteudo real continua renderizado normalmente, mas com `filter: blur(8px)` e `select-none pointer-events-none`
2. Um overlay absoluto centralizado por cima com:
   - Icone de cadeado (Lock do lucide-react)
   - Texto: "Informacoes disponiveis a partir de DD/MM" (data configuravel via constante no arquivo)
   - Fundo semi-transparente sutil para destacar o texto

Isso cria o efeito de "suspense" -- o usuario ve que tem conteudo ali mas nao consegue ler.

## Controle da data

Uma constante `SELECTION_CLOSE_DATE` no topo do componente (ex: `"24/02"`) que voce pode alterar facilmente quando definir a data exata. Futuramente pode virar uma config do Supabase.

## Mudancas

### Arquivo: `src/pages/EntrepreneurProfilePage.tsx`

- Adicionar constante `SELECTION_CLOSE_DATE` no topo
- Importar icone `Lock` do lucide-react
- Mover o separador para depois dos links uteis (antes do blur)
- Envolver as secoes Sobre, Diretrizes, Referencias e rodape em um `div` com posicao relativa
- Aplicar blur no conteudo e overlay com mensagem por cima




# Blank — Projeto de Conclusão (Redesign com Identidade Visual Blankbook)

## Visão Geral
Recriar o app de seleção de empresários para o projeto de conclusão dos alunos da Blank, seguindo rigorosamente as diretrizes de identidade visual do **Blankbook** (PDF de brand guidelines).

## Mudanças de Design (do original para o Blankbook)

### Paleta de Cores
- Substituir o tema escuro com neons (#E8FF5A, #5AFFB4, etc.) por uma paleta baseada em cinzas e o off-white da marca:
  - **Fundo principal**: #F4F0E7 (off-white quente)
  - **Textos**: #333333 (escuro), #666666 (médio), #999999 (suave)
  - **Bordas e elementos sutis**: #CCCCCC
  - **Destaques**: Preto (#020202) para elementos de destaque e CTAs
- Tom visual mais sofisticado e editorial, saindo do estilo dark/tech

### Tipografia
- **Títulos e textos longos**: Usar uma fonte serifada elegante (mais próxima de Reckless Neuett — usaremos uma serif disponível no Google Fonts como substituta, ex: Playfair Display ou similar)
- **Textos secundários e UI**: Usar uma grotesca clean (substituindo Founders Grotesk por uma similar disponível, ex: Inter ou similar sans-serif)
- Substituir completamente DM Sans e Space Mono

### Logo
- Integrar o SVG da logo **Blank** (BLACK_2.svg) no header da navegação, substituindo o texto "BLANK" atual

## Funcionalidades (mantidas do original)

### Página 1 — Explicação
- Header com subtítulo da turma e título principal
- Fluxo em 5 etapas (Autenticação → Seleção → Produção → Feedback → Publicação)
- Calendário com cronograma de datas
- Regras importantes
- Botão "Começar agora"

### Página 2 — Autenticação
- Campo de e-mail com validação simulada
- Estados: idle, loading, erro e sucesso
- Feedback visual para cada estado
- Redirecionamento automático após sucesso

### Página 3 — Seleção de Empresários
- Grid com 6 cards de empresários (nome, empresa, segmento, vagas disponíveis)
- Indicador visual de vagas (dots) e status "Esgotado"
- Modal de detalhes com bio e estatísticas de vagas
- Fluxo de confirmação em 2 etapas (info → confirmação irreversível)
- Tela de sucesso após inscrição confirmada

### Navegação
- Barra superior sticky com logo SVG e indicador de progresso (3 barras)
- Footer com copyright

## Estrutura de Componentes
- Componentes separados e organizados por página (ExplanationPage, AuthPage, SelectionPage)
- Componentes reutilizáveis (Badge, Button) com a nova identidade visual
- Estilização via Tailwind CSS (em vez de inline styles do JSX original)
- Dados mock mantidos para os empresários, eventos e etapas


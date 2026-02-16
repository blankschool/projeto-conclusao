

# Adicionar foto do Rony ao card de empresario

## Resumo
Salvar a foto do Rony no projeto e atualizar o card dos empresarios para exibir foto quando disponivel, mantendo as iniciais como fallback para os que ainda nao tem foto.

## Mudancas

### 1. Copiar a imagem para o projeto
- Salvar `user-uploads://image.png` em `public/entrepreneurs/rony.png`

### 2. Arquivo: `src/pages/SelectionPage.tsx`
- Criar um mapa de fotos: um objeto que relaciona o nome do empresario ao caminho da imagem
  - Ex: `{ "Rony": "/entrepreneurs/rony.png" }`
- No card, substituir o avatar de iniciais por uma imagem quando existir no mapa
- Se nao houver foto, manter o fallback com as iniciais (avatar atual)
- Aplicar a mesma logica no Dialog de detalhes do empresario

### 3. Visual
- A foto sera exibida no mesmo espaco do avatar atual (48x48 no card, 56x56 no dialog)
- Usar `object-cover` e `rounded-xl` para manter o estilo dos cards
- Iniciais continuam aparecendo para empresarios sem foto

## Proximos passos
Quando voce enviar as fotos dos outros empresarios, basta salvar no mesmo diretorio e adicionar ao mapa de nomes.


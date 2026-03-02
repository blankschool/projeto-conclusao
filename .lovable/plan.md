

# Visualizar perfis dos empresários no Admin

## Objetivo

Adicionar uma nova aba "Perfis" no painel admin que lista todos os empresários como cards clicáveis. Ao clicar, abre a visualização completa do perfil (bio, posicionamento, tom de voz, editorias, materiais extras) sem precisar passar pelo fluxo de cadastro.

## Mudanças

### `src/pages/AdminPage.tsx`

1. Adicionar uma nova aba "Perfis" nas tabs do admin, separada das tabelas CRUD.
2. Criar um componente `AdminProfiles` que:
   - Usa `useAdminList("entrepreneurs", password)` para buscar os dados
   - Exibe cards com nome, empresa e segmento de cada empresário
   - Ao clicar num card, exibe o perfil completo inline (usando o mesmo layout de `ProfileSection` do `EntrepreneurProfilePage`)
   - Botão de voltar à lista de cards
3. Reutilizar os componentes `ProfileSection` e `renderTextWithLinks` extraindo-os ou importando do `EntrepreneurProfilePage`.

### `src/pages/EntrepreneurProfilePage.tsx`

- Exportar `ProfileSection` e `renderTextWithLinks` como named exports para reuso no admin.

## Resultado

O admin terá uma aba "Perfis" onde pode navegar por todos os empresários e ver o conteúdo completo de cada um, sem cadastro.


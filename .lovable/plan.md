

# Reestruturar pagina de perfil do empresario

## O que muda

Remover o blur e o overlay de bloqueio. Substituir as secoes atuais ("Sobre", "Diretrizes", "Referencias") pelas novas secoes solicitadas:

1. **Historia** — texto do campo `bio` do empresario
2. **Posicionamento** — placeholder "Informacoes em breve"
3. **Tom de voz** — placeholder "Informacoes em breve"
4. **Editorias** — placeholder "Informacoes em breve"
5. **Materiais extras** — placeholder "Informacoes em breve"

Manter o header (foto, nome, empresa, segmento), a secao de "Links uteis", e o rodape com botao de voltar. Tudo visivel sem blur.

## Mudancas no codigo

### `src/pages/EntrepreneurProfilePage.tsx`

- Remover o wrapper `div.relative` com blur e o overlay com `Lock`
- Remover import de `Lock`
- Substituir as secoes blurradas por 5 secoes claras: Historia (usando `ent.bio`), Posicionamento, Tom de voz, Editorias, Materiais extras
- Cada secao com o mesmo estilo de label uppercase + conteudo
- Manter separadores entre grupos de secoes
- Manter o rodape com texto de prazo e botao de voltar




# Atualizar dados da Sandra Chayo no banco de dados

## Mudança

Atualizar o registro `id = 9` na tabela `entrepreneurs` com:

- **`bio`**: História completa -- origem familiar (Nissim Hara, imigrante, fundador da Hope em 1966), formação em Arquitetura pela FAAP, entrada na empresa familiar, revolução com franquias/e-commerce/branding, Grupo HOPE (270+ lojas), Shark Tank Brasil, podcast Papo Íntimo, vida pessoal (mãe, vegana, ativista judaica)
- **`posicionamento`**: Marca pessoal que une coragem, legado, sensibilidade e visão estratégica; traduz identidade de marca em atitude; defende marcas com alma e liderança feminina; combate superficialidade e fórmulas prontas
- **`tom_de_voz`**: Elegante e firme, sutilmente provocadora, afetiva com conteúdo; evitar linguagem fria, jargões, tom motivacional forçado ou clichês vazios
- **`editorias`**: 4 editorias (Branding, Liderança e Lifestyle, Cultura e Valores, Institucional)
- **`materiais_extras`**: Podcast Papo Íntimo (YouTube) + Hope Lingerie + Hope Resort

Será executado via insert tool com `UPDATE` no registro `id = 9`.

## Detalhes técnicos

- Tabela: `public.entrepreneurs`
- Registro: `id = 9`
- Ferramenta: insert tool (data operation, não migration)
- Campos: `bio`, `posicionamento`, `tom_de_voz`, `editorias`, `materiais_extras`


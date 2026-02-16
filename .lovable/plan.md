

# Adicionar link de suporte via WhatsApp na pagina de autenticacao

## Visao geral

A pagina de autenticacao (`AuthPage.tsx`) ja possui um texto no rodape mencionando "entre em contato com o suporte da Blank", porem sem link clicavel. A mudanca transforma esse texto em um link direto para o WhatsApp do suporte.

## Mudanca

### Arquivo: `src/pages/AuthPage.tsx` (linha 119-121)

Substituir o paragrafo atual:

```
Caso não consiga acessar, entre em contato com o suporte da Blank.
```

Por um texto com link clicavel para o WhatsApp:

```
Caso não consiga acessar, fale com o suporte da Blank.
```

Onde "fale com o suporte" sera um link (`<a>`) apontando para `https://wa.me/5512982115609?text=Quero%20ajuda%20com%20a%20plataforma%20do%20Projeto%20de%20Conclus%C3%A3o.`, abrindo em nova aba (`target="_blank"`), com estilo de underline e cor destacada para ficar clicavel.


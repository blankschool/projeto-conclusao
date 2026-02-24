

# Modo Admin protegido por senha

## Visao geral

Criar uma rota `/admin` oculta (sem link visivel na interface) protegida por senha. Ao acessar, o admin ve um painel com abas para editar todas as tabelas do Supabase diretamente no app: empresarios, eventos do calendario, etapas do fluxo, regras e selecoes.

A senha sera verificada server-side via edge function para evitar que qualquer usuario inspecione o codigo e descubra a credencial.

## Arquitetura

```text
/admin (rota no React Router)
   │
   ├─ Tela de login com campo de senha
   │     │
   │     └─ Chama edge function "verify-admin-password"
   │           └─ Compara com secret ADMIN_PASSWORD
   │           └─ Retorna token JWT temporario
   │
   └─ Painel admin (apos autenticado)
        ├─ Aba: Empresarios (CRUD inline)
        ├─ Aba: Calendario (editar eventos)
        ├─ Aba: Etapas do fluxo (editar steps)
        ├─ Aba: Regras (editar textos)
        └─ Aba: Selecoes (visualizar/deletar)
```

## Mudancas

### 1. Edge function `verify-admin-password`

- Recebe `{ password }` no body
- Compara com a secret `ADMIN_PASSWORD` configurada no Supabase
- Se correto, retorna `{ ok: true }` (a sessao admin fica em sessionStorage)
- Se incorreto, retorna 401

### 2. Secret `ADMIN_PASSWORD`

- Configurar um secret no Supabase com a senha desejada

### 3. RLS: permitir operacoes de escrita

As tabelas `calendar_events`, `flow_steps` e `rules` atualmente so permitem SELECT. Para o admin editar, sera necessario adicionar politicas de INSERT, UPDATE e DELETE. Como nao ha autenticacao Supabase (o admin valida por senha custom), as politicas serao abertas para `anon` nessas operacoes (ja que a protecao esta na camada da aplicacao via senha).

Alternativamente, usar a service role key na edge function para bypass de RLS -- esta e a abordagem mais segura e sera a adotada.

**Abordagem escolhida**: Criar uma edge function `admin-db` que recebe operacoes CRUD e usa a `SUPABASE_SERVICE_ROLE_KEY` (ja configurada) para executar as queries, bypassando RLS. Assim as politicas RLS restritivas permanecem intactas para usuarios normais.

### 4. Edge function `admin-db`

- Protegida pela mesma verificacao de senha
- Recebe operacoes: `{ password, table, action, data, id }`
- Actions: `list`, `insert`, `update`, `delete`
- Usa service role key para acessar o banco
- Tabelas permitidas: `entrepreneurs`, `calendar_events`, `flow_steps`, `rules`, `selections`

### 5. Nova pagina `src/pages/AdminPage.tsx`

- Campo de senha, salva em sessionStorage apos validacao
- Tabs com as 5 tabelas
- Cada tab mostra uma tabela editavel com botoes de salvar/deletar/adicionar
- Interface simples e funcional, sem necessidade de design elaborado

### 6. Hooks admin

- `src/hooks/useAdminAuth.ts` — gerencia estado de autenticacao admin (sessionStorage)
- `src/hooks/useAdminData.ts` — hook generico para CRUD via edge function

### 7. `src/App.tsx`

- Adicionar rota `/admin` apontando para `AdminPage`

### 8. Nao adicionar link visivel

- A rota `/admin` so e acessivel digitando a URL diretamente
- Nenhum link ou botao visivel na interface do usuario

## Detalhes tecnicos

A edge function `admin-db` centraliza todas as operacoes. Cada request inclui a senha no header `x-admin-password`. A funcao valida a senha contra o secret e, se correto, executa a operacao usando `createClient` com a service role key.

Tabelas editaveis e campos:

- **entrepreneurs**: name, company, segment, bio, avatar, slots, taken
- **calendar_events**: date, day, title, description, is_active, sort_order
- **flow_steps**: step_number, title, description, sort_order
- **rules**: text, sort_order
- **selections**: visualizacao + delete apenas


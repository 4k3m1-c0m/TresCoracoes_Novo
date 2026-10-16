# Cafeteria 3 Corações — React + Supabase Auth

## Instalação
1. Instale Node.js LTS.
2. Na pasta do projeto, execute `npm install`.
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os dados do seu projeto Supabase.
4. Execute `npm run dev` e abra o endereço indicado pelo Vite.

## Supabase Auth — Google
- No Google Cloud Console, crie credenciais OAuth do tipo Aplicativo da Web.
- Em Authorized redirect URIs, use `https://SEU_PROJECT_REF.supabase.co/auth/v1/callback`.
- No Supabase > Authentication > Providers > Google, habilite o provedor e informe Client ID e Client Secret.
- Em Authentication > URL Configuration, configure Site URL como `http://localhost:5173` e adicione `http://localhost:5173/**` às Redirect URLs. Em produção, adicione também o endereço real do app.
- No Google OAuth consent screen, cadastre os dados exigidos e adicione contas de teste se o app estiver em modo Testing.

## Políticas de CRUD
Execute no SQL Editor do Supabase (a tabela `produtos` deve existir):

```sql
alter table public.produtos enable row level security;

drop policy if exists "Produtos ativos visiveis" on public.produtos;
drop policy if exists "Usuarios autenticados podem consultar produtos" on public.produtos;
drop policy if exists "Usuarios autenticados podem inserir produtos" on public.produtos;
drop policy if exists "Usuarios autenticados podem atualizar produtos" on public.produtos;
drop policy if exists "Usuarios autenticados podem excluir produtos" on public.produtos;

create policy "Usuarios autenticados podem consultar produtos"
on public.produtos for select to authenticated using (true);
create policy "Usuarios autenticados podem inserir produtos"
on public.produtos for insert to authenticated with check (true);
create policy "Usuarios autenticados podem atualizar produtos"
on public.produtos for update to authenticated using (true) with check (true);
create policy "Usuarios autenticados podem excluir produtos"
on public.produtos for delete to authenticated using (true);
```

Para uma atividade escolar, estas políticas demonstram CRUD apenas para usuários autenticados. Em uma loja real, restrinja as permissões por função/usuário e nunca exponha `service_role`/secret no frontend.

## Capacitor / Android
Este projeto passa a usar Vite e gera o site em `dist`. Após `npm run build`, sincronize com Android usando `npx cap sync android`. O login OAuth deve ser testado no navegador primeiro; login em aplicativo nativo pode exigir deep links e configuração adicional.

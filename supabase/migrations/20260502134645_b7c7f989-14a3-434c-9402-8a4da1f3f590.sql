-- 1) Archived flag
alter table public.conversations
  add column if not exists archived_at timestamptz;

create index if not exists conversations_archived_at_idx on public.conversations(archived_at);
create index if not exists conversations_status_idx on public.conversations(status);

-- 2) Tighten RLS: visitors can only read their own conversation/messages.
-- We rely on a per-conversation visitor_id (UUID stored in localStorage) acting as a soft secret.

drop policy if exists "anyone can read conversations" on public.conversations;
drop policy if exists "anyone can read messages" on public.messages;

-- Security-definer helpers that take the visitor_id and return rows.
create or replace function public.get_visitor_conversation(_visitor_id text, _conversation_id uuid)
returns setof public.conversations
language sql stable security definer set search_path = public
as $$
  select * from public.conversations
  where id = _conversation_id and visitor_id = _visitor_id
$$;

create or replace function public.get_visitor_messages(_visitor_id text, _conversation_id uuid)
returns setof public.messages
language sql stable security definer set search_path = public
as $$
  select m.* from public.messages m
  join public.conversations c on c.id = m.conversation_id
  where c.id = _conversation_id and c.visitor_id = _visitor_id
  order by m.created_at asc
$$;

-- Admins keep full read access via a new policy
create policy "admins read all conversations" on public.conversations
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "admins read all messages" on public.messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Realtime: keep messages broadcast usable for visitors filtered by conversation_id.
-- Realtime postgres_changes still requires SELECT visibility, so we add a narrow
-- anon SELECT policy limited to messages whose conversation has matching visitor_id
-- supplied via session setting `app.visitor_id`. If not set, no rows.
create policy "anon read own messages by session var" on public.messages
  for select to anon using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.visitor_id = current_setting('request.headers', true)::json->>'x-visitor-id'
    )
  );

create policy "anon read own conversation by session var" on public.conversations
  for select to anon using (
    visitor_id = current_setting('request.headers', true)::json->>'x-visitor-id'
  );

-- 3) Fix linter: revoke EXECUTE on SECURITY DEFINER functions from public/anon/authenticated.
revoke execute on function public.has_role(uuid, app_role) from public, anon, authenticated;
revoke execute on function public.get_visitor_conversation(text, uuid) from public, anon, authenticated;
revoke execute on function public.get_visitor_messages(text, uuid) from public, anon, authenticated;

-- has_role is used inside RLS policies (definer context evaluates as owner) — no grant needed for clients.
-- get_visitor_* are called via PostgREST RPC by anon visitors.
grant execute on function public.get_visitor_conversation(text, uuid) to anon, authenticated;
grant execute on function public.get_visitor_messages(text, uuid) to anon, authenticated;
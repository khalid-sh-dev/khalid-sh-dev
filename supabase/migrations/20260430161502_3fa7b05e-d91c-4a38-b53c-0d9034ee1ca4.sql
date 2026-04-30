
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Conversations
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  visitor_name text,
  visitor_email text,
  status text not null default 'open',
  last_message_at timestamptz not null default now(),
  last_message_preview text,
  unread_admin_count int not null default 0,
  unread_user_count int not null default 0,
  created_at timestamptz not null default now()
);
create index conversations_visitor_id_idx on public.conversations(visitor_id);
create index conversations_last_message_at_idx on public.conversations(last_message_at desc);
alter table public.conversations enable row level security;

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('user','admin')),
  content text not null,
  created_at timestamptz not null default now()
);
create index messages_conversation_id_idx on public.messages(conversation_id, created_at);
alter table public.messages enable row level security;

-- Conversation policies
-- Anyone (including anon) can read a single conversation row when they know its id (used after creation by visitor).
-- We rely on visitor_id being a UUID stored in localStorage as a soft secret.
create policy "anyone can read conversations" on public.conversations
  for select to anon, authenticated using (true);
create policy "admins can update conversations" on public.conversations
  for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
-- Inserts/updates by visitors go through the edge function (service role), so no insert policy for anon needed.

-- Messages policies
create policy "anyone can read messages" on public.messages
  for select to anon, authenticated using (true);
create policy "admins can insert messages" on public.messages
  for insert to authenticated with check (public.has_role(auth.uid(),'admin') and sender = 'admin');

-- Realtime
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
alter table public.conversations replica identity full;
alter table public.messages replica identity full;

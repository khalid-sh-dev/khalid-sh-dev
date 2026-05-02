drop function if exists public.get_visitor_conversation(text, uuid);
drop function if exists public.get_visitor_messages(text, uuid);

-- has_role is internal to RLS only. Move it to a non-public schema is overkill;
-- instead keep it in public but ensure it has no EXECUTE grants for clients.
revoke execute on function public.has_role(uuid, app_role) from public, anon, authenticated;
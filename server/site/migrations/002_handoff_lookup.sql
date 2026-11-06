-- Prepared only. Apply to the selected site staging database, never a product DB.
begin;
create index if not exists site_session_handoffs on site_private.sessions using gin ((state->'handoffs'));
create or replace function public.site_find_handoff(p_ref text)
returns text language sql stable security invoker set search_path='' as $$
  select hash from site_private.sessions where expires_at>now() and (state->'handoffs') ? p_ref limit 1;
$$;
revoke execute on function public.site_find_handoff(text) from public,anon,authenticated;
grant execute on function public.site_find_handoff(text) to service_role;
commit;

-- Site-only storage. Review/apply to the selected staging database before deployment.
-- Never run against the panel/building-block databases as a side effect of site work.
begin;
create schema if not exists site_private;
revoke all on schema site_private from public, anon, authenticated;
grant usage on schema site_private to service_role;
create table if not exists site_private.sessions (
  hash text primary key check (length(hash)=64), revision bigint not null default 0,
  state jsonb not null, expires_at timestamptz not null
);
create table if not exists site_private.receipts (
  session_hash text not null references site_private.sessions(hash) on delete cascade,
  key text not null, value jsonb not null, expires_at timestamptz not null,
  primary key(session_hash,key)
);
create table if not exists site_private.quotas (key text primary key, count integer not null, expires_at timestamptz not null);
alter table site_private.sessions enable row level security;
alter table site_private.receipts enable row level security;
alter table site_private.quotas enable row level security;
revoke all on all tables in schema site_private from public, anon, authenticated;
grant select,insert,update,delete on all tables in schema site_private to service_role;

create or replace function public.site_session_create(p_hash text,p_state jsonb,p_expires timestamptz)
returns void language plpgsql security invoker set search_path='' as $$
begin
  insert into site_private.sessions(hash,state,expires_at) values(p_hash,p_state,p_expires);
end $$;
create or replace function public.site_session_read(p_hash text)
returns jsonb language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('revision',revision,'state',state,'expiresAt',expires_at)
  from site_private.sessions where hash=p_hash and expires_at>now();
$$;
create or replace function public.site_session_receipt(p_hash text,p_key text)
returns jsonb language sql stable security invoker set search_path='' as $$
  select r.value from site_private.receipts r join site_private.sessions s on s.hash=r.session_hash
  where r.session_hash=p_hash and r.key=p_key and r.expires_at>now() and s.expires_at>now();
$$;
create or replace function public.site_session_commit(p_hash text,p_revision bigint,p_state jsonb,p_key text,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare current_revision bigint; previous jsonb;
begin
  select revision into current_revision from site_private.sessions where hash=p_hash and expires_at>now() for update;
  if not found then return jsonb_build_object('kind','missing'); end if;
  select value into previous from site_private.receipts where session_hash=p_hash and key=p_key and expires_at>now();
  if found then
    if previous->>'digest'<>p_receipt->>'digest' then return jsonb_build_object('kind','mismatch'); end if;
    return jsonb_build_object('kind','replay','receipt',previous);
  end if;
  if current_revision<>p_revision then return jsonb_build_object('kind','conflict'); end if;
  update site_private.sessions set revision=revision+1,state=p_state where hash=p_hash;
  insert into site_private.receipts(session_hash,key,value,expires_at) values(p_hash,p_key,p_receipt,now()+interval '24 hours')
    on conflict(session_hash,key) do update set value=excluded.value,expires_at=excluded.expires_at;
  return jsonb_build_object('kind','committed','receipt',p_receipt);
end $$;
create or replace function public.site_take_quota(p_key text,p_limit integer,p_expires timestamptz)
returns boolean language plpgsql security invoker set search_path='' as $$
declare result integer;
begin
  insert into site_private.quotas(key,count,expires_at) values(p_key,1,p_expires)
    on conflict(key) do update set count=site_private.quotas.count+1 where site_private.quotas.count<p_limit returning count into result;
  return result is not null;
end $$;
revoke execute on function public.site_session_create(text,jsonb,timestamptz),public.site_session_read(text),public.site_session_receipt(text,text),public.site_session_commit(text,bigint,jsonb,text,jsonb),public.site_take_quota(text,integer,timestamptz) from public,anon,authenticated;
grant execute on function public.site_session_create(text,jsonb,timestamptz),public.site_session_read(text),public.site_session_receipt(text,text),public.site_session_commit(text,bigint,jsonb,text,jsonb),public.site_take_quota(text,integer,timestamptz) to service_role;
commit;

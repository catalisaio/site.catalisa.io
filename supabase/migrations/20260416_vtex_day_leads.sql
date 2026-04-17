-- VTEX Day 2026 lead capture
create table if not exists public.vtex_day_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  role text,
  persona text check (persona in ('lojista','agencia','dev','head','outro')),
  vtex_store_name text,
  monthly_orders_range text,
  interests text[] default '{}',
  privacy_accepted boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  source_path text default '/vtex-day-2026'
);

alter table public.vtex_day_leads enable row level security;

drop policy if exists "anon can insert vtex_day_leads" on public.vtex_day_leads;
create policy "anon can insert vtex_day_leads"
  on public.vtex_day_leads
  for insert
  to anon
  with check (privacy_accepted = true);

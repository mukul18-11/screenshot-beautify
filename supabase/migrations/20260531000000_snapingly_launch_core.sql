create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  dodo_customer_id text unique,
  account_status text not null default 'active'
    check (account_status in ('active', 'blocked', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dodo_subscription_id text unique not null,
  dodo_customer_id text,
  dodo_product_id text,
  plan_key text not null,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dodo_session_id text unique,
  plan_key text not null,
  dodo_product_id text not null,
  checkout_url text,
  status text not null default 'created'
    check (status in ('created', 'returned', 'completed', 'expired', 'cancelled')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.export_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  client_export_id text not null,
  entitlement text not null check (entitlement in ('free', 'pro')),
  action text not null check (action in ('download', 'copy')),
  requested_scale integer not null,
  allowed_scale integer not null,
  requires_watermark boolean not null,
  used_feature_keys text[] not null default '{}',
  blocked_feature_keys text[] not null default '{}',
  status text not null default 'prepared'
    check (status in ('prepared', 'succeeded', 'failed')),
  failure_code text,
  output_pixel_width integer,
  output_pixel_height integer,
  period_start date,
  period_end date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.export_usage_months (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  free_watermarked_exports integer not null default 0,
  pro_exports integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

create table if not exists public.dodo_webhook_events (
  webhook_id text primary key,
  event_type text not null,
  dodo_object_id text,
  processing_status text not null
    check (processing_status in ('received', 'processed', 'failed', 'ignored')),
  payload jsonb not null,
  error_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx
  on public.subscriptions(status);
create index if not exists subscriptions_current_period_end_idx
  on public.subscriptions(current_period_end);
create index if not exists checkout_sessions_user_id_idx
  on public.checkout_sessions(user_id);
create index if not exists export_attempts_user_period_idx
  on public.export_attempts(user_id, period_start);
create unique index if not exists export_attempts_user_client_export_uidx
  on public.export_attempts(user_id, client_export_id)
  where user_id is not null;
create index if not exists export_attempts_created_at_idx
  on public.export_attempts(created_at);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.export_attempts enable row level security;
alter table public.export_usage_months enable row level security;
alter table public.dodo_webhook_events enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles update own safe fields" on public.profiles;

drop policy if exists "subscriptions select own" on public.subscriptions;
create policy "subscriptions select own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "checkout sessions select own" on public.checkout_sessions;
create policy "checkout sessions select own"
  on public.checkout_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "export attempts select own" on public.export_attempts;
create policy "export attempts select own"
  on public.export_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "export usage select own" on public.export_usage_months;
create policy "export usage select own"
  on public.export_usage_months for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

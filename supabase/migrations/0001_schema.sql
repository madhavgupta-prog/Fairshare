-- FairShare schema — Section 4 of the build spec.
-- Run in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- profiles ------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  email       text not null,
  avatar_url  text,
  upi_id      text,
  theme       text not null default 'dark' check (theme in ('dark', 'light')),
  created_at  timestamptz not null default now()
);

-- trips ---------------------------------------------------------------------
create table if not exists public.trips (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  start_date  date,
  end_date    date,
  invite_code text not null unique,
  status      text not null default 'active' check (status in ('draft', 'active', 'settled')),
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- trip_members --------------------------------------------------------------
create table if not exists public.trip_members (
  id        uuid primary key default gen_random_uuid(),
  trip_id   uuid not null references public.trips (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (trip_id, user_id)
);

-- expenses ------------------------------------------------------------------
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references public.trips (id) on delete cascade,
  description text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  split_type  text not null default 'equal' check (split_type in ('equal', 'custom')),
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.expense_payers (
  id          uuid primary key default gen_random_uuid(),
  expense_id  uuid not null references public.expenses (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  amount_paid numeric(12, 2) not null check (amount_paid > 0),
  unique (expense_id, user_id)
);

create table if not exists public.expense_splits (
  id          uuid primary key default gen_random_uuid(),
  expense_id  uuid not null references public.expenses (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  amount_owed numeric(12, 2) not null check (amount_owed >= 0),
  unique (expense_id, user_id)
);

-- settlements ---------------------------------------------------------------
create table if not exists public.settlements (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references public.trips (id) on delete cascade,
  from_user  uuid not null references public.profiles (id) on delete cascade,
  to_user    uuid not null references public.profiles (id) on delete cascade,
  amount     numeric(12, 2) not null check (amount > 0),
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  check (from_user <> to_user)
);

-- indexes -------------------------------------------------------------------
create index if not exists trip_members_trip_id_idx    on public.trip_members (trip_id);
create index if not exists trip_members_user_id_idx    on public.trip_members (user_id);
create index if not exists expenses_trip_id_idx        on public.expenses (trip_id);
create index if not exists expense_payers_expense_idx  on public.expense_payers (expense_id);
create index if not exists expense_splits_expense_idx  on public.expense_splits (expense_id);
create index if not exists settlements_trip_id_idx     on public.settlements (trip_id);

-- auto-create a profile row on signup --------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

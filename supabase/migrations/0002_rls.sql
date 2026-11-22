-- FairShare Row Level Security — Section 5 of the build spec.
--
-- Deviation worth knowing about: the spec writes the trip_members SELECT policy as a
-- subquery over trip_members itself. Postgres re-applies the policy while evaluating
-- that subquery, which makes it recurse infinitely at query time. The standard fix is
-- a SECURITY DEFINER helper that bypasses RLS for the membership lookup only. Same
-- rule, same guarantee — it just terminates.

create or replace function public.is_trip_member(check_trip_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = check_trip_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_member_of_expense(check_expense_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.expenses e
    join public.trip_members tm on tm.trip_id = e.trip_id
    where e.id = check_expense_id and tm.user_id = auth.uid()
  );
$$;

alter table public.profiles       enable row level security;
alter table public.trips          enable row level security;
alter table public.trip_members   enable row level security;
alter table public.expenses       enable row level security;
alter table public.expense_payers enable row level security;
alter table public.expense_splits enable row level security;
alter table public.settlements    enable row level security;

-- profiles ------------------------------------------------------------------
create policy "profiles readable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- trips ---------------------------------------------------------------------
create policy "members can view trip"
  on public.trips for select
  using (public.is_trip_member(id));

create policy "authenticated users can create trips"
  on public.trips for insert
  with check (auth.uid() = created_by);

create policy "creator can update trip"
  on public.trips for update
  using (auth.uid() = created_by);

-- trip_members --------------------------------------------------------------
create policy "members can view trip roster"
  on public.trip_members for select
  using (public.is_trip_member(trip_id));

-- A user can add themselves (join by invite code), and a trip creator can add others.
create policy "join a trip or be added by the creator"
  on public.trip_members for insert
  with check (
    auth.uid() = user_id
    or exists (select 1 from public.trips t where t.id = trip_id and t.created_by = auth.uid())
  );

-- expenses ------------------------------------------------------------------
create policy "members can view expenses"
  on public.expenses for select
  using (public.is_trip_member(trip_id));

create policy "members can add expenses"
  on public.expenses for insert
  with check (public.is_trip_member(trip_id));

create policy "creator can update own expense"
  on public.expenses for update
  using (auth.uid() = created_by);

create policy "creator can delete own expense"
  on public.expenses for delete
  using (auth.uid() = created_by);

-- expense_payers ------------------------------------------------------------
create policy "members can view payers"
  on public.expense_payers for select
  using (public.is_member_of_expense(expense_id));

create policy "members can add payers"
  on public.expense_payers for insert
  with check (public.is_member_of_expense(expense_id));

-- expense_splits ------------------------------------------------------------
create policy "members can view splits"
  on public.expense_splits for select
  using (public.is_member_of_expense(expense_id));

create policy "members can add splits"
  on public.expense_splits for insert
  with check (public.is_member_of_expense(expense_id));

-- settlements ---------------------------------------------------------------
create policy "members can view settlements"
  on public.settlements for select
  using (public.is_trip_member(trip_id));

create policy "members can record settlements"
  on public.settlements for insert
  with check (public.is_trip_member(trip_id));

create policy "participants can update settlement"
  on public.settlements for update
  using (auth.uid() = from_user or auth.uid() = to_user);

-- Amount-sum validation — RLS can't express this, so it lives in triggers.
create or replace function public.check_split_sum()
returns trigger
language plpgsql
as $$
begin
  if (select coalesce(sum(amount_owed), 0) from public.expense_splits where expense_id = new.expense_id)
     > (select amount from public.expenses where id = new.expense_id) + 0.5 then
    raise exception 'Split amounts exceed expense total';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_split_sum on public.expense_splits;
create trigger enforce_split_sum
  after insert or update on public.expense_splits
  for each row execute function public.check_split_sum();

create or replace function public.check_payer_sum()
returns trigger
language plpgsql
as $$
begin
  if (select coalesce(sum(amount_paid), 0) from public.expense_payers where expense_id = new.expense_id)
     > (select amount from public.expenses where id = new.expense_id) + 0.5 then
    raise exception 'Paid amounts exceed expense total';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_payer_sum on public.expense_payers;
create trigger enforce_payer_sum
  after insert or update on public.expense_payers
  for each row execute function public.check_payer_sum();

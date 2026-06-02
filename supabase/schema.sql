-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  monthly_baseline_income numeric(12, 2) default 0.00 not null,
  baseline_income_day integer default 1 not null check (baseline_income_day >= 1 and baseline_income_day <= 31)
);

alter table public.profiles enable row level security;

-- Check and drop existing policies if any to avoid errors during creation
drop policy if exists "Users can view their own profile." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;

create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- BASELINE INCOME TABLE
create table if not exists public.baseline_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  transfer_day integer default 1 not null check (transfer_day >= 1 and transfer_day <= 31),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.baseline_income enable row level security;

create policy "Users can perform all operations on their own baseline income." on public.baseline_income
  for all using (auth.uid() = user_id);

-- FIXED EXPENSES TABLE
create table if not exists public.fixed_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  category text not null,
  due_day integer default 1 not null check (due_day >= 1 and due_day <= 31),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.fixed_expenses enable row level security;

drop policy if exists "Users can perform all operations on their own fixed expenses." on public.fixed_expenses;

create policy "Users can perform all operations on their own fixed expenses." on public.fixed_expenses
  for all using (auth.uid() = user_id);

-- ADDITIONAL INCOME TABLE
create table if not exists public.additional_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text default '',
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.additional_income enable row level security;

drop policy if exists "Users can perform all operations on their own additional income." on public.additional_income;

create policy "Users can perform all operations on their own additional income." on public.additional_income
  for all using (auth.uid() = user_id);

-- EXPENSES TABLE
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  category text not null,
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

drop policy if exists "Users can perform all operations on their own expenses." on public.expenses;

create policy "Users can perform all operations on their own expenses." on public.expenses
  for all using (auth.uid() = user_id);

-- PROFILE TRIGGER FOR NEW SIGNUPS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, monthly_baseline_income)
  values (new.id, 0.00)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

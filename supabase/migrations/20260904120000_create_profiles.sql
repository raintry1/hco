-- ============================================================================
-- Phase 2B — Database foundation: profiles
--
-- Creates:
--   1. public.profiles (1:1 with auth.users, no sensitive auth data)
--   2. an automatic profile-creation trigger on auth.users insert
--   3. Row Level Security policies + a public read-only view
--
-- Apply with the Supabase CLI (`supabase db push`) or paste this file into the
-- Supabase SQL editor. Idempotent enough to be safe if run twice.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles table
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  username text unique,
  avatar_url text,
  bio text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'User profile data. id must always correspond to auth.users.id.';
comment on column public.profiles.role is
  'Membership role. Defaults to ''user''; only admins may assign ''admin''.';

-- ----------------------------------------------------------------------------
-- 2a. updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function public.handle_updated_at ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at ();

-- ----------------------------------------------------------------------------
-- 2b. Automatic profile creation on signup
--
-- Runs as SECURITY DEFINER (the signup transaction has no user session yet,
-- so RLS would otherwise block the insert). Only name/avatar metadata from
-- the Google identity is copied — never role, which always defaults to 'user'.
-- username is intentionally left NULL (unique across users) so new signups
-- can never collide; users set it later in profile editing.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture',
      null
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user ();

-- ----------------------------------------------------------------------------
-- 3. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Helper used by policies. SECURITY DEFINER prevents RLS recursion inside
-- policy expressions (it reads profiles without re-triggering policies).
create or replace function public.is_admin ()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid ()
      and role = 'admin'
  );
$$;

-- Authenticated users can read their own row (role included so the profile
-- page can display it). Public readers use profiles_public below instead.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid () = id);

-- Users may create their own row (covers the rare case of a user whose
-- trigger-created row is missing). role is forced to 'user' — a normal user
-- can never self-insert an admin row.
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (
    auth.uid () = id
    and role = 'user'
  );

-- Users may update their own row, but only while keeping id, role and
-- created_at identical to the stored row. Admins use the admin policy below.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid () = id)
  with check (
    auth.uid () = id
    and (role, created_at) = (
      select p.role, p.created_at
      from public.profiles p
      where p.id = auth.uid ()
    )
  );

-- Admins may update any profile, including role assignments.
create policy "profiles_admin_update"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

-- ----------------------------------------------------------------------------
-- 4. Public read access — only identity fields needed to display authors.
--
-- A plain (definer) view: it runs with the creator's privileges, so it can
-- return rows regardless of table RLS — but it exposes only the whitelisted
-- columns. role and updated_at are intentionally excluded so admin flags are
-- never public. Use this view for author/user identity display.
-- ----------------------------------------------------------------------------
create or replace view public.profiles_public
with (security_barrier = true) as
select
  id,
  display_name,
  username,
  avatar_url,
  bio,
  created_at
from public.profiles;

grant select on public.profiles_public to anon, authenticated;

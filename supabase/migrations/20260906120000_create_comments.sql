-- ============================================================================
-- Comments on blog posts.
--
-- Creates:
--   1. public.comments (keyed by post_slug so it works for mock and live posts)
--   2. Row Level Security: public read, authenticated users manage own rows,
--      admins manage all rows (via public.is_admin() from the profiles migration)
--
-- Apply with the Supabase CLI (`supabase db push`) or paste this file into the
-- Supabase SQL editor. Safe to run twice.
-- ============================================================================

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid (),
  post_slug text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Denormalized display snapshot so comment lists render without joins.
  -- Display-only; authorization always uses user_id.
  author_name text not null default '',
  author_avatar text,
  body text not null check (char_length (body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.comments is
  'Blog post comments. post_slug matches the Post slug from the content API.';

create index if not exists comments_post_slug_created_idx
  on public.comments (post_slug, created_at desc);

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at ();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.comments enable row level security;

-- Everyone (including logged-out visitors) can read comments.
drop policy if exists "comments_select_all" on public.comments;
create policy "comments_select_all"
  on public.comments
  for select
  to anon, authenticated
  using (true);

-- Signed-in users can post as themselves only.
drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own"
  on public.comments
  for insert
  to authenticated
  with check (auth.uid () = user_id);

-- Signed-in users can edit their own comments (never someone else's row).
drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
  on public.comments
  for update
  to authenticated
  using (auth.uid () = user_id)
  with check (auth.uid () = user_id);

-- Signed-in users can delete their own comments.
drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own"
  on public.comments
  for delete
  to authenticated
  using (auth.uid () = user_id);

-- Admins can manage every comment.
drop policy if exists "comments_admin_all" on public.comments;
create policy "comments_admin_all"
  on public.comments
  for all
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

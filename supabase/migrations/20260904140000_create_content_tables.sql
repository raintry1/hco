-- ============================================================================
-- Phase 2C — Content database foundation
--
-- Creates:
--   1. public.categories        (blog taxonomy)
--   2. public.tags              (blog taxonomy)
--   3. public.posts             (content; authors are public.profiles rows)
--   4. public.post_tags         (many-to-many posts <-> tags)
--   5. Row Level Security policies matching HCO_SPEC.md permission model
--   6. Seed data: the 8 categories and 18 tags from the mock data
--      (apps/web/src/data/mock-data.ts). Posts are intentionally NOT migrated.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste this file into the
-- Supabase SQL editor. This file is a follow-up to
-- 20260904120000_create_profiles.sql and relies on two helpers it defines:
--   public.handle_updated_at()  (updated_at maintenance)
--   public.is_admin()           (RLS role check)
-- Apply that file first (it is already applied on the remote project).
-- Idempotent enough to be safe if run twice (IF NOT EXISTS / IF NOT EXISTS
-- indexes / ON CONFLICT seeds). No existing tables or data are dropped.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. categories
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  icon text,
  created_at timestamptz not null default now()
);

comment on table public.categories is
  'Post categories. Public taxonomy shown on the site.';
comment on column public.categories.icon is
  'Lucide icon key used by the frontend (e.g. shield, globe, lock).';
comment on column public.categories.color is
  'Hex color used by the frontend category UI.';

-- ----------------------------------------------------------------------------
-- 2. tags
-- ----------------------------------------------------------------------------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.tags is
  'Post tags. Public taxonomy shown on the site.';

-- ----------------------------------------------------------------------------
-- 3. posts
--
-- Column set mirrors packages/shared Post type (snake_case). author_id points
-- at public.profiles: an authenticated user acts as the post author. There is
-- deliberately no created_at column — the type/spec define none; published_at
-- and updated_at carry the timeline.
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  content text not null default '',
  cover_image_url text,
  author_id uuid not null references public.profiles (id) on delete restrict,
  category_id uuid not null references public.categories (id) on delete restrict,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  reading_time integer not null default 0 check (reading_time >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  featured boolean not null default false,
  trending boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  constraint posts_published_requires_date check (
    status <> 'published' or published_at is not null
  )
);

comment on table public.posts is
  'Blog posts. Public readers see only status = ''published'' rows.';
comment on column public.posts.status is
  'Workflow state: ''draft'' (only admins can see) or ''published'' (public).';
comment on column public.posts.published_at is
  'Null while the post is a draft; required once status = ''published''.';

-- updated_at maintenance (helper defined in the profiles migration)
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.handle_updated_at ();

-- ----------------------------------------------------------------------------
-- 4. post_tags (junction)
-- ----------------------------------------------------------------------------
create table if not exists public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

comment on table public.post_tags is
  'Many-to-many association between posts and tags.';

-- ----------------------------------------------------------------------------
-- 5. Indexes for the queries the public site and admin panel will run
-- ----------------------------------------------------------------------------
create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);
create index if not exists posts_category_id_idx
  on public.posts (category_id);
create index if not exists posts_author_id_idx
  on public.posts (author_id);
create index if not exists posts_featured_idx
  on public.posts (published_at desc)
  where featured;
create index if not exists posts_trending_idx
  on public.posts (published_at desc)
  where trending;
create index if not exists post_tags_tag_id_idx
  on public.post_tags (tag_id);

-- ----------------------------------------------------------------------------
-- 6. Row Level Security
--
-- Permission model (HCO_SPEC.md):
--   anon (visitors)           read published posts + public taxonomy
--   authenticated (users)     read published posts + public taxonomy
--                             (may NOT create/update/delete content)
--   admin                     full content management on all four tables
-- Public read of taxonomy is open (all categories/tags — the public site shows
-- the full list even for categories with no posts yet). Posts are gated to
-- status = 'published'. Non-admin authenticated users never get write access.
-- ----------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;

-- --- categories: public read, admin write ------------------------------
create policy "categories_public_read"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "categories_admin_insert"
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin ());

create policy "categories_admin_update"
  on public.categories
  for update
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

create policy "categories_admin_delete"
  on public.categories
  for delete
  to authenticated
  using (public.is_admin ());

-- --- tags: public read, admin write ------------------------------------
create policy "tags_public_read"
  on public.tags
  for select
  to anon, authenticated
  using (true);

create policy "tags_admin_insert"
  on public.tags
  for insert
  to authenticated
  with check (public.is_admin ());

create policy "tags_admin_update"
  on public.tags
  for update
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

create policy "tags_admin_delete"
  on public.tags
  for delete
  to authenticated
  using (public.is_admin ());

-- --- posts: published only to public, everything to admins -------------
create policy "posts_public_read"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

create policy "posts_admin_select"
  on public.posts
  for select
  to authenticated
  using (public.is_admin ());

create policy "posts_admin_insert"
  on public.posts
  for insert
  to authenticated
  with check (public.is_admin ());

create policy "posts_admin_update"
  on public.posts
  for update
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

create policy "posts_admin_delete"
  on public.posts
  for delete
  to authenticated
  using (public.is_admin ());

-- --- post_tags: published rows only to public, everything to admins ----
-- The subquery runs under the caller's RLS, so anon/authenticated can only
-- ever see tag links of published posts (drafts are invisible to them on the
-- posts table too, so nothing leaks through this join).
create policy "post_tags_public_read"
  on public.post_tags
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.posts p
      where p.id = post_id
        and p.status = 'published'
    )
  );

create policy "post_tags_admin_insert"
  on public.post_tags
  for insert
  to authenticated
  with check (public.is_admin ());

create policy "post_tags_admin_update"
  on public.post_tags
  for update
  to authenticated
  using (public.is_admin ())
  with check (public.is_admin ());

create policy "post_tags_admin_delete"
  on public.post_tags
  for delete
  to authenticated
  using (public.is_admin ());

-- ----------------------------------------------------------------------------
-- 7. Seed data — from apps/web/src/data/mock-data.ts (categories + tags only)
--
-- ON CONFLICT (slug) DO NOTHING keeps this re-runnable without duplicating
-- rows or clobbering rows an admin may have added or edited since.
-- ----------------------------------------------------------------------------
insert into public.categories (name, slug, description, color, icon)
values
  ('Web Security', 'web-security', 'Vulnerabilities, exploits, and defenses for web applications', '#ef4444', 'shield'),
  ('Network Security', 'network-security', 'Network protocols, penetration testing, and infrastructure security', '#f97316', 'globe'),
  ('Cryptography', 'cryptography', 'Encryption, protocols, and mathematical foundations of security', '#eab308', 'lock'),
  ('Reverse Engineering', 'reverse-engineering', 'Binary analysis, decompilation, and understanding compiled code', '#22c55e', 'cpu'),
  ('Malware Analysis', 'malware-analysis', 'Behavioral analysis, static/dynamic analysis of malicious software', '#a855f7', 'bug'),
  ('DevOps Security', 'devops-security', 'CI/CD security, container security, infrastructure as code', '#06b6d4', 'server'),
  ('Programming', 'programming', 'Secure coding practices, language-specific security features', '#8b5cf6', 'code'),
  ('Career', 'career', 'Career advice, certifications, and professional development', '#ec4899', 'briefcase')
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values
  ('XSS', 'xss'),
  ('SQL Injection', 'sql-injection'),
  ('CSRF', 'csrf'),
  ('Authentication', 'authentication'),
  ('OAuth', 'oauth'),
  ('JWT', 'jwt'),
  ('Zero-Knowledge', 'zero-knowledge'),
  ('Elliptic Curves', 'elliptic-curves'),
  ('Ghidra', 'ghidra'),
  ('IDA Pro', 'ida-pro'),
  ('YARA', 'yara'),
  ('Docker', 'docker'),
  ('Kubernetes', 'kubernetes'),
  ('Rust', 'rust'),
  ('Go', 'go'),
  ('Bug Bounty', 'bug-bounty'),
  ('CTF', 'ctf'),
  ('OSINT', 'osint')
on conflict (slug) do nothing;

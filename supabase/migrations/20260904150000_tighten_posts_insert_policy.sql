-- ============================================================================
-- Phase 2F — RLS hardening: posts may only be created by their author.
--
-- The original posts_admin_insert policy (20260904140000) only required
-- is_admin(), so an admin could insert a post with any author_id (e.g.
-- impersonating another profile). This tightens creation so the author_id
-- MUST be the authenticated admin's own user id. Existing FK/RLS protections
-- are unchanged and nothing is dropped except the policy being replaced.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor. Safe to run twice.
-- ============================================================================

drop policy if exists "posts_admin_insert" on public.posts;

create policy "posts_admin_insert"
  on public.posts
  for insert
  to authenticated
  with check (
    public.is_admin ()
    and author_id = auth.uid ()
  );

comment on policy "posts_admin_insert" on public.posts is
  'Admins may create posts, but only as themselves (author_id must equal the session user).';

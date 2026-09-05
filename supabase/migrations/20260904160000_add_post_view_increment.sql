-- ============================================================================
-- FIX4 — Secure post view counter
--
-- Public visitors may read published posts but must NOT get UPDATE access to
-- public.posts (RLS: only admins can update). To still record views we expose
-- a single, narrowly scoped SECURITY DEFINER function:
--
--   public.increment_post_view(post_id uuid)
--
-- The function:
--   - runs as the function owner (table owner) so it can write despite RLS,
--     but ONLY to the one column in the one statement below
--   - atomically increments view_count in a single UPDATE
--     (view_count = view_count + 1 — no read-then-write race, no lost updates)
--   - refuses drafts and missing posts (WHERE status = 'published')
--   - returns only the new view_count (no other post data)
--   - uses a fixed, empty search_path — every reference is fully qualified,
--     so no search-path hijacking is possible
--   - contains no dynamic SQL
--   - is executable by anon/authenticated only (PUBLIC is revoked)
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor. Safe to run twice (CREATE OR REPLACE / idempotent grants).
-- ============================================================================

create or replace function public.increment_post_view(post_id uuid)
returns table (view_count integer)
language sql
security definer
set search_path = ''
as $$
  update public.posts
  set view_count = view_count + 1
  where id = post_id
    and status = 'published'
  returning view_count;
$$;

comment on function public.increment_post_view(uuid) is
  'Atomically increments view_count for a published post and returns the new count. '
  'Refuses drafts and missing posts; cannot modify any other column. '
  'SECURITY DEFINER with empty search_path; all references are schema-qualified.';

-- Only the intended public roles may call it; everyone else is denied.
revoke execute on function public.increment_post_view(uuid) from public;
grant execute on function public.increment_post_view(uuid) to anon, authenticated;
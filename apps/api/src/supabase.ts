import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Returns a Supabase client for the Express API.
 *
 * Uses the ANON key + RLS for public reads — the same permission model the
 * public site relies on. The service-role key is intentionally NOT used here
 * (it bypasses RLS and is only for trusted admin/server-side writes later).
 *
 * Throws when the env vars are missing so callers can respond 503 instead of
 * crashing. Lazy singleton: the client is created on first use.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in apps/api/.env'
    );
  }

  client = createClient(url, anonKey);
  return client;
}
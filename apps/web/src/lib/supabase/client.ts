import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client.
 *
 * Used by client components (e.g. the login form and the header auth
 * controls) to initiate Google OAuth and observe the auth state.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
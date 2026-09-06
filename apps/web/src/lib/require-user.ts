import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side login wall. Call at the top of a protected Server Component —
 * logged-out visitors are sent to /login and brought back to `nextPath`
 * after Google sign-in (via the callback's `next` support).
 */
export async function requireUser(nextPath: string): Promise<User> {
  let user: User | null = null;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

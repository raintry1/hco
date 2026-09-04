import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-only admin helpers. Authorization is ultimately enforced by Supabase
 * RLS (is_admin()); these helpers gate the UI/route layer for good UX.
 * Never use the service-role key anywhere in this flow.
 */

export interface AdminSession {
  supabase: SupabaseClient;
  user: User;
}

/** Current session user + server client, or null when signed out. */
export async function getSessionUser(): Promise<AdminSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

/** True when the given user's profile row has role = 'admin'. */
export async function isAdminUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'admin';
}

/** Session + admin role, or null (used by pages to redirect to /login). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getSessionUser();
  if (!session) return null;
  if (!(await isAdminUser(session.supabase, session.user.id))) return null;
  return session;
}

/**
 * Route-handler gate. Returns the admin session, or a ready-made 401/403
 * NextResponse. Authorization is still ultimately enforced by RLS on every
 * write below — this only produces friendly error codes.
 */
export async function requireAdminForRoute(): Promise<
  | { session: AdminSession }
  | { response: NextResponse }
> {
  const session = await getSessionUser();
  if (!session) {
    return {
      response: NextResponse.json({ error: 'Sign in required.' }, { status: 401 }),
    };
  }
  if (!(await isAdminUser(session.supabase, session.user.id))) {
    return {
      response: NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 }
      ),
    };
  }
  return { session };
}

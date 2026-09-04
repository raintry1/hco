import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@hco/shared';
import { createClient } from '@/lib/supabase/server';
import { ProfileContent } from './profile-content';

export default async function ProfilePage() {
  let user: User | null = null;
  let profile: Profile | null = null;

  try {
    const supabase = createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url, bio, role, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();
      profile = (data as Profile | null) ?? null;
    }
  } catch {
    // Auth/profile could not be resolved (e.g. Supabase not configured or the
    // profiles table not created yet) — treat the visitor as unauthenticated
    // or as a user without a profile row.
    user = null;
    profile = null;
  }

  if (!user) {
    redirect('/login');
  }

  return <ProfileContent user={user} profile={profile} />;
}

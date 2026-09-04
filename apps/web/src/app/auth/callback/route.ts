import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  // Derive the origin from the Host header rather than request.url. In dev
  // the server is bound to 0.0.0.0, so request.url reports the bind address
  // as the host — redirecting logins to http://0.0.0.0:3000 — regardless of
  // the host the browser actually used (e.g. http://52.91.79.218:3000).
  const host = request.headers.get('host') ?? requestUrl.host;
  const origin = `${requestUrl.protocol}//${host}`;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Only allow local paths to avoid open redirects.
      const redirectTo = next?.startsWith('/') ? next : '/profile';
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // The OAuth flow failed or was cancelled (e.g. access_denied from Google).
  // Redirect back to the login page with a readable error state.
  return NextResponse.redirect(`${origin}/login?error=callback`);
}
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

const ERROR_MESSAGES: Record<string, string> = {
  callback: "We couldn't complete the sign-in. Please try again.",
  access_denied: 'Sign-in was cancelled or denied. Please try again.',
};

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const nextParam = searchParams.get('next');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      // After Google login, return to the page that required auth (if any).
      const next = nextParam && nextParam.startsWith('/') ? nextParam : null;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
      // On success the browser navigates to Google — no state update needed.
    } catch {
      setError('Something went wrong while connecting to Google. Please try again.');
      setIsLoading(false);
    }
  };

  const displayError =
    error || (errorParam ? (ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.callback) : '');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8" aria-label="Hackers Colony Official - Home">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            HCO
          </span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in with Google to access your profile and join the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {displayError && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {displayError}
              </div>
            )}

            <Button
              onClick={() => { void handleGoogleSignIn(); }}
              disabled={isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleIcon />
              )}
              {isLoading ? 'Redirecting to Google...' : 'Continue with Google'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
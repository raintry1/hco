'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Github, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/site-config';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegister = searchParams.get('register') === 'true';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/profile'), 1500);
    } else {
      setSuccess('Signed in successfully! Redirecting...');
      setTimeout(() => router.push('/profile'), 1500);
    }
    setIsLoading(false);
  };

  const handleOAuth = (provider: 'github' | 'google') => {
    setError(`${provider} authentication will be available in Phase 2`);
  };

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
            <CardTitle className="text-2xl">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? 'Join the community of security researchers and developers'
                : 'Sign in to access your dashboard and saved articles'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm" role="status">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </div>

            <Separator className="my-4" />
            <p className="text-center text-sm text-muted-foreground">or continue with email</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isRegister && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10"
                    autoComplete={isRegister ? 'email' : 'username'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isRegister ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isRegister ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                href={isRegister ? '/login' : '/login?register=true'}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
              .
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo mode - Authentication will be implemented in Phase 2
        </p>
      </div>
    </div>
  );
}
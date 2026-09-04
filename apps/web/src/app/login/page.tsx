import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
              HCO
            </span>
          </div>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
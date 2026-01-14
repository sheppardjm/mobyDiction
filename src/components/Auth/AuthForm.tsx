import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useAuthStore } from '../../store/auth-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function AuthForm() {
  const { signIn } = useAuthActions();
  const { authMode, setAuthMode, closeAuthModal } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { signingIn } = await signIn('password', {
        email,
        password,
        flow: authMode,
      });

      if (signingIn) {
        closeAuthModal();
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = authMode === 'signUp';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={isLoading}
        />
        {isSignUp && (
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {isSignUp ? 'Creating account...' : 'Signing in...'}
          </span>
        ) : isSignUp ? (
          'Create Account'
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signIn')}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signUp')}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </>
        )}
      </div>
    </form>
  );
}

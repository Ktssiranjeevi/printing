import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Apple, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { demoCredentials, useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storefrontUser, loginStorefront, registerStorefront, loginStorefrontWithProvider } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(demoCredentials.storefront.email);
  const [password, setPassword] = useState(demoCredentials.storefront.password);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  if (storefrontUser) {
    return <Navigate to="/" replace />;
  }

  const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  const redirectAfterLogin = () => {
    navigate(nextPath, { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = mode === 'login'
      ? loginStorefront(email, password)
      : registerStorefront(name, email, password);

    if (!result.success) {
      setError(result.message || 'Login failed.');
      return;
    }

    setError('');
    redirectAfterLogin();
  };

  const handleProviderLogin = (provider: 'google' | 'apple') => {
    const result = loginStorefrontWithProvider(provider);

    if (!result.success) {
      setError(result.message || 'Login failed.');
      return;
    }

    setError('');
    redirectAfterLogin();
  };

  const handlePhoneLogin = () => {
    const result = loginStorefrontWithProvider('phone', phoneNumber);

    if (!result.success) {
      setError(result.message || 'Login failed.');
      return;
    }

    setError('');
    redirectAfterLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e293b_48%,#2563eb_76%,#f59e0b)] px-4 py-10">
      <Card className="w-full max-w-lg border-0 bg-white shadow-2xl">
        <CardHeader className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Storefront access</p>
          <CardTitle className="text-3xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
          <p className="text-sm text-slate-600">
            {mode === 'login'
              ? 'Sign in with email, Gmail, Apple, or your phone number to browse products, customize designs, and manage your cart.'
              : 'Register once and come back later to log in with the same email and password on this browser.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setEmail(demoCredentials.storefront.email);
                setPassword(demoCredentials.storefront.password);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" className="h-11" onClick={() => handleProviderLogin('google')}>
              <Mail className="h-4 w-4" />
              Continue with Gmail
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => handleProviderLogin('apple')}>
              <Apple className="h-4 w-4" />
              Continue with Apple
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Phone className="h-4 w-4" />
              <p className="font-semibold">Phone number login</p>
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Enter phone number"
                className="sm:flex-1"
              />
              <Button type="button" onClick={handlePhoneLogin} className="sm:min-w-[160px]">
                Login with Phone
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500">
                {mode === 'login' ? 'Or continue with email' : 'Register with email'}
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="storefront-name">Full Name</Label>
                <Input
                  id="storefront-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="storefront-email">Email</Label>
              <Input
                id="storefront-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-password">Password</Label>
              <Input
                id="storefront-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Sign in with Email' : 'Create Account'}
            </Button>
          </form>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Demo credentials</p>
            <p className="mt-2">Email: `{demoCredentials.storefront.email}`</p>
            <p>Password: `{demoCredentials.storefront.password}`</p>
            <p className="mt-2">Gmail, Apple, and phone login are enabled as demo quick sign-ins.</p>
            <p className="mt-2">Registered accounts are stored locally so users can log in later on the same browser.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

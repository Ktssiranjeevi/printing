import { type FormEvent, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { demoCredentials, useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState(demoCredentials.admin.email);
  const [password, setPassword] = useState(demoCredentials.admin.password);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginAdmin(email, password);

    if (!result.success) {
      setError(result.message || 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md border border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Admin login</p>
          <CardTitle className="text-3xl">Control room access</CardTitle>
          <p className="text-sm text-slate-600">
            Sign in to manage products, offers, orders, and storefront data.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300">
              Sign in to admin
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Demo credentials</p>
            <p className="mt-2">Email: `{demoCredentials.admin.email}`</p>
            <p>Password: `{demoCredentials.admin.password}`</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Chrome, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

function Login({ onAuth }: { onAuth: (user: any, token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      let ans: any = {};
      try {
        ans = await response.json();
      } catch {
        ans = {};
      }

      if (!response.ok) {
        throw new Error(ans.error || 'Login failed');
      }

      onAuth(ans.user, ans.token);
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      const savedUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const matchedUser = savedUsers.find((user: any) => user.email === email.trim().toLowerCase() && user.password === password);

      if (matchedUser) {
        onAuth({ id: matchedUser.id, name: matchedUser.name, email: matchedUser.email, image: matchedUser.image }, `local-${Date.now()}`);
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleContinue = () => {
    alert('Google sign-in will be connected soon.');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.22),_transparent_35%),linear-gradient(135deg,_#fff7ed_0%,_#fff_45%,_#fef2f2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 p-8 text-white sm:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Fresh delivery, faster access
            </div>
            <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back to your favorite food experience.
            </h1>
            <p className="mt-3 max-w-md text-sm text-rose-50 sm:text-base">
              Sign in to save favorites, track orders, and enjoy seamless checkout in seconds.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-rose-50">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              • Personalized recommendations tailored to your taste
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              • One-tap reordering for your favorite meals
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">Log in</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Log in to continue</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your email and password to access your account and orders.
              </p>
            </div>

            <form className="space-y-5" onSubmit={loginHandler}>
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-slate-700 shadow-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-12 text-slate-700 shadow-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-red-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in...' : 'Log in'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleContinue}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-red-500 transition-colors hover:text-red-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

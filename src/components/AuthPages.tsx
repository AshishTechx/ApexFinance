import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Mail, Lock, User, Phone, Globe, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthPages({ defaultMode = 'login' }: { defaultMode?: 'login' | 'register' }) {
  const { login: handleLoginState, showToast, setRoute } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [currency, setCurrency] = useState('$');

  // Password rule checks
  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to login');
        }

        handleLoginState(data.token, data.user);
      } else {
        // Register validation
        const passErr = validatePassword(password);
        if (passErr) {
          showToast(passErr, 'error');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone, country, currency })
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        handleLoginState(data.token, data.user);
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <button 
        onClick={() => setRoute('landing')}
        className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center space-x-1.5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      {/* Brand logo header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="flex justify-center mb-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer" onClick={() => setRoute('landing')}>
            <TrendingUp className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
          {mode === 'login' ? 'Sign in to VestraFinance' : 'Create your free account'}
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          {mode === 'login' 
            ? "Track expenses, budget smarter, and save more" 
            : "Get started tracking personal spends in minutes"
          }
        </p>
      </div>

      {/* Main card panel */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/80 border border-slate-900 rounded-2xl shadow-xl px-6 py-8 sm:px-10 backdrop-blur-md">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* REGISTER FIELDS */}
            {mode === 'register' && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Grid for Country and Currency */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Country</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Globe className="h-4 w-4" />
                      </div>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-9 pr-2 py-3 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="United States">US</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Currency</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-9 pr-2 py-3 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="$">USD ($)</option>
                        <option value="₹">INR (₹)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                        <option value="A$">AUD (A$)</option>
                        <option value="C$">CAD (C$)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => showToast('Demo Mode: Click register or use any account details.', 'info')}
                    className="text-[10px] text-emerald-400 font-bold hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              {mode === 'register' && (
                <div className="mt-2 text-[10px] text-slate-500 space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <p className="font-semibold text-slate-400">Password Requirements:</p>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Minimum 8 characters</li>
                    <li>One uppercase & one lowercase letter</li>
                    <li>One number & one special character (!@#$)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
            </button>

          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-950 pt-5">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('register')} 
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Register Free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

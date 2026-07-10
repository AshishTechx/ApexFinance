import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { TrendingDown, User as UserIcon, Mail, Lock, Phone, Globe, DollarSign, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [currency, setCurrency] = useState('$');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const passLength = password.length >= 8;
  const passUpper = /[A-Z]/.test(password);
  const passLower = /[a-z]/.test(password);
  const passNumber = /[0-9]/.test(password);
  const passSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (!passLength || !passUpper || !passLower || !passNumber || !passSpecial) {
      showToast('Please satisfy all password rules before registering.', 'error');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, phone, country, currency);
      showToast('Registration successful! Welcome aboard.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-lg relative z-10 py-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingDown size={18} className="text-slate-950 stroke-[3]" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ApexFinance
            </span>
          </Link>
          <h2 className="text-lg font-bold text-slate-200">Create Your Account</h2>
          <p className="text-slate-400 text-xs mt-1">Start tracking your personal expenses dynamically</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid 1: Name and Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Full Name *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500">
                    <UserIcon size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Email Address *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Grid 2: Phone and Country */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Phone Number (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500">
                    <Phone size={15} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Country</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500">
                    <Globe size={15} />
                  </span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Currency Choice */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Default Currency</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500">
                  <DollarSign size={15} />
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="₱">PHP (₱)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Password with live indicator rules */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-11 text-xs text-slate-100 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password indicator rules layout */}
              <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  {passLength ? <Check size={11} className="text-emerald-400 font-bold" /> : <X size={11} className="text-red-400" />}
                  <span className={passLength ? 'text-slate-300' : ''}>Min 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  {passUpper ? <Check size={11} className="text-emerald-400 font-bold" /> : <X size={11} className="text-red-400" />}
                  <span className={passUpper ? 'text-slate-300' : ''}>One Uppercase (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  {passLower ? <Check size={11} className="text-emerald-400 font-bold" /> : <X size={11} className="text-red-400" />}
                  <span className={passLower ? 'text-slate-300' : ''}>One Lowercase (a-z)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  {passNumber ? <Check size={11} className="text-emerald-400 font-bold" /> : <X size={11} className="text-red-400" />}
                  <span className={passNumber ? 'text-slate-300' : ''}>One Number (0-9)</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-slate-400">
                  {passSpecial ? <Check size={11} className="text-emerald-400 font-bold" /> : <X size={11} className="text-red-400" />}
                  <span className={passSpecial ? 'text-slate-300' : ''}>One Special Symbol (@, #, $, %, etc.)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-center text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Registering...
                </>
              ) : (
                'Create Secure Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

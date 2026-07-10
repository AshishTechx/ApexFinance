import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, Key, Bell, Trash2, Sliders, Globe, DollarSign, CheckCircle, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { 
    user, 
    updateProfile, 
    changePassword, 
    logout, 
    showToast,
    settings 
  } = useApp();

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [currency, setCurrency] = useState(user?.currency || '$');
  const [budgetLimit, setBudgetLimit] = useState(user?.budgetLimit?.toString() || '2000');

  // Individual category budgets state
  const [foodLimit, setFoodLimit] = useState(user?.budgets?.find(b => b.category === 'Food')?.limit.toString() || '400');
  const [travelLimit, setTravelLimit] = useState(user?.budgets?.find(b => b.category === 'Travel')?.limit.toString() || '300');
  const [shoppingLimit, setShoppingLimit] = useState(user?.budgets?.find(b => b.category === 'Shopping')?.limit.toString() || '300');
  const [billsLimit, setBillsLimit] = useState(user?.budgets?.find(b => b.category === 'Bills')?.limit.toString() || '500');
  const [entLimit, setEntLimit] = useState(user?.budgets?.find(b => b.category === 'Entertainment')?.limit.toString() || '200');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Settings state (mock settings)
  const [notifEnabled, setNotifEnabled] = useState(settings.notificationsEnabled);
  const [language, setLanguage] = useState(settings.language);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const targetBudgets = [
      { category: 'Food', limit: Number(foodLimit) || 0 },
      { category: 'Travel', limit: Number(travelLimit) || 0 },
      { category: 'Shopping', limit: Number(shoppingLimit) || 0 },
      { category: 'Bills', limit: Number(billsLimit) || 0 },
      { category: 'Entertainment', limit: Number(entLimit) || 0 }
    ];

    const success = await updateProfile({
      name,
      phone,
      country,
      currency,
      budgetLimit: Number(budgetLimit) || 2000,
      budgets: targetBudgets
    });

    setSavingProfile(false);
  };

  // Password Rules helper
  const validatePasswordRules = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character";
    return null;
  };

  // Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      showToast('Please fill out all password fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    const rulesErr = validatePasswordRules(newPassword);
    if (rulesErr) {
      showToast(rulesErr, 'error');
      return;
    }

    setSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Account Deletion Submit
  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Deleting your account will permanently clear all of your recorded transactions and cannot be undone. Are you sure you want to proceed?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          showToast('Account deleted successfully. We are sorry to see you go.', 'success');
          logout();
        } else {
          const data = await res.json();
          showToast(data.error || 'Failed to delete account', 'error');
        }
      } catch (err) {
        showToast('Connection error. Failed to delete account.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Control Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage personal profile parameters, monthly budgets, and passwords</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PROFILE & BUDGETS (8 COLUMNS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-5 flex items-center space-x-2">
              <User className="h-4.5 w-4.5 text-emerald-400" />
              <span>Personal Profile Parameters</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-2.5 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Preferred Currency Symbol</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
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

              {/* OVERALL LIMIT & PROGRESS LIMITS */}
              <div className="pt-4 border-t border-slate-950/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">Target Allocation Spending Limits</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Used to display progress warning alarms inside dashboard panels</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400 font-semibold font-mono">Total Monthly:</span>
                    <input 
                      type="number"
                      required
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(e.target.value)}
                      className="bg-slate-950 border border-slate-850 text-emerald-400 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 w-24 font-bold"
                    />
                  </div>
                </div>

                {/* Grid for categories targets */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">🍔 Food</label>
                    <input 
                      type="number"
                      value={foodLimit}
                      onChange={(e) => setFoodLimit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-150 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">🚗 Travel</label>
                    <input 
                      type="number"
                      value={travelLimit}
                      onChange={(e) => setTravelLimit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-150 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">🛒 Shopping</label>
                    <input 
                      type="number"
                      value={shoppingLimit}
                      onChange={(e) => setShoppingLimit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-150 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">🧾 Bills</label>
                    <input 
                      type="number"
                      value={billsLimit}
                      onChange={(e) => setBillsLimit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-150 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">🎬 Entertainment</label>
                    <input 
                      type="number"
                      value={entLimit}
                      onChange={(e) => setEntLimit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-150 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
              >
                <span>{savingProfile ? 'Saving Parameters...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* MOCK UI SETTINGS TOGGLES */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Sliders className="h-4.5 w-4.5 text-emerald-400" />
              <span>Application UI Configuration</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Notif */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">System Notification Alerts</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Toggle browser toasts on expense additions, edits, and deletions</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifEnabled(!notifEnabled);
                    showToast('Notification settings synced!', 'success');
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifEnabled ? 'bg-emerald-500' : 'bg-slate-950'}`}
                >
                  <div className={`bg-slate-100 w-4 h-4 rounded-full shadow-md transform transition-transform ${notifEnabled ? 'translate-x-5 bg-slate-950' : ''}`} />
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-950/40">
                <div>
                  <p className="font-bold text-slate-200">Localization Language</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Active translation: {language}</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    showToast('Localization language saved.', 'success');
                  }}
                  className="bg-slate-950 text-slate-300 text-xs border border-slate-850 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="German">Deutsch (German)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CHANGE PASSWORD & DANGER (4 COLUMNS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PASSWORD CARD */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
              <Key className="h-4.5 w-4.5 text-emerald-400" />
              <span>Update Password Credentials</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {/* Current Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">New Password</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                disabled={savingPassword}
                className="w-full inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
              >
                <span>{savingPassword ? 'Updating Vault...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

          {/* DANGER DESTRUCTION ZONE CARD */}
          <div className="bg-red-950/10 border border-red-900/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-red-400 flex items-center space-x-2">
              <Trash2 className="h-4.5 w-4.5 text-red-500" />
              <span>Danger Destruction Zone</span>
            </h3>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              These processes are immediate, absolute, and cannot be reversed. User registries and histories are deleted permanently.
            </p>

            <button 
              onClick={handleDeleteAccount}
              className="w-full bg-red-950/40 hover:bg-red-900 border border-red-900/50 hover:border-red-600 text-red-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              Permanently Terminate Account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

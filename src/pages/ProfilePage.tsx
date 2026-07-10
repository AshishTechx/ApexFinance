import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  User as UserIcon, 
  Lock, 
  Phone, 
  Globe, 
  DollarSign, 
  Loader2, 
  Check, 
  X, 
  RefreshCw,
  Wallet
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [currency, setCurrency] = useState(user?.currency || '$');
  const [budgetLimit, setBudgetLimit] = useState((user as any)?.budgetLimit?.toString() || '2000');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Live password checks
  const passLength = newPassword.length >= 8;
  const passUpper = /[A-Z]/.test(newPassword);
  const passLower = /[a-z]/.test(newPassword);
  const passNumber = /[0-9]/.test(newPassword);
  const passSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast('Name is a required field', 'warning');
      return;
    }

    try {
      setProfileLoading(true);
      await updateProfile({
        name,
        phone,
        country,
        currency,
        budgetLimit: Number(budgetLimit),
        profileImage: profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      });
      showToast('Profile and Budget parameters saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match', 'error');
      return;
    }

    if (!passLength || !passUpper || !passLower || !passNumber || !passSpecial) {
      showToast('New password does not satisfy all validation criteria', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleGenerateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 9);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setProfileImage(url);
    showToast('New secure avatar seed generated!', 'info');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserIcon className="text-emerald-400" size={20} /> Manage User Profile & Budget
        </h2>
        <p className="text-xs text-slate-400 mt-1">Update your ledger settings, profile details, and security passwords</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Avatar Widget & Core Details */}
        <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div className="relative inline-block">
            <img 
              src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt="Profile avatar" 
              className="w-24 h-24 rounded-full bg-slate-800 mx-auto border-2 border-slate-800 object-cover shadow-lg"
            />
            <button
              onClick={handleGenerateNewAvatar}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow shadow-emerald-500/10 cursor-pointer"
              title="Generate New Avatar"
            >
              <RefreshCw size={13} className="stroke-[3]" />
            </button>
          </div>

          <div>
            <h4 className="font-bold text-slate-100">{user?.name}</h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">Currency</span>
              <span className="font-extrabold text-slate-300">{currency}</span>
            </div>
            <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">Budget Cap</span>
              <span className="font-extrabold text-slate-300">{currency}{budgetLimit}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Twin Update Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* Form 1: General Parameters */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h3 className="font-bold text-base text-slate-200 mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
              <UserIcon size={16} className="text-emerald-400" /> General Profile Settings
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500"><Phone size={14} /></span>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-9 pr-4 text-xs text-slate-100 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Country</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500"><Globe size={14} /></span>
                    <input 
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-9 pr-4 text-xs text-slate-100 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Preferred Currency</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500"><DollarSign size={14} /></span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-9 pr-4 text-xs text-slate-100 outline-none transition-colors cursor-pointer"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="₹">INR (₹)</option>
                      <option value="¥">JPY (¥)</option>
                      <option value="₱">PHP (₱)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Set budget parameter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Monthly Spending Budget Cap ({currency})</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500"><Wallet size={14} /></span>
                  <input 
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3.5 pl-9 pr-4 text-xs text-slate-100 outline-none transition-colors font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">A red alert warning banner will trigger upon crossing this cap total.</span>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {profileLoading ? <Loader2 size={13} className="animate-spin" /> : null} Save Details & Budget
              </button>
            </form>
          </div>

          {/* Form 2: Password Security change */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h3 className="font-bold text-base text-slate-200 mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Lock size={16} className="text-emerald-400" /> Update Security Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Live Password Indicator */}
              {newPassword && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px]">
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
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {passwordLoading ? <Loader2 size={13} className="animate-spin" /> : null} Save Security Key
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

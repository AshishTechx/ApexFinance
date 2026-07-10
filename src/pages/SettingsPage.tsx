import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../components/Toast';
import { 
  Settings, 
  Trash2, 
  Bell, 
  Moon, 
  Database, 
  AlertTriangle, 
  Eye, 
  CheckSquare 
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { wipeExpenses } = useExpenses();
  const { showToast } = useToast();

  const [notifDaily, setNotifDaily] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifBudget, setNotifBudget] = useState(true);
  const [denseLayout, setDenseLayout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleWipeData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDelete !== 'WIPE MY TRANSACTIONS') {
      showToast("Please type 'WIPE MY TRANSACTIONS' exactly to confirm deletion", 'warning');
      return;
    }

    try {
      await wipeExpenses();
      showToast('All expense records deleted successfully! Starting fresh.', 'success');
      setConfirmDelete('');
    } catch (err: any) {
      showToast(err.message || 'Failed to wipe data', 'error');
    }
  };

  const handleSaveToggles = () => {
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="text-emerald-400" size={20} /> System Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure layout densities, alerts notifications, and data sanitization</p>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <h3 className="font-bold text-base text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Bell size={16} className="text-emerald-400" /> Notifications & Alerts
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Daily Log Reminder</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Receive reminders at 9:00 PM if no logs entered</p>
            </div>
            <input 
              type="checkbox"
              checked={notifDaily}
              onChange={() => { setNotifDaily(!notifDaily); handleSaveToggles(); }}
              className="w-5 h-5 rounded border-slate-800 text-emerald-500 bg-slate-950 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Weekly Summary Reports</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Weekly digest email with charts and saving analytics</p>
            </div>
            <input 
              type="checkbox"
              checked={notifWeekly}
              onChange={() => { setNotifWeekly(!notifWeekly); handleSaveToggles(); }}
              className="w-5 h-5 rounded border-slate-800 text-emerald-500 bg-slate-950 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Budget Warning Alerts</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Prompt real-time notices when approaching budget limits</p>
            </div>
            <input 
              type="checkbox"
              checked={notifBudget}
              onChange={() => { setNotifBudget(!notifBudget); handleSaveToggles(); }}
              className="w-5 h-5 rounded border-slate-800 text-emerald-500 bg-slate-950 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Interface density options */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <h3 className="font-bold text-base text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Moon size={16} className="text-emerald-400" /> Interface Densities
        </h3>

        <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">Compact Table Layout</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Reduces spacing paddings in expense listings for high density look</p>
          </div>
          <input 
            type="checkbox"
            checked={denseLayout}
            onChange={() => { setDenseLayout(!denseLayout); handleSaveToggles(); }}
            className="w-5 h-5 rounded border-slate-800 text-emerald-500 bg-slate-950 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Danger Sanitization zone */}
      <div className="bg-red-500/5 border border-red-500/20 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <h3 className="font-bold text-base text-red-400 border-b border-red-500/10 pb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" /> Danger Zone (Sanitization)
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          Wiping transactions is completely irreversible. Once you wipe your logs, all tracked daily bills, food spending, travel logs, and categories parameters will be deleted from our cloud.
        </p>

        <form onSubmit={handleWipeData} className="space-y-4 pt-2">
          <div>
            <label className="block text-[10px] font-bold uppercase text-red-400 mb-1.5">Type "WIPE MY TRANSACTIONS" to authorize deletion</label>
            <input 
              type="text"
              required
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="WIPE MY TRANSACTIONS"
              className="w-full bg-slate-950 border border-red-500/20 focus:border-red-500 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow shadow-red-500/10"
          >
            <Trash2 size={13} /> Confirm Irreversible Wipeout
          </button>
        </form>
      </div>
    </div>
  );
}

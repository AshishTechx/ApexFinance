import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  FileSpreadsheet, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  Wallet, 
  AlertOctagon,
  TrendingDown
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const { stats } = useExpenses();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Safe checks for budget limits
  const monthlyLimit = user?.budgetLimit || 2000;
  const currentMonthSpending = stats?.thisMonthExpenses || 0;
  const percentage = Math.min((currentMonthSpending / monthlyLimit) * 100, 100);
  const remaining = Math.max(monthlyLimit - currentMonthSpending, 0);
  const isOverspent = currentMonthSpending > monthlyLimit;
  const isWarning = currentMonthSpending >= monthlyLimit * 0.8 && !isOverspent;

  const getActiveTitle = () => {
    const item = menuItems.find(m => m.path === location.pathname);
    return item ? item.name : 'Personal Expense Tracker';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Banner */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingDown size={18} className="text-slate-950 stroke-[3]" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            ApexFinance
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800/60 p-4 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingDown size={22} className="text-slate-950 stroke-[3]" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ApexFinance
              </h1>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">SaaS Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Budget Progress & User Widget */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          {/* Budget indicator */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase flex items-center gap-1">
                <Wallet size={12} className="text-slate-400" /> Monthly Budget
              </span>
              <span className="text-xs font-bold text-slate-300">
                {user?.currency || '$'}{currentMonthSpending} / {user?.currency || '$'}{monthlyLimit}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverspent ? 'bg-red-500 shadow-md shadow-red-500/20' :
                  isWarning ? 'bg-amber-500 shadow-md shadow-amber-500/20' :
                  'bg-emerald-500 shadow-md shadow-emerald-500/20'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {isOverspent && (
              <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-semibold leading-tight animate-pulse">
                <AlertOctagon size={12} className="shrink-0" />
                Budget Exceeded! Save more!
              </div>
            )}
            {isWarning && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold leading-tight">
                <AlertOctagon size={12} className="shrink-0" />
                接近 80% limit warning!
              </div>
            )}
            {!isOverspent && !isWarning && (
              <div className="text-[10px] text-emerald-400 font-medium">
                Remaining: {user?.currency || '$'}{remaining}
              </div>
            )}
          </div>

          {/* User profile section */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30">
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                alt="Profile" 
                className="w-9 h-9 rounded-full bg-slate-700 object-cover border border-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 h-full p-4 border-r border-slate-800 z-50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <TrendingDown size={18} className="text-slate-950 stroke-[3]" />
                </div>
                <span className="font-bold text-lg text-emerald-400">ApexFinance</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="space-y-1.5 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer Area */}
            <div className="space-y-4 pt-4 border-t border-slate-800/60 mt-auto">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1"><Wallet size={10} /> Budget</span>
                  <span>{user?.currency || '$'}{currentMonthSpending} / {user?.currency || '$'}{monthlyLimit}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isOverspent ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-2">
                  <img 
                    src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full bg-slate-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                    <p className="text-[10px] text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-950">
        {/* Top Header Panel - Title & Action Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-slate-800/40 bg-slate-950/50 backdrop-blur-sm z-30">
          <h2 className="text-xl font-bold text-slate-100">{getActiveTitle()}</h2>
          <div className="flex items-center gap-4">
            {/* Quick Stats banner */}
            <div className="text-xs bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Secure AES Server: Active
            </div>
            <div className="flex items-center gap-2.5">
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full bg-slate-700 border border-slate-800 object-cover"
              />
              <span className="text-sm font-semibold text-slate-300">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Workspace scrollable page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

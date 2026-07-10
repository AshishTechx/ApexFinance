import React, { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  FileText, 
  Clock, 
  Plus, 
  Eye,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as ReChartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  AreaChart, 
  Area, 
  CartesianGrid,
  Legend
} from 'recharts';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const { stats, loading, fetchDashboardStats, addExpense } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('Food');
  const [quickPayment, setQuickPayment] = useState('Cash');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !quickAmount) {
      showToast('Please fill in title and amount', 'warning');
      return;
    }

    try {
      await addExpense({
        title: quickTitle,
        amount: Number(quickAmount),
        category: quickCategory,
        paymentMethod: quickPayment,
        date: new Date().toISOString().split('T')[0],
        description: 'Quick add transaction',
        notes: ''
      });
      showToast('Expense added successfully via Quick Log!', 'success');
      setQuickTitle('');
      setQuickAmount('');
      setQuickAddOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to add expense', 'error');
    }
  };

  const currencySymbol = user?.currency || '$';
  
  // Safe stats values
  const totalExpenses = stats?.totalExpenses || 0;
  const todayExpenses = stats?.todayExpenses || 0;
  const thisMonthExpenses = stats?.thisMonthExpenses || 0;
  const thisYearExpenses = stats?.thisYearExpenses || 0;
  const averageDaily = stats?.averageDailySpending || 0;
  const averageMonthly = stats?.averageMonthlySpending || 0;
  const transactionsCount = stats?.totalTransactions || 0;
  const highest = stats?.highestExpense;
  const lowest = stats?.lowestExpense;

  const budgetLimit = user?.budgetLimit || 2000;
  const budgetPercentage = Math.min((thisMonthExpenses / budgetLimit) * 100, 100);
  const isOverBudget = thisMonthExpenses > budgetLimit;

  // Pie chart data fallback
  const pieData = stats?.categorySpending && stats.categorySpending.length > 0 
    ? stats.categorySpending 
    : [
        { name: 'No Data Yet', value: 100, color: '#334155' }
      ];

  // Bar chart data fallback
  const barData = stats?.weeklySpending || [];

  // Area chart data fallback
  const areaData = stats?.monthlySpending || [];

  return (
    <div className="space-y-8 text-left">
      {/* Alert banner for budget */}
      {isOverBudget && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3.5 text-red-400">
          <AlertTriangle className="shrink-0" size={20} />
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold">Overspending Warning!</span> Your this month total expenses of <span className="font-bold">{currencySymbol}{thisMonthExpenses}</span> has crossed your monthly set budget of <span className="font-bold">{currencySymbol}{budgetLimit}</span>. Try to restrict unneeded shopping.
          </div>
        </div>
      )}

      {/* Quick Stats Header Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">All-time Expenses</span>
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">Total</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-100">{currencySymbol}{totalExpenses.toFixed(2)}</h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
            <Activity size={10} /> Active tracking logs
          </p>
        </div>

        {/* Stat 2: Today */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Today's Purchases</span>
              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">Daily</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-100">{currencySymbol}{todayExpenses.toFixed(2)}</h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Avg Monthly Daily Spent: {currencySymbol}{averageDaily.toFixed(2)}
          </p>
        </div>

        {/* Stat 3: This Month */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">This Month Spending</span>
              <span className="p-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold">Monthly</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-100">{currencySymbol}{thisMonthExpenses.toFixed(2)}</h3>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 block mt-1.5">
              Budget target cap: {budgetPercentage.toFixed(0)}% reached
            </span>
          </div>
        </div>

        {/* Stat 4: Total Transactions */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Total Records logged</span>
              <span className="p-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold">Count</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-100">{transactionsCount} <span className="text-xs text-slate-400 font-medium">Txns</span></h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Average monthly: {currencySymbol}{averageMonthly.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Highest & Lowest Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highest && (
          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                <ArrowUpRight size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Highest purchase</span>
                <p className="text-sm font-black text-slate-200">{highest.title}</p>
                <span className="text-[10px] text-slate-400 font-medium">{highest.date}</span>
              </div>
            </div>
            <span className="text-lg font-black text-red-400">+{currencySymbol}{Number(highest.amount).toFixed(2)}</span>
          </div>
        )}

        {lowest && (
          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ArrowDownRight size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Lowest purchase</span>
                <p className="text-sm font-black text-slate-200">{lowest.title}</p>
                <span className="text-[10px] text-slate-400 font-medium">{lowest.date}</span>
              </div>
            </div>
            <span className="text-lg font-black text-emerald-400">+{currencySymbol}{Number(lowest.amount).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Main Charts area */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Weekly bar chart (Col: 7) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-400" /> Weekly Money Spent Trend
            </h4>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <ReChartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Add an expense to populate weekly chart
              </div>
            )}
          </div>
        </div>

        {/* Category Pie Chart (Col: 5) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
              <Layers size={16} className="text-emerald-400" /> Category-Wise spending
            </h4>
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReChartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Center Label */}
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Spent</span>
                <span className="text-sm font-black text-slate-200">
                  {currencySymbol}{pieData.reduce((acc, curr) => acc + (curr.value || 0), 0).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="grid grid-cols-2 gap-2 mt-4 max-h-24 overflow-y-auto pr-1">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-left">
                <span className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-[11px] text-slate-400 font-medium truncate flex-1">{entry.name}</span>
                <span className="text-[11px] font-bold text-slate-300 shrink-0">
                  {entry.name !== 'No Data Yet' ? `${currencySymbol}${entry.value}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area trend monthly chart */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
          <DollarSign size={16} className="text-emerald-400" /> Month-Wise Spending History
        </h4>
        <div className="h-56">
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <ReChartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Add some history transactions to visualize months comparison
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions list & Quick Log Form */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Transactions List (Col: 7) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" /> Recent Transactions
            </h4>
            <button 
              onClick={() => navigate('/expenses')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((e) => (
                <div 
                  key={e.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-850/60 hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[e.category] || '#6B7280' }} />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-200">{e.title}</p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{e.category}</span>
                        <span>•</span>
                        <span>{e.date}</span>
                        <span>•</span>
                        <span>{e.paymentMethod}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    {currencySymbol}{Number(e.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent transactions. Click Quick log or go to Expenses page to add one!
              </div>
            )}
          </div>
        </div>

        {/* Quick Log Form (Col: 5) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl text-left">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Plus size={16} className="text-emerald-400" /> Quick Log Transaction
            </h4>
            <span className="text-[10px] text-emerald-400/80 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Today</span>
          </div>

          <form onSubmit={handleQuickAdd} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Expense Title</label>
              <input 
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Grocery shopping, Dinner"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Amount ({currencySymbol})</label>
                <input 
                  type="number"
                  step="any"
                  required
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  placeholder="34.50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Investment">Investment</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Method</label>
              <select
                value={quickPayment}
                onChange={(e) => setQuickPayment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-center text-xs transition-all shadow-md shadow-emerald-500/10 cursor-pointer mt-2"
            >
              Add Expense Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981', // Emerald
  Travel: '#3B82F6', // Blue
  Shopping: '#F59E0B', // Amber
  Medical: '#EF4444', // Red
  Education: '#8B5CF6', // Purple
  Salary: '#06B6D4', // Cyan
  Bills: '#EC4899', // Pink
  Entertainment: '#F43F5E', // Rose
  Investment: '#6366F1', // Indigo
  Others: '#6B7280', // Gray
};

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  CreditCard, 
  ArrowUpRight, 
  HelpCircle, 
  Activity, 
  TrendingDown, 
  Award,
  DollarSign
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
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Run fetches in parallel
      const [resCat, resPay, resMo] = await Promise.all([
        fetch(`${window.location.origin}/api/dashboard/category`, { headers }),
        fetch(`${window.location.origin}/api/dashboard/payment`, { headers }),
        fetch(`${window.location.origin}/api/dashboard/monthly`, { headers })
      ]);

      const dataCat = await resCat.json();
      const dataPay = await resPay.json();
      const dataMo = await resMo.json();

      setCategories(Array.isArray(dataCat) ? dataCat : []);
      setPayments(Array.isArray(dataPay) ? dataPay : []);
      setMonthlyHistory(Array.isArray(dataMo) ? dataMo : []);
    } catch (err) {
      console.error('Error loading analytics:', err);
      showToast('Failed to retrieve full analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const currencySymbol = user?.currency || '$';

  // Math helpers
  const totalSpent = categories.reduce((acc, c) => acc + c.total, 0);
  const totalTxns = categories.reduce((acc, c) => acc + c.count, 0);
  const avgTxnSize = totalTxns > 0 ? (totalSpent / totalTxns) : 0;
  
  const topCategory = categories.length > 0 ? categories[0] : null;
  const topPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-emerald-400" size={20} /> Smart Expense Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">Advanced category breakdowns, monthly summaries, and payment method analyses</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm">
          <svg className="animate-spin h-6 w-6 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Compiling financial analytics metrics...
        </div>
      ) : (
        <>
          {/* Top Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Top Category */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Top Category</span>
                <h4 className="text-base font-black text-slate-200">{topCategory ? topCategory.category : 'N/A'}</h4>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-3">
                {topCategory ? `${currencySymbol}${topCategory.total} spent` : 'No data logged'}
              </p>
            </div>

            {/* Card 2: Top Payment Method */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Top Payment Type</span>
                <h4 className="text-base font-black text-slate-200">{topPayment ? topPayment.method : 'N/A'}</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-3">
                {topPayment ? `${topPayment.count} transactions logged` : 'No data logged'}
              </p>
            </div>

            {/* Card 3: Average transaction */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Average Purchase Size</span>
                <h4 className="text-base font-black text-slate-200">{currencySymbol}{avgTxnSize.toFixed(2)}</h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
                <Activity size={10} /> Computed across all inputs
              </p>
            </div>

            {/* Card 4: Savings Potential */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Active Budget Threshold</span>
                <h4 className="text-base font-black text-slate-200">{currencySymbol}{user?.budgetLimit || 2000}</h4>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium mt-3 flex items-center gap-1">
                <Award size={10} /> Standard target ceiling
              </p>
            </div>
          </div>

          {/* Charts Row 1: Pie and Bar */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Category breakdown pie */}
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
                <PieIcon size={16} className="text-emerald-400" /> Category Breakdown List
              </h4>
              <div className="h-60 relative">
                {categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="total"
                        nameKey="category"
                      >
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ReChartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Add transactions to populate category pie
                  </div>
                )}
              </div>

              {/* Progress bars of category percentages */}
              <div className="space-y-3 mt-4 max-h-48 overflow-y-auto pr-1">
                {categories.map((c, index) => {
                  const pct = totalSpent > 0 ? ((c.total / totalSpent) * 100) : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: c.color }} />
                          {c.category}
                        </span>
                        <span className="font-bold">
                          {currencySymbol}{c.total.toFixed(2)} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment method analysis bar */}
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
                  <CreditCard size={16} className="text-emerald-400" /> Payment Methods split
                </h4>
                <div className="h-60">
                  {payments.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={payments} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis dataKey="method" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                        <ReChartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        />
                        <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                          {payments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                      Add transactions to populate payment method split
                    </div>
                  )}
                </div>
              </div>

              {/* Text analysis lists */}
              <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
                {payments.map((p, index) => (
                  <div key={index} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950/30 border border-slate-850">
                    <span className="text-slate-300 font-semibold">{p.method} Transactions</span>
                    <span className="text-slate-200 font-medium">
                      {p.count} purchases totalizing <span className="font-bold text-emerald-400">{currencySymbol}{p.total}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Comparison Detailed Line Chart */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-emerald-400" /> Chronological Monthly Spend Comparison
            </h4>
            <div className="h-64">
              {monthlyHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <ReChartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} name="Total Amount Spent" activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Add multi-month transaction records to populate line comparison trend
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

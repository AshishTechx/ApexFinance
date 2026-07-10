import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingDown, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus, 
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export default function Dashboard({ onAddExpense }: { onAddExpense: () => void }) {
  const { user, stats, settings, setRoute } = useApp();
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  if (!stats) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 border-r-2 border-r-transparent"></div>
        <p className="text-xs text-slate-500 font-medium font-mono">LOADING_ANALYTICS_STATS...</p>
      </div>
    );
  }

  const {
    totalExpenses,
    todayExpenses,
    thisMonthExpenses,
    totalTransactions,
    averageDailySpending,
    averageMonthlySpending,
    highestExpense,
    lowestExpense,
    categorySpending,
    monthlySpending,
    weeklySpending,
    recentTransactions
  } = stats;

  const currencySymbol = settings.currency;

  // Calculate overall budget status
  const monthlyLimit = user?.budgetLimit || 2000;
  const budgetRatio = monthlyLimit > 0 ? (thisMonthExpenses / monthlyLimit) * 100 : 0;
  const isBudgetExceeded = thisMonthExpenses > monthlyLimit;

  // Categories helper icons mapping
  const categoryIcons: { [key: string]: string } = {
    Food: '🍔',
    Travel: '🚗',
    Shopping: '🛒',
    Medical: '🩺',
    Education: '🎓',
    Bills: '🧾',
    Entertainment: '🎬',
    Salary: '💰',
    Others: '🏷️'
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FINANCIAL COMMAND CENTER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your expense tracker is completely compiled and safe. Here is your spending analysis for today.
          </p>
        </div>
        
        <button 
          onClick={onAddExpense}
          className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
          <span>Record Spend</span>
        </button>
      </div>

      {/* STATS WIDGETS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TOTAL SPENT THIS MONTH */}
        <div className="bg-slate-900/60 border border-slate-900 p-4.5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500/10"><TrendingUp className="h-12 w-12" /></div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Spent This Month</div>
          <div className="text-2xl font-bold text-slate-150 mt-1">{currencySymbol}{thisMonthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center">
            <span className="text-emerald-400 font-bold mr-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              Active Tracker
            </span>
            <span>of {currencySymbol}{monthlyLimit} budget</span>
          </div>
        </div>

        {/* SPENT TODAY */}
        <div className="bg-slate-900/60 border border-slate-900 p-4.5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500/10"><Calendar className="h-12 w-12" /></div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Spent Today</div>
          <div className="text-2xl font-bold text-slate-150 mt-1">{currencySymbol}{todayExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center">
            <span className="font-semibold text-slate-400 mr-1">Daily Average:</span>
            <span>{currencySymbol}{averageDailySpending}</span>
          </div>
        </div>

        {/* HIGHEST LOGGED SPEND */}
        <div className="bg-slate-900/60 border border-slate-900 p-4.5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500/10"><ArrowUpRight className="h-12 w-12 text-red-500/10" /></div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Highest Single Expense</div>
          <div className="text-2xl font-bold text-slate-150 mt-1">
            {highestExpense ? `${currencySymbol}${highestExpense.amount.toLocaleString()}` : `${currencySymbol}0.00`}
          </div>
          <div className="mt-2 text-[10px] text-slate-500 truncate">
            {highestExpense ? (
              <span className="font-semibold text-red-400">{highestExpense.title}</span>
            ) : (
              <span>No recorded spendings</span>
            )}
          </div>
        </div>

        {/* TOTAL HISTORICAL LOGS */}
        <div className="bg-slate-900/60 border border-slate-900 p-4.5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500/10"><CreditCard className="h-12 w-12" /></div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Logged Transactions</div>
          <div className="text-2xl font-bold text-slate-150 mt-1">{totalTransactions}</div>
          <div className="mt-2 text-[10px] text-slate-500">
            <span>Historical total: </span>
            <span className="text-emerald-400 font-bold">{currencySymbol}{totalExpenses.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* WARNING NOTIFICATION IF BUDGET EXCEEDED */}
      {isBudgetExceeded && (
        <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl flex items-start space-x-3 text-red-400">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Threshold Breach Alert!</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Your overall spent this month ({currencySymbol}{thisMonthExpenses}) has exceeded your target budget limit ({currencySymbol}{monthlyLimit}). Consider restricting entertainment and luxury expenditures.
            </p>
          </div>
        </div>
      )}

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT CHART CARD: SPENDING TRENDS (8 COLUMNS) */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-900 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Spending Frequency & Trends</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Historical monthly data tracking</p>
            </div>
            
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-900">
              <button 
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${chartType === 'area' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Area Chart
              </button>
              <button 
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${chartType === 'bar' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={monthlySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#10B981', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="amount" name="Spent" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSpent)" />
                </AreaChart>
              ) : (
                <BarChart data={monthlySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#10B981', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" name="Spent" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT CHART CARD: CATEGORY RATIO (4 COLUMNS) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Category Breakdown</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Historical category percentage</p>
          </div>

          <div className="h-48 w-full relative my-4 flex items-center justify-center">
            {categorySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-600 text-xs">No records available</div>
            )}
            {/* Centered Total */}
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Total Spent</span>
              <span className="text-base font-extrabold text-slate-250 mt-0.5">{currencySymbol}{totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Mini Legend List */}
          <div className="space-y-1.5 overflow-y-auto max-h-28 pr-1">
            {(categorySpending || []).slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-400">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-300">{currencySymbol}{cat.value.toLocaleString()}</span>
              </div>
            ))}
            {(categorySpending || []).length > 4 && (
              <div className="text-center text-[10px] text-slate-500 font-mono">
                + {(categorySpending || []).length - 4} other categories
              </div>
            )}
          </div>
        </div>

      </div>

      {/* LOWER CONTAINER GRID: RECENT LOGS + BUDGET PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* RECENT TRANSACTIONS TABLE (7 COLUMNS) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Recent Transactions</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Most recent spend log entries</p>
            </div>
            
            <button 
              onClick={() => setRoute('expenses')}
              className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((exp, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-slate-950/40 border border-slate-900/60 p-3 rounded-xl hover:border-slate-800 transition-colors text-xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="p-1.5 bg-slate-900 border border-slate-850 rounded-xl text-md flex-shrink-0">
                      {categoryIcons[exp.category] || '🏷️'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{exp.title}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{exp.date} • via {exp.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <span className="font-bold text-slate-100 flex-shrink-0">
                    -{currencySymbol}{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-650 text-xs">
                No transactions recorded yet. Click 'Record Spend' above to log your first expense!
              </div>
            )}
          </div>
        </div>

        {/* BUDGET TARGET CARD (5 COLUMNS) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-900 p-5 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200">Budget Progress Tracker</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Category-specific limit allocations</p>
          </div>

          <div className="space-y-4">
            
            {/* Overall Monthly */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Total Monthly Allocation</span>
                <span className="text-slate-200">{currencySymbol}{thisMonthExpenses.toLocaleString()} / {currencySymbol}{monthlyLimit.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isBudgetExceeded ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, budgetRatio)}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
                <span>{budgetRatio.toFixed(0)}% Utilized</span>
                <span>Remaining: {currencySymbol}{Math.max(0, monthlyLimit - thisMonthExpenses).toLocaleString()}</span>
              </div>
            </div>

            {/* Custom Category Budgets */}
            {user?.budgets && user.budgets.length > 0 && (
              <div className="pt-2 border-t border-slate-900 space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Top Category Budgets</p>
                {user.budgets.slice(0, 3).map((catBudget: any, i: number) => {
                  const categoryExpenses = stats.expenses
                    ? stats.expenses.filter(e => e.category === catBudget.category)
                    : [];
                  const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                  const catRatio = catBudget.limit > 0 ? (spent / catBudget.limit) * 100 : 0;
                  const catExceeded = spent > catBudget.limit;

                  return (
                    <div key={i} className="text-[11px]">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-medium">{categoryIcons[catBudget.category] || '🏷️'} {catBudget.category}</span>
                        <span className="text-slate-300 font-semibold">{currencySymbol}{spent.toLocaleString()} / {currencySymbol}{catBudget.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${catExceeded ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(100, catRatio)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

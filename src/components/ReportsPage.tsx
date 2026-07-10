import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Printer, Download, Sparkles, Calendar, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';

export default function ReportsPage() {
  const { expenses, settings, stats } = useApp();
  const [reportRange, setReportRange] = useState<'All' | 'ThisMonth' | 'LastMonth'>('All');

  const currencySymbol = settings.currency;

  const getFilteredExpenses = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (reportRange === 'ThisMonth') {
      const startOfMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      return expenses.filter(e => e.date >= startOfMonthStr);
    } else if (reportRange === 'LastMonth') {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lmYear = lastMonthDate.getFullYear();
      const lmMonth = lastMonthDate.getMonth() + 1;
      const daysInLm = new Date(lmYear, lmMonth, 0).getDate();
      
      const startStr = `${lmYear}-${String(lmMonth).padStart(2, '0')}-01`;
      const endStr = `${lmYear}-${String(lmMonth).padStart(2, '0')}-${String(daysInLm).padStart(2, '0')}`;
      return expenses.filter(e => e.date >= startStr && e.date <= endStr);
    }
    return expenses;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Download CSV Report helper
  const handleDownloadCSV = () => {
    if (filteredExpenses.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['Title', 'Amount', 'Category', 'Payment Method', 'Date', 'Description', 'Notes'];
    const rows = filteredExpenses.map(e => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category}"`,
      `"${e.paymentMethod}"`,
      `"${e.date}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VestraFinance_Report_${reportRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  // Category summary calculations for filter selection
  const categorySummary: { [key: string]: number } = {};
  filteredExpenses.forEach(e => {
    categorySummary[e.category] = (categorySummary[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6 pb-12 print:p-8 print:bg-white print:text-black">
      
      {/* HEADER CONTROLS (Hides during printing!) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Financial Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Export structured spreadsheets or trigger page prints</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/40 p-1 rounded-xl border border-slate-900">
          <button 
            onClick={() => setReportRange('All')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${reportRange === 'All' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All Time
          </button>
          <button 
            onClick={() => setReportRange('ThisMonth')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${reportRange === 'ThisMonth' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            This Month
          </button>
          <button 
            onClick={() => setReportRange('LastMonth')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${reportRange === 'LastMonth' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
        <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl print:bg-white print:text-black print:border-black">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider print:text-gray-500">Total Spent in Range</p>
          <h3 className="text-xl font-extrabold text-slate-100 mt-1 print:text-black">{currencySymbol}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="text-[9px] text-slate-500 mt-1">Based on {filteredExpenses.length} filtered items</p>
        </div>
        
        <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl print:bg-white print:text-black print:border-black">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider print:text-gray-500">Highest Log Spent</p>
          <h3 className="text-xl font-extrabold text-slate-100 mt-1 print:text-black">
            {filteredExpenses.length > 0 
              ? `${currencySymbol}${Math.max(...filteredExpenses.map(e => e.amount)).toLocaleString()}`
              : `${currencySymbol}0.00`
            }
          </h3>
          <p className="text-[9px] text-slate-500 mt-1">Single maximum spend item</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl print:bg-white print:text-black print:border-black">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider print:text-gray-500">Report Interval</p>
          <h3 className="text-xl font-extrabold text-emerald-400 mt-1 print:text-black uppercase">
            {reportRange === 'All' ? 'All History' : reportRange === 'ThisMonth' ? 'This Month' : 'Last Month'}
          </h3>
          <p className="text-[9px] text-slate-500 mt-1">Active compiler selection</p>
        </div>
      </div>

      {/* ACTION BLOCK CONTAINER (Hides during printing!) */}
      <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-200 inline-flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Compiled Statements Available</span>
          </h3>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">
            Click 'Print Report' to launch the browser printer dialog with optimized formatting, or download clean spreadsheets.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button 
            onClick={handleDownloadCSV}
            className="w-1/2 sm:w-auto inline-flex items-center justify-center bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span>Download CSV</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="w-1/2 sm:w-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* PRINT-OPTIMIZED MAIN REPORT CARD */}
      <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-6 print:border-none print:bg-white print:text-black">
        
        {/* Print Logo/Header (Only shows during print, hidden on screen normally via tailwind or css print styles) */}
        <div className="hidden print:flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-black">VestraFinance Spending Statement</h1>
            <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">VESTRA_FINANCE_SECURE</span>
          </div>
        </div>

        {/* Categories breakdown table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 print:text-black">Category Breakdown Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
            {Object.keys(categorySummary).length > 0 ? (
              Object.keys(categorySummary).map(cat => (
                <div key={cat} className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 print:bg-gray-50 print:border-gray-200">
                  <div className="text-[10px] text-slate-500 font-semibold print:text-gray-500">{cat}</div>
                  <div className="text-sm font-extrabold text-slate-150 mt-1 print:text-black">{currencySymbol}{categorySummary[cat].toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-[9px] text-slate-500 mt-1">
                    {((categorySummary[cat] / totalAmount) * 100).toFixed(0)}% of range spent
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 col-span-full">No active spent records found.</p>
            )}
          </div>
        </div>

        {/* Log list table */}
        <div className="space-y-3 pt-4 border-t border-slate-900/60 print:border-gray-200">
          <h3 className="text-sm font-bold text-slate-200 print:text-black">Detailed Spend Ledger</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase print:border-gray-300 print:text-gray-600">
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Payment Channel</th>
                  <th className="py-2.5 px-4">Date Logged</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40 print:divide-gray-100">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp, idx) => (
                    <tr key={exp.id || idx} className="print:break-inside-avoid">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-250 print:text-black">{exp.title}</p>
                        {exp.description && <p className="text-[10px] text-slate-500 print:text-gray-400 mt-0.5">{exp.description}</p>}
                      </td>
                      <td className="py-3 px-4 text-slate-400 print:text-gray-700">{exp.category}</td>
                      <td className="py-3 px-4 text-slate-400 print:text-gray-700">{exp.paymentMethod}</td>
                      <td className="py-3 px-4 text-slate-400 print:text-gray-700">{exp.date}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-150 print:text-black">
                        -{currencySymbol}{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-550 print:text-gray-400">
                      No expense data recorded in selected range.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-800 font-bold text-slate-150 print:border-gray-300 print:text-black">
                  <td colSpan={3} className="py-4 px-4 text-sm uppercase">Total Calculated Spends</td>
                  <td colSpan={2} className="py-4 px-4 text-right text-base text-emerald-400 print:text-black">
                    -{currencySymbol}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

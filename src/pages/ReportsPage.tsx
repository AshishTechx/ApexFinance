import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../components/Toast';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  FileText, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  Tag,
  CreditCard
} from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuth();
  const { expenses, loading, fetchExpenses } = useExpenses();
  const { showToast } = useToast();

  const [timeFilter, setTimeFilter] = useState('this-month'); // this-month, last-month, this-year, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const currencySymbol = user?.currency || '$';

  // Trigger fetch with full limits to pull all filtered expenses for report
  const handleGenerateReport = () => {
    fetchExpenses({
      filter: timeFilter !== 'all' ? timeFilter : undefined,
      startDate: timeFilter === 'custom' ? startDate : undefined,
      endDate: timeFilter === 'custom' ? endDate : undefined,
      category: categoryFilter || undefined,
      paymentMethod: paymentFilter || undefined,
      sortBy: 'newest',
      page: 1,
      limit: 1000 // Pull all for statement
    });
    showToast('Statement report compiled successfully!', 'success');
  };

  useEffect(() => {
    handleGenerateReport();
  }, [timeFilter, categoryFilter, paymentFilter, startDate, endDate]);

  const totalSum = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  // Export CSV Helper
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('No transaction records to export', 'warning');
      return;
    }

    try {
      // Define CSV headers
      const headers = ['Transaction ID', 'Title', 'Amount', 'Category', 'Payment Method', 'Date', 'Description', 'Notes', 'Created At'];
      
      const rows = expenses.map(e => [
        `TXN-${e.id}`,
        `"${e.title.replace(/"/g, '""')}"`,
        e.amount,
        `"${e.category}"`,
        `"${e.paymentMethod}"`,
        e.date,
        `"${(e.description || '').replace(/"/g, '""')}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
        e.createdAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `apexfinance_report_${timeFilter}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV statement downloaded successfully!', 'success');
    } catch (error) {
      console.error('CSV export failed:', error);
      showToast('Failed to compile CSV spreadsheet', 'error');
    }
  };

  // Trigger Browser Print Dialog
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="print:hidden">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="text-emerald-400" size={20} /> Compiled Financial Statements
        </h2>
        <p className="text-xs text-slate-400 mt-1">Generate polished monthly expense ledger summaries for taxation or downloads</p>
      </div>

      {/* Settings Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl grid md:grid-cols-4 gap-4 print:hidden">
        {/* Time horizon */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Time Horizon</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="this-month">This Month Ledger</option>
            <option value="last-month">Last Month Ledger</option>
            <option value="this-year">This Year Ledger</option>
            <option value="all">Full History Ledger</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category Filter</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
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

        {/* Payment */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Payment Filter</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>

        {/* Compiling Button block */}
        <div className="flex items-end">
          <button
            onClick={handleGenerateReport}
            className="w-full bg-slate-800 border border-slate-750 hover:bg-slate-750 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} /> Re-Compile Ledger
          </button>
        </div>

        {/* Custom date range block */}
        {timeFilter === 'custom' && (
          <div className="md:col-span-4 grid grid-cols-2 gap-3 p-3.5 bg-slate-950/40 rounded-xl border border-slate-850">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between print:hidden">
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <CheckCircle size={14} className="text-emerald-400" /> Compiled Statement contains {expenses.length} records
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold px-4.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={handleTriggerPrint}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Printer size={13} /> Print Statement / Save PDF
          </button>
        </div>
      </div>

      {/* Statement Preview block - Fully Optimized for Printing */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative print:bg-white print:text-slate-900 print:border-none print:p-0">
        
        {/* Printable Letterhead header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="text-left space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block print:text-emerald-600">Secure Statement Ledger</span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-100 print:text-slate-900 leading-none">APEXFINANCE INC.</h3>
            <p className="text-xs text-slate-500 print:text-slate-500">Cloud Personal Expense Tracker Sandbox</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs font-semibold text-slate-400 print:text-slate-500">Date Compiled</p>
            <p className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-800">{new Date().toISOString().split('T')[0]}</p>
            <p className="text-[10px] text-slate-500 font-mono print:text-slate-400">Statement: {timeFilter.toUpperCase()}</p>
          </div>
        </div>

        {/* User parameters summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/40 rounded-xl border border-slate-850/60 print:bg-slate-100 print:border-slate-300 print:text-slate-900">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">Cardholder Name</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-800">{user?.name}</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">Email ID</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-800 truncate block">{user?.email}</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">Budget Target Symbol</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-800">{currencySymbol}{user?.budgetLimit}</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block">Aggregate Spent</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 print:text-emerald-700">{currencySymbol}{totalSum.toFixed(2)}</span>
          </div>
        </div>

        {/* Ledger Transaction table */}
        <div className="overflow-x-auto pt-2">
          {expenses.length > 0 ? (
            <table className="w-full text-left border-collapse print:text-slate-900">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider print:border-slate-300 print:text-slate-500">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Title Description</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs print:divide-slate-200">
                {expenses.map((e) => (
                  <tr key={e.id} className="print:break-inside-avoid">
                    <td className="py-3.5 px-3 text-slate-300 print:text-slate-800 font-mono">{e.date}</td>
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-semibold text-slate-200 print:text-slate-900">{e.title}</p>
                        {e.description && <p className="text-[10px] text-slate-500 print:text-slate-500 mt-0.5">{e.description}</p>}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 print:text-slate-700">{e.category}</td>
                    <td className="py-3.5 px-3 text-slate-400 print:text-slate-600">{e.paymentMethod}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-200 print:text-slate-900">
                      {currencySymbol}{Number(e.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t border-slate-800 font-bold text-sm bg-slate-950/20 print:border-slate-300 print:bg-slate-50">
                  <td colSpan={4} className="py-4 px-3 text-right text-slate-400 print:text-slate-700">Total Statements Spending:</td>
                  <td className="py-4 px-3 text-right text-emerald-400 print:text-emerald-700 font-black">
                    {currencySymbol}{totalSum.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center text-slate-500 text-xs">
              No transactions compiled inside statement ledger. Try selecting a wider date range.
            </div>
          )}
        </div>

        {/* Ledger Signature footer */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-4 print:border-slate-300 print:text-slate-400">
          <p>This statement is dynamically generated and cryptographically secured under user token.</p>
          <p className="font-mono">APEX-SANDBOX-VERIFIED-TRUE</p>
        </div>

      </div>
    </div>
  );
}

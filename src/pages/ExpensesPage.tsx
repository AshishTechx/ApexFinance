import React, { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Receipt, 
  ListFilter,
  DollarSign,
  Tag,
  CreditCard,
  Notebook,
  ExternalLink
} from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, pagination, loading, fetchExpenses, addExpense, editExpense, deleteExpense } = useExpenses();
  const { user } = useAuth();
  const { showToast } = useToast();

  const currencySymbol = user?.currency || '$';

  // State filters
  const [searchVal, setSearchVal] = useState('');
  const [filterVal, setFilterVal] = useState('all'); // all, today, yesterday, this-week, last-week, this-month, last-month, this-year, custom
  const [categoryVal, setCategoryVal] = useState('');
  const [paymentVal, setPaymentVal] = useState('');
  const [sortVal, setSortVal] = useState('newest'); // newest, oldest, highest, lowest, a-z, z-a
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Food');
  const [formPayment, setFormPayment] = useState('Cash');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formReceipt, setFormReceipt] = useState('');

  // Fetch helper
  const triggerFetch = (page = currentPage) => {
    fetchExpenses({
      search: searchVal,
      filter: filterVal !== 'all' ? filterVal : undefined,
      startDate: filterVal === 'custom' ? startDate : undefined,
      endDate: filterVal === 'custom' ? endDate : undefined,
      category: categoryVal || undefined,
      paymentMethod: paymentVal || undefined,
      sortBy: sortVal,
      page,
      limit: 10
    });
  };

  useEffect(() => {
    triggerFetch(currentPage);
  }, [filterVal, categoryVal, paymentVal, sortVal, startDate, endDate, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    triggerFetch(1);
  };

  const handleClearFilters = () => {
    setSearchVal('');
    setFilterVal('all');
    setCategoryVal('');
    setPaymentVal('');
    setSortVal('newest');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    showToast('Filters cleared successfully', 'info');
  };

  // CRUD Operations
  const handleOpenAdd = () => {
    setFormTitle('');
    setFormAmount('');
    setFormCategory('Food');
    setFormPayment('Cash');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormNotes('');
    setFormReceipt('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount || !formDate) {
      showToast('Title, Amount, and Date are required', 'warning');
      return;
    }

    try {
      await addExpense({
        title: formTitle,
        amount: Number(formAmount),
        category: formCategory,
        paymentMethod: formPayment,
        date: formDate,
        description: formDescription,
        notes: formNotes,
        receiptImage: formReceipt
      });
      showToast('Expense added successfully!', 'success');
      setIsAddOpen(false);
      setCurrentPage(1);
    } catch (err: any) {
      showToast(err.message || 'Failed to add expense', 'error');
    }
  };

  const handleOpenEdit = (expense: any) => {
    setSelectedExpense(expense);
    setFormTitle(expense.title);
    setFormAmount(expense.amount.toString());
    setFormCategory(expense.category);
    setFormPayment(expense.paymentMethod);
    setFormDate(expense.date);
    setFormDescription(expense.description || '');
    setFormNotes(expense.notes || '');
    setFormReceipt(expense.receiptImage || '');
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpense) return;

    try {
      await editExpense(selectedExpense.id, {
        title: formTitle,
        amount: Number(formAmount),
        category: formCategory,
        paymentMethod: formPayment,
        date: formDate,
        description: formDescription,
        notes: formNotes,
        receiptImage: formReceipt
      });
      showToast('Expense updated successfully!', 'success');
      setIsEditOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update expense', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteExpense(id);
        showToast('Expense deleted successfully!', 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to delete expense', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Upper Panel: Title + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Receipt className="text-emerald-400" size={20} /> Expense Transactions History
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage and filter your transaction books dynamically</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/15 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Log New Expense
        </button>
      </div>

      {/* Filter / Search panel */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3.5 text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by title, description, category, payment method..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Find
          </button>
        </form>

        {/* Quick select filters row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Date range selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Time Horizon</label>
            <select
              value={filterVal}
              onChange={(e) => {
                setFilterVal(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer appearance-none"
            >
              <option value="all">All-Time History</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
            <select
              value={categoryVal}
              onChange={(e) => {
                setCategoryVal(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Payment Method */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Payment Type</label>
            <select
              value={paymentVal}
              onChange={(e) => {
                setPaymentVal(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="">All Payment Types</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Sort Order</label>
            <select
              value={sortVal}
              onChange={(e) => {
                setSortVal(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
              <option value="a-z">A - Z (Title)</option>
              <option value="z-a">Z - A (Title)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end col-span-2 md:col-span-1">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full bg-slate-800 border border-slate-750 hover:bg-slate-750 text-slate-400 hover:text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Custom date range fields (only if filterVal === 'custom') */}
        {filterVal === 'custom' && (
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/40 rounded-xl border border-slate-850">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main transactions List Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm">
              <svg className="animate-spin h-6 w-6 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Retrieving transactional logs...
            </div>
          ) : expenses.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Expense Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs sm:text-sm">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-slate-200">{e.title}</p>
                        {e.description && <p className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">{e.description}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[e.category] || '#6B7280' }} />
                        {e.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-medium">{e.date}</td>
                    <td className="py-4 px-4 text-slate-400">{e.paymentMethod}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-200">
                      {currencySymbol}{Number(e.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(e)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id, e.title)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-850/60 flex items-center justify-center mx-auto text-slate-500">
                <Receipt size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-300">No transactions match</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try clearing selected filters or log your very first purchase using the Log button.</p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                Log First Expense
              </button>
            </div>
          )}
        </div>

        {/* Pagination controls footer */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
            <span className="text-slate-400 font-medium">
              Showing page <span className="text-slate-200 font-bold">{pagination.page}</span> of <span className="text-slate-200 font-bold">{pagination.pages}</span> (Total <span className="text-emerald-400 font-bold">{pagination.total}</span> records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ADD EXPENSE MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative z-50 text-left shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Plus size={18} className="text-emerald-400" /> Log Expense Transaction
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Grocery store visit, Dinner"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Amount ({currencySymbol}) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="45.50"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors cursor-pointer"
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
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Payment Method *</label>
                  <select
                    value={formPayment}
                    onChange={(e) => setFormPayment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Additional details or description"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Notes / Reminders</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Need to reimburse, split bill, etc."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-center text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer mt-2"
              >
                Log Transaction Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT EXPENSE MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative z-50 text-left shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Edit size={18} className="text-emerald-400" /> Update Expense Details
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Amount ({currencySymbol}) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors cursor-pointer"
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
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Payment Method *</label>
                  <select
                    value={formPayment}
                    onChange={(e) => setFormPayment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Notes / Reminders</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-center text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer mt-2"
              >
                Save Updates Securely
              </button>
            </form>
          </div>
        </div>
      )}
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

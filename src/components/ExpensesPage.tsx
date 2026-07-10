import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function ExpensesPage({ 
  showAddModalDirectly = false, 
  onCloseAddModal = () => {} 
}: { 
  showAddModalDirectly?: boolean;
  onCloseAddModal?: () => void;
}) {
  const { 
    expenses, 
    fetchExpenses, 
    addExpense, 
    editExpense, 
    deleteExpense, 
    settings,
    showToast
  } = useApp();

  const currencySymbol = settings.currency;

  // Search, Filters & Sorting state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('Newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(showAddModalDirectly);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Food');
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

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

  const categoriesList = ['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Bills', 'Entertainment', 'Salary', 'Others'];
  const paymentMethodsList = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

  // Trigger fetch when search or filters change
  const triggerFetch = () => {
    fetchExpenses({
      search: search || undefined,
      category: category !== 'All' ? category : undefined,
      paymentMethod: paymentMethod !== 'All' ? paymentMethod : undefined,
      dateRange: dateRange !== 'All' ? dateRange : undefined,
      startDate: dateRange === 'Custom' && startDate ? startDate : undefined,
      endDate: dateRange === 'Custom' && endDate ? endDate : undefined,
      sort
    });
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    triggerFetch();
  }, [search, category, paymentMethod, dateRange, startDate, endDate, sort]);

  useEffect(() => {
    if (showAddModalDirectly) {
      openAddModal();
    }
  }, [showAddModalDirectly]);

  // Modal open helpers
  const openAddModal = () => {
    setEditingExpense(null);
    setTitle('');
    setAmount('');
    setFormCategory('Food');
    setFormPaymentMethod('Cash');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setAmount(exp.amount.toString());
    setFormCategory(exp.category);
    setFormPaymentMethod(exp.paymentMethod);
    setDate(exp.date);
    setDescription(exp.description);
    setNotes(exp.notes);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    onCloseAddModal();
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || Number(amount) <= 0) {
      showToast('Please enter a valid title and positive amount', 'error');
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      category: formCategory,
      paymentMethod: formPaymentMethod,
      date,
      description,
      notes
    };

    let success = false;
    if (editingExpense) {
      success = await editExpense(editingExpense.id, payload);
    } else {
      success = await addExpense(payload);
    }

    if (success) {
      closeModal();
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      await deleteExpense(id);
    }
  };

  // Calculate paginated index ranges
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedExpenses = expenses.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Transaction Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, filter, sort, and inspect spent logs</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
          <span>Record Spend</span>
        </button>
      </div>

      {/* FILTER PANEL CARD */}
      <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl space-y-4">
        
        {/* Row 1: Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, tag, description..."
              className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Date Range Selection */}
          <div className="md:col-span-4 select-container">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="All">All Time Date Range</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
              <option value="Custom">Custom Date Range</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="md:col-span-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Highest">Highest Amount</option>
              <option value="Lowest">Lowest Amount</option>
              <option value="A-Z">A to Z Alphabetical</option>
              <option value="Z-A">Z to A Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Custom Date Picker Inputs */}
        {dateRange === 'Custom' && (
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 animate-fadeIn">
            <div className="w-full sm:w-auto flex items-center space-x-2 text-xs text-slate-400">
              <span>From:</span>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-slate-250 cursor-pointer"
              />
            </div>
            <div className="w-full sm:w-auto flex items-center space-x-2 text-xs text-slate-400">
              <span>To:</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-slate-250 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Row 2: Category and Payment Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900/60">
          {/* Category */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs border border-slate-850 focus:border-emerald-500 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer w-full"
            >
              <option value="All">All Categories</option>
              {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Payment:</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs border border-slate-850 focus:border-emerald-500 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer w-full"
            >
              <option value="All">All Payment Channels</option>
              {paymentMethodsList.map(pm => <option key={pm} value={pm}>{pm}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* REGISTRY LOG LIST TABLE CARD */}
      <div className="bg-slate-900/60 border border-slate-900 rounded-2xl overflow-hidden">
        
        {/* Responsive Table for Desktop, Grid for Mobile */}
        {paginatedExpenses.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/20 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Expense Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Payment Channel</th>
                    <th className="py-4 px-6">Date Logged</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {paginatedExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-900/25 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-200">{exp.title}</p>
                          {exp.description && <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">{exp.description}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-950/60 border border-slate-850 rounded-lg text-slate-300">
                          <span className="mr-1.5">{categoryIcons[exp.category] || '🏷️'}</span>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {exp.date}
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-slate-100">
                        -{currencySymbol}{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => openEditModal(exp)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-950 rounded-lg transition-all"
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-950 rounded-lg transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card Grid */}
            <div className="block md:hidden divide-y divide-slate-900/60">
              {paginatedExpenses.map((exp) => (
                <div key={exp.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{exp.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{exp.date} • via {exp.paymentMethod}</p>
                    </div>
                    <span className="font-extrabold text-slate-100 text-sm">
                      -{currencySymbol}{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-900">
                      {exp.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-slate-400 text-[10px]">
                      <span className="mr-1">{categoryIcons[exp.category] || '🏷️'}</span>
                      {exp.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION PANEL FOOTER */}
            <div className="bg-slate-950/30 border-t border-slate-900/80 px-6 py-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                SHOWING {startIndex + 1} - {endIndex} OF {totalItems} LOGS
              </span>
              
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-slate-900 rounded-lg disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-slate-300 font-bold bg-slate-900 px-3 py-1.5 border border-slate-850 rounded-lg">{currentPage} / {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-slate-900 rounded-lg disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-4 space-y-3">
            <div className="mx-auto bg-slate-950 text-slate-500 p-3 rounded-full w-fit border border-slate-850">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Transaction Records Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              No expenses match the current filter query criteria. Expand your dates or record a new spend!
            </p>
          </div>
        )}

      </div>

      {/* CRUD ADD/EDIT EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850/80">
              <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
                {editingExpense ? 'Edit Spend Entry' : 'Record New Expense'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-1.5 hover:bg-slate-950 text-slate-500 hover:text-slate-300 rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Transaction Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Groceries run, Uber commute"
                  className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-2.5 focus:outline-none placeholder:text-slate-650"
                />
              </div>

              {/* Amount & Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Amount ({currencySymbol})</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-2.5 focus:outline-none placeholder:text-slate-650"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Date Logged</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Category & Payment Method Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                  >
                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Payment Channel */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Payment Method</label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                  >
                    {paymentMethodsList.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Description (Optional)</label>
                <textarea 
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context on this spend..."
                  className="w-full bg-slate-950 text-slate-150 text-xs border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-2.5 focus:outline-none placeholder:text-slate-650 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 font-semibold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  {editingExpense ? 'Save Changes' : 'Record Spend'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

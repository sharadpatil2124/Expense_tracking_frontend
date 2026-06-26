import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import AddTransactionModal from '../components/forms/AddTransactionModal';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw,
  Calendar,
  Sparkles
} from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Bills', 'Travel', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'];

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    pagination, 
    filters, 
    fetchTransactions, 
    updateFilters,
    deleteTransaction
  } = useContext(TransactionContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Local state for immediate input values to avoid typing lag
  const [searchInput, setSearchInput] = useState(filters.search);
  const [startDateInput, setStartDateInput] = useState(filters.startDate);
  const [endDateInput, setEndDateInput] = useState(filters.endDate);

  // Sync inputs with filters context (useful when resetting filters)
  useEffect(() => {
    setSearchInput(filters.search);
    setStartDateInput(filters.startDate);
    setEndDateInput(filters.endDate);
  }, [filters.search, filters.startDate, filters.endDate]);

  // Trigger api fetch when filters change
  useEffect(() => {
    fetchTransactions();
  }, [filters, fetchTransactions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleDateChange = () => {
    updateFilters({ 
      startDate: startDateInput, 
      endDate: endDateInput 
    });
  };

  const handleResetFilters = () => {
    updateFilters({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      sort: 'newest',
      page: 1,
      limit: 10
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction permanently?')) {
      await deleteTransaction(id);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Salary':
      case 'Bonus':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Freelance':
      case 'Investment':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400';
      case 'Food':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400';
      case 'Shopping':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400';
      case 'Bills':
      case 'Rent':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Travel':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400';
      case 'Entertainment':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400';
      case 'Health':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400';
      case 'Education':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400';
    }
  };

  const formatAmount = (tx) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(tx.amount);
    return tx.type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  // Determine which categories list to render in filter option
  const filterCategories = 
    filters.type === 'income' 
      ? INCOME_CATEGORIES 
      : filters.type === 'expense' 
        ? EXPENSE_CATEGORIES 
        : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            Search, filter, edit, or delete transactions history logs
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTx(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 rounded-xl shadow-md transition-all cursor-pointer"
          id="transactions-add-btn"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Filter panel */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-violet-500" />
          Filters & Controls
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Search by text */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-3.5 pr-10 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
            />
            <button 
              type="submit" 
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value, category: '' })}
            className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
          >
            <option value="">All Categories</option>
            {filterCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort selection */}
          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amountDesc">Highest Amount</option>
            <option value="amountAsc">Lowest Amount</option>
          </select>
        </div>

        {/* Date Filters + Reset */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date range:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                onBlur={handleDateChange}
                className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                onBlur={handleDateChange}
                className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 text-xs font-bold transition-all self-end md:self-auto cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold">Updating transaction logs...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 dark:text-slate-600">
            <Sparkles className="w-10 h-10 opacity-30 mb-3" />
            <p className="text-sm font-bold">No transactions match your search</p>
            <p className="text-xs mt-0.5">Try widening filters or add a new record to begin</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50">
                    <th className="pb-3.5 font-semibold">Title</th>
                    <th className="pb-3.5 font-semibold">Category</th>
                    <th className="pb-3.5 font-semibold">Date</th>
                    <th className="pb-3.5 font-semibold">Notes</th>
                    <th className="pb-3.5 font-semibold text-right">Amount</th>
                    <th className="pb-3.5 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {transactions.map((tx) => (
                    <tr 
                      key={tx._id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors"
                    >
                      {/* Title & Icon */}
                      <td className="py-4 pr-2">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8.5 h-8.5 rounded-lg shrink-0 ${
                            tx.type === 'income' 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                          }`}>
                            {tx.type === 'income' ? (
                              <ArrowUpRight className="w-4.5 h-4.5" />
                            ) : (
                              <ArrowDownRight className="w-4.5 h-4.5" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                            {tx.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 pr-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getCategoryColor(tx.category)}`}>
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pr-2">
                        {new Date(tx.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Notes snippet */}
                      <td className="py-4 text-xs text-slate-400 dark:text-slate-500 max-w-[120px] truncate pr-2">
                        {tx.notes || '-'}
                      </td>

                      {/* Amount */}
                      <td className={`py-4 text-right font-extrabold text-xs pr-4 ${
                        tx.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {formatAmount(tx)}
                      </td>

                      {/* CRUD buttons */}
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingTx(tx);
                              setModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Panel */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Showing Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} entries)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateFilters({ page: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateFilters({ page: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transaction Modal dialog */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTx(null);
        }}
        editingTransaction={editingTx}
      />

    </div>
  );
};

export default Transactions;

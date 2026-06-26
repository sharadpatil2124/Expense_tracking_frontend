import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransactionContext } from '../../context/TransactionContext';
import { X, Calendar, IndianRupee, Tag, FileText, CheckCircle } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Bills', 'Travel', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'];

const AddTransactionModal = ({ isOpen, onClose, editingTransaction = null }) => {
  const { addTransaction, editTransaction } = useContext(TransactionContext);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load values when editing is passed in
  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title || '');
      setType(editingTransaction.type || 'expense');
      setCategory(editingTransaction.category || '');
      setAmount(editingTransaction.amount?.toString() || '');
      setDate(editingTransaction.date ? new Date(editingTransaction.date).toISOString().substring(0, 10) : '');
      setNotes(editingTransaction.notes || '');
    } else {
      // Reset form
      setTitle('');
      setType('expense');
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().substring(0, 10));
      setNotes('');
    }
    setError('');
  }, [editingTransaction, isOpen]);

  // Adjust default category when type flips
  useEffect(() => {
    if (!editingTransaction) {
      setCategory('');
    }
  }, [type, editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (!title.trim()) return setError('Please enter a title');
    if (!amount || parseFloat(amount) <= 0) return setError('Amount must be positive greater than 0');
    if (!category) return setError('Please choose a category');
    if (!date) return setError('Please enter a valid date');

    setError('');
    setLoading(true);

    const payload = {
      title: title.trim(),
      type,
      category,
      amount: parseFloat(amount),
      date,
      notes: notes.trim()
    };

    let result;
    if (editingTransaction) {
      result = await editTransaction(editingTransaction._id, payload);
    } else {
      result = await addTransaction(payload);
    }

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[90vh] flex flex-col p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            {editingTransaction ? 'Edit Transaction Details' : 'Add New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4.5 mb-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-2xl dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400 shrink-0">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="flex-grow overflow-y-auto pr-1.5 space-y-4 max-h-[55vh]">
            
            {/* Toggle Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer ${
                    type === 'expense'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer ${
                    type === 'income'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Title Row */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Title / Description
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <FileText className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grocery Shop, Salary Bonus"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                />
              </div>
            </div>

            {/* Amount & Date Split Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <IndianRupee className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Calendar className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <Tag className="w-4.5 h-4.5" />
                </span>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150 appearance-none"
                >
                  <option value="" disabled>-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add extra information details..."
                rows="3"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150 resize-none"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${
                type === 'income' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/10'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Processing...' : editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddTransactionModal;

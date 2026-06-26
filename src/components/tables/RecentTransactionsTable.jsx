import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react';
import AddTransactionModal from '../forms/AddTransactionModal';

const RecentTransactionsTable = ({ transactions = [], onDelete }) => {
  const [editingTx, setEditingTx] = useState(null);

  const getCategoryColor = (category) => {
    // Return standard aesthetic Tailwind classes for badges
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

  return (
    <div className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover-card animate-slide-up">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            Recent Activities
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            Your latest income and expense items
          </p>
        </div>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:gap-1.5 transition-all"
        >
          View History
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-600">
          <Calendar className="w-8 h-8 opacity-40 mb-2" />
          <p className="text-xs font-bold">No recent activities found</p>
          <p className="text-[10px] mt-0.5">Click 'Add Transaction' to start tracking</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
              {transactions.slice(0, 5).map((tx) => (
                <tr 
                  key={tx._id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors"
                >
                  {/* Title & Type Icon */}
                  <td className="py-3.5 pr-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
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
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[180px]">
                          {tx.title}
                        </p>
                        {tx.notes && (
                          <p className="text-[9px] text-slate-400 truncate max-w-[120px] sm:max-w-[180px]">
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3.5 pr-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getCategoryColor(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>

                  {/* Date format */}
                  <td className="py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 pr-2">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Amount Value */}
                  <td className={`py-3.5 text-right font-extrabold text-xs pr-4 ${
                    tx.type === 'income' ? 'text-income' : 'text-expense'
                  }`}>
                    {formatAmount(tx)}
                  </td>

                  {/* Quick CRUD operations */}
                  <td className="py-3.5">
                    <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTx(tx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(tx._id)}
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
      )}

      {/* Edit Form Modal Overlay */}
      {editingTx && (
        <AddTransactionModal
          isOpen={!!editingTx}
          onClose={() => setEditingTx(null)}
          editingTransaction={editingTx}
        />
      )}
    </div>
  );
};

export default RecentTransactionsTable;

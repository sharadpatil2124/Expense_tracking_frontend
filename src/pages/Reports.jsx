import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Link } from 'react-router-dom';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Percent, 
  Info,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Reports = () => {
  const { 
    summary, 
    monthlyTrends, 
    categoryBreakdown, 
    refreshDashboardData 
  } = useContext(TransactionContext);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  // Formatter helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          Detailed breakdowns, comparisons, and budget performance audits
        </p>
      </div>

      {/* Financial Summary Table Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* All-time summaries panel */}
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-4">
            Cumulative All-Time Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850/60 text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Gross Earnings
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                {formatCurrency(summary?.allTime?.totalIncome || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850/60 text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Total Expenses
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                {formatCurrency(summary?.allTime?.totalExpense || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850/60 text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-violet-500" />
                Net Balance
              </span>
              <span className={`font-extrabold ${summary?.allTime?.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(summary?.allTime?.balance || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-500" />
                Savings Performance
              </span>
              <span className="text-slate-850 dark:text-slate-200 font-extrabold">
                {summary?.allTime?.savingsRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Current Month summary panel */}
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-4">
            This Month Metrics ({new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })})
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850/60 text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Monthly Earnings
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                {formatCurrency(summary?.currentMonth?.income || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850/60 text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                Monthly Expenses
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                {formatCurrency(summary?.currentMonth?.expense || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-indigo-500" />
                Monthly Net Savings
              </span>
              <span className={`font-extrabold ${summary?.currentMonth?.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(summary?.currentMonth?.balance || 0)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics graphs */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyComparisonChart data={monthlyTrends} />
        <CategoryPieChart data={categoryBreakdown} />
      </div>

      {/* Detailed Budget limits Audit */}
      <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4">
          Monthly Budget Performance Audit
        </h3>

        {summary?.budget?.limit > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold">
              <div className="space-y-1">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Limit Status</span>
                <p className="text-slate-700 dark:text-slate-350">
                  You have spent{' '}
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(summary.currentMonth.expense)}
                  </span>{' '}
                  out of your{' '}
                  <span className="font-extrabold text-slate-900 dark:white">
                    {formatCurrency(summary.budget.limit)}
                  </span>{' '}
                  budget cap.
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border dark:bg-slate-950 dark:border-slate-900 text-right min-w-[120px]">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px] block">Spent Value</span>
                <span className={`text-base font-extrabold ${summary.budget.isExceeded ? 'text-red-500' : 'text-violet-600'}`}>
                  {summary.budget.spentPercentage}%
                </span>
              </div>
            </div>

            {/* Dynamic Progress indicator */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-3.5 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  style={{ width: `${Math.min(summary.budget.spentPercentage, 100)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                    summary.budget.isExceeded ? 'bg-red-500' : summary.budget.spentPercentage > 85 ? 'bg-amber-500' : 'bg-violet-600'
                  }`}
                />
              </div>
            </div>

            {/* Budget status comments / warnings */}
            <div className="flex gap-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl dark:bg-slate-950 dark:border-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">System Assessment & Recommendation:</h4>
                <p className="mt-1 leading-relaxed text-[11px]">
                  {summary.budget.isExceeded ? (
                    <span className="text-red-500 font-bold">
                      CRITICAL: You have exceeded your monthly spending target budget by {formatCurrency(summary.currentMonth.expense - summary.budget.limit)}. We highly recommend reviewing your Transaction History, isolating non-essential Expense categories (like Shopping or Entertainment), and cutting down immediate discretionary spends.
                    </span>
                  ) : summary.budget.spentPercentage > 80 ? (
                    <span className="text-amber-500 font-bold">
                      WARNING: You have exhausted over 80% of your allocated budget cap. You have {formatCurrency(summary.budget.limit - summary.currentMonth.expense)} remaining for the rest of the month. Avoid high-amount purchases until next month.
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      HEALTHY: Your spending behavior is optimal. You have {formatCurrency(summary.budget.limit - summary.currentMonth.expense)} remaining ({100 - summary.budget.spentPercentage}% of limit) which is fully in alignment with your financial targets. Keep up the disciplined work!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-600">
            <AlertTriangle className="w-10 h-10 opacity-30 mb-3" />
            <p className="text-xs font-extrabold text-slate-650 dark:text-slate-400">No Monthly Budget Limits Configured</p>
            <p className="text-[10px] mt-0.5 mb-4">Set a spending target to audit monthly performance statistics</p>
            <Link
              to="/profile"
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-md shadow-violet-500/10 cursor-pointer"
            >
              Configure Budget Target
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default Reports;

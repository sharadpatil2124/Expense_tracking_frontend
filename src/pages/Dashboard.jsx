import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import SummaryCard from '../components/cards/SummaryCard';
import RecentTransactionsTable from '../components/tables/RecentTransactionsTable';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart';
import AddTransactionModal from '../components/forms/AddTransactionModal';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Percent, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  TrendingUpIcon
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { 
    summary, 
    transactions, 
    monthlyTrends, 
    categoryBreakdown,
    fetchTransactions,
    refreshDashboardData,
    deleteTransaction
  } = useContext(TransactionContext);

  const [modalOpen, setModalOpen] = useState(false);

  // Initialize transactions list and metric summaries
  useEffect(() => {
    fetchTransactions({ page: 1, limit: 5 });
    refreshDashboardData();
  }, [fetchTransactions, refreshDashboardData]);

  const handleDeleteTx = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      fetchTransactions({ page: 1, limit: 5 });
    }
  };

  // Helper formatter for currencies
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome banner and quick insert button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            Real-time tracking of your income, expenses, and savings targets
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 rounded-xl shadow-md shadow-violet-500/20 transition-all cursor-pointer"
          id="dashboard-add-tx-btn"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Grid of 4 financial summaries */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary?.allTime?.totalIncome || 0)}
          icon={TrendingUp}
          type="income"
          footerText={`This Month: ${formatCurrency(summary?.currentMonth?.income || 0)}`}
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary?.allTime?.totalExpense || 0)}
          icon={TrendingDown}
          type="expense"
          footerText={`This Month: ${formatCurrency(summary?.currentMonth?.expense || 0)}`}
        />
        <SummaryCard
          title="Net Balance"
          value={formatCurrency(summary?.allTime?.balance || 0)}
          icon={IndianRupee}
          type="balance"
          footerText={`This Month Net: ${formatCurrency(summary?.currentMonth?.balance || 0)}`}
        />
        <SummaryCard
          title="Savings Rate"
          value={`${summary?.allTime?.savingsRate || 0}`}
          suffix="%"
          icon={Percent}
          type="savings"
          footerText={summary?.allTime?.savingsRate >= 20 ? 'Optimal savings rate achieved!' : 'Try to target 20% savings'}
        />
      </div>

      {/* Budget target indicator panel */}
      {summary?.budget?.limit > 0 && (
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                Monthly Budget Limits
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Current month expense target monitoring
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {formatCurrency(summary.currentMonth.expense)}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {' '}
                / {formatCurrency(summary.budget.limit)}
              </span>
            </div>
          </div>

          {/* Progress bar indicator */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                summary.budget.isExceeded ? 'bg-red-500' : summary.budget.spentPercentage > 80 ? 'bg-amber-500' : 'bg-violet-600'
              }`}
              style={{ width: `${Math.min(summary.budget.spentPercentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <span>{summary.budget.spentPercentage}% Spent</span>
            {summary.budget.isExceeded ? (
              <span className="text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Exceeded limit
              </span>
            ) : (
              <span>{formatCurrency(summary.budget.limit - summary.currentMonth.expense)} Remaining</span>
            )}
          </div>
        </div>
      )}

      {/* Visual Analytics graphs */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyComparisonChart data={monthlyTrends} />
        <CategoryPieChart data={categoryBreakdown} />
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6">
        <RecentTransactionsTable 
          transactions={transactions} 
          onDelete={handleDeleteTx} 
        />
      </div>

      {/* Add Transaction Overlay Modal */}
      <AddTransactionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />

    </div>
  );
};

export default Dashboard;

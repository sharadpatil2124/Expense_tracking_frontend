import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { AlertCircle, X } from 'lucide-react';

const Layout = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { summary, refreshDashboardData } = useContext(TransactionContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dismissBudgetAlert, setDismissBudgetAlert] = useState(false);

  // Fetch summary and dashboard metrics on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboardData();
    }
  }, [isAuthenticated, refreshDashboardData]);

  // Keep track of budget limit changes to reset dismissal if needed
  const limitValue = summary?.budget?.limit;
  useEffect(() => {
    setDismissBudgetAlert(false);
  }, [limitValue]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Redirect to login if user is not authenticated
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading WealthFlow...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isExceeded = summary?.budget?.isExceeded && summary?.budget?.alertEnabled;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Panel */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Contents Area */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Budget limit alert banner */}
          {isExceeded && !dismissBudgetAlert && (
            <div className="flex items-start justify-between gap-4 p-4 border border-red-200 rounded-2xl bg-red-50/80 dark:bg-red-950/20 dark:border-red-900/50 backdrop-blur-md animate-slide-up">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-200">
                    Budget Warning!
                  </h4>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    You have exceeded your monthly spending limit of{' '}
                    <span className="font-bold">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(summary.budget.limit)}
                    </span>
                    . Your current monthly expenses total{' '}
                    <span className="font-extrabold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(summary.currentMonth.expense)}</span> (
                    {summary.budget.spentPercentage}% of limit).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDismissBudgetAlert(true)}
                className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Child Routes Outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

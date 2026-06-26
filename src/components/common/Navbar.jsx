import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Wallet, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { summary } = useContext(TransactionContext);
  const location = useLocation();

  // Get current page header title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/transactions':
        return 'Transactions History';
      case '/reports':
        return 'Financial Reports';
      case '/profile':
        return 'Account Settings';
      default:
        return 'WealthFlow';
    }
  };

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(summary?.allTime?.balance || 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          title="Toggle Drawer"
          id="mobile-drawer-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="hidden sm:block text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Welcome back, {user?.name?.split(' ')[0]}!
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Wallet Balance Chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-900 text-slate-700 dark:text-slate-300">
          <Wallet className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-semibold">Balance:</span>
          <span className={`text-xs font-extrabold ${summary?.allTime?.balance >= 0 ? 'text-income' : 'text-expense'}`}>
            {formattedBalance}
          </span>
        </div>

        {/* Notifications Check */}
        {summary?.budget?.isExceeded && summary?.budget?.alertEnabled && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 animate-pulse" title="Budget Limit Exceeded!">
            <Bell className="w-4.5 h-4.5" />
          </div>
        )}

        {/* User Card */}
        <div className="flex items-center gap-3 border-l pl-4 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col text-right">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
              {user?.name}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Sign Out"
            id="navbar-logout-btn"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

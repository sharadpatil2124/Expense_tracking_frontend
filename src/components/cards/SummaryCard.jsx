import React from 'react';

const SummaryCard = ({ title, value, icon: Icon, type, suffix = '', footerText = '' }) => {
  // Determine color theme based on card type
  const getThemeClasses = () => {
    switch (type) {
      case 'income':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20 dark:border-emerald-500/10',
          iconBg: 'bg-emerald-500 text-white',
          text: 'text-emerald-600 dark:text-emerald-400',
          glow: 'hover:shadow-emerald-500/5'
        };
      case 'expense':
        return {
          bg: 'bg-red-500/10 dark:bg-red-500/5 border-red-500/20 dark:border-red-500/10',
          iconBg: 'bg-red-500 text-white',
          text: 'text-red-600 dark:text-red-400',
          glow: 'hover:shadow-red-500/5'
        };
      case 'balance':
        return {
          bg: 'bg-indigo-500/10 dark:bg-indigo-500/5 border-indigo-500/20 dark:border-indigo-500/10',
          iconBg: 'bg-indigo-600 text-white',
          text: 'text-indigo-600 dark:text-indigo-400',
          glow: 'hover:shadow-indigo-500/5'
        };
      default: // Savings/analytics
        return {
          bg: 'bg-violet-500/10 dark:bg-violet-500/5 border-violet-500/20 dark:border-violet-500/10',
          iconBg: 'bg-violet-500 text-white',
          text: 'text-violet-600 dark:text-violet-400',
          glow: 'hover:shadow-violet-500/5'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl transition-all duration-300 hover:shadow-lg ${theme.glow} hover:-translate-y-0.5 flex flex-col justify-between min-h-[140px] animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1.5">
            {value}
            {suffix && <span className="text-sm font-bold text-slate-400 ml-0.5">{suffix}</span>}
          </h3>
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme.iconBg} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {footerText && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
          {footerText}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

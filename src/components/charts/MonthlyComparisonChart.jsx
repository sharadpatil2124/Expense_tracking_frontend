import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-xs font-semibold">
        <p className="font-extrabold text-slate-850 dark:text-slate-100 mb-1.5">{label}</p>
        <div className="space-y-1">
          <p className="text-emerald-600 dark:text-emerald-400">
            Income: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
          </p>
          <p className="text-red-500 dark:text-red-400">
            Expenses: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[1].value)}
          </p>
          <p className="text-violet-600 dark:text-violet-400 border-t border-slate-100 dark:border-slate-700 pt-1 mt-1 font-bold">
            Savings: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value - payload[1].value)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyComparisonChart = ({ data = [] }) => {
  return (
    <div className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover-card animate-slide-up flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
          Income vs Expenses
        </h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          Historical overview (Last 6 Months)
        </p>
      </div>

      <div className="flex-1 w-full h-[220px] mt-4 relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-600">
            No historical records found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;

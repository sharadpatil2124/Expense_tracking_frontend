import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#f43f5e'  // Rose
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
          {payload[0].name}
        </p>
        <p className="text-xs font-extrabold text-violet-600 dark:text-violet-400 mt-1">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data = [] }) => {
  const isDark = window.document.documentElement.classList.contains('dark');

  return (
    <div className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover-card animate-slide-up flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
          Expenses by Category
        </h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          Breakdown for current month
        </p>
      </div>

      <div className="flex-1 w-full h-[220px] mt-4 relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-600">
            No expense data available for this month
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryPieChart;

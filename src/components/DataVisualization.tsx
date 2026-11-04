import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  CASH_FLOW_HISTORY_7D, 
  CASH_FLOW_HISTORY_30D, 
  CASH_FLOW_HISTORY_1Y, 
  SPENDING_BY_CATEGORY 
} from '../data/mockData';
import { useBank } from '../context/BankContext';
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, Layers } from 'lucide-react';

export const DataVisualization: React.FC = () => {
  const { isDark, hideBalances } = useBank();
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '1Y'>('30D');
  const [chartType, setChartType] = useState<'cashflow' | 'balance'>('cashflow');

  const chartData = timeframe === '7D' 
    ? CASH_FLOW_HISTORY_7D 
    : timeframe === '30D' 
    ? CASH_FLOW_HISTORY_30D 
    : CASH_FLOW_HISTORY_1Y;

  // Custom Tooltip for Cash Flow Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-white mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-mono font-bold text-white">
                  {hideBalances ? '••••' : `$${Number(entry.value).toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Primary Chart: Cash Flow Dynamics & Trajectory */}
      <div className="lg:col-span-8 rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        {/* Header with Timeframe Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cash Flow Activity & Trajectory
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Live Rails
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative analysis of inbound revenue vs corporate burn
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Chart mode */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200 dark:border-slate-700/60 text-xs">
              <button
                onClick={() => setChartType('cashflow')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  chartType === 'cashflow'
                    ? 'bg-white dark:bg-[#121820] text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Inflow/Outflow
              </button>
              <button
                onClick={() => setChartType('balance')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  chartType === 'balance'
                    ? 'bg-white dark:bg-[#121820] text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Net Asset Curve
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
              {(['7D', '30D', '1Y'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    timeframe === tf
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'cashflow' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#1F2937' : '#E2E8F0'} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke={isDark ? '#94A3B8' : '#64748B'} 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={isDark ? '#94A3B8' : '#64748B'} 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => hideBalances ? '••' : `$${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  name="Inflow Revenue" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#inflowGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  name="Operating Spend" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#outflowGradient)" 
                />
              </AreaChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#1F2937' : '#E2E8F0'} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke={isDark ? '#94A3B8' : '#64748B'} 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={isDark ? '#94A3B8' : '#64748B'} 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => hideBalances ? '••' : `$${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  name="Total Treasury Liquidity" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#balanceGradient)" 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom Chart Footer Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Inflow Revenue</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Operating Spend</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {timeframe === '30D' ? '+14.2% Net Positive Inflow Ratio' : 'High Liquidity Reserve'}
          </span>
        </div>
      </div>

      {/* Secondary Chart: Spending by Category Donut */}
      <div className="lg:col-span-4 rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Spend Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly categorized expenditure
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              6 Categories
            </span>
          </div>

          {/* Donut Chart */}
          <div className="h-44 w-full relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPENDING_BY_CATEGORY}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {SPENDING_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    hideBalances ? '••••' : `$${Number(value).toLocaleString()}`,
                    'Amount'
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Spend
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {hideBalances ? '••••' : '$38.8k'}
              </span>
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {SPENDING_BY_CATEGORY.slice(0, 4).map((cat) => (
            <div key={cat.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{cat.category}</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {hideBalances ? '•••' : `$${cat.amount.toLocaleString()}`}
                </span>
                <span className="text-[11px] text-slate-400 w-9 text-right">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Percent, 
  PlusCircle, 
  CreditCard,
  Building,
  Zap,
  ArrowRight
} from 'lucide-react';

export const AccountSummaryCards: React.FC = () => {
  const { 
    totalNetWorth, 
    totalLiquidCash, 
    totalMonthlyYield, 
    accounts, 
    transactions,
    hideBalances,
    setIsTransferModalOpen,
    setIsNewAccountModalOpen,
    setCurrentView
  } = useBank();

  // Compute 30-day inflow and outflow from transactions
  const totalInflows = transactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflows = transactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const creditAccount = accounts.find(a => a.type === 'credit');
  const creditLimit = creditAccount?.cardLimit || 100000;
  const creditUsed = Math.abs(creditAccount?.balance || 12450.20);
  const creditPercent = Math.min(100, Math.round((creditUsed / creditLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Top Hero Grid: Net Worth + Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Net Worth Banner */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-emerald-950/80 via-[#0E1B15] to-[#0D151D] border border-emerald-500/25 relative overflow-hidden shadow-xl shadow-emerald-950/20 text-white">
          {/* Subtle background glow */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Total Consolidated Net Worth
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    FDIC Sweep Active
                  </span>
                </div>
                
                <div className="mt-2 flex items-baseline gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                    {hideBalances ? '••••••••••' : `$${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h1>
                  <span className="text-sm font-semibold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-4 h-4" />
                    +14.8%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  +$84,120.50 net growth across 4 multi-currency institutional accounts this quarter
                </p>
              </div>

              <button
                onClick={() => setIsNewAccountModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Vault</span>
              </button>
            </div>

            {/* Quick Action Dock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-200">Send Wire</span>
                <span className="text-[10px] text-slate-400">FedNow / ACH</span>
              </button>

              <button
                onClick={() => setCurrentView('transfers')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-200">Sweep Vault</span>
                <span className="text-[10px] text-slate-400">Auto Rebalance</span>
              </button>

              <button
                onClick={() => setCurrentView('cards')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <CreditCard className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-200">Card Controls</span>
                <span className="text-[10px] text-slate-400">Freeze & Limits</span>
              </button>

              <button
                onClick={() => setCurrentView('bills')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <Building className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-200">Bill Pay</span>
                <span className="text-[10px] text-slate-400">Subscriptions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          {/* Monthly Inflow */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Inflows (MTD)</span>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                {hideBalances ? '••••' : `+$${totalInflows.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Stripe, Angel & Wires</p>
            </div>
          </div>

          {/* Monthly Outflow / Burn */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spend (MTD)</span>
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                {hideBalances ? '••••' : `-$${totalOutflows.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Payroll & Cloud OpEx</p>
            </div>
          </div>

          {/* Treasury Yield APY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">T-Bill Accrued Yield</span>
              <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold font-mono text-teal-700 dark:text-teal-300">
                  {hideBalances ? '••••' : `+$${totalMonthlyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                  5.18% APY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Paid monthly on the 3rd</p>
            </div>
          </div>

          {/* Corporate Credit Utilization */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Credit Line Usage</span>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
                {creditPercent}%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                {hideBalances ? '••••' : `$${(creditLimit - creditUsed).toLocaleString()}`}
              </span>
              <span className="text-[11px] text-slate-400 ml-1">avail.</span>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${creditPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

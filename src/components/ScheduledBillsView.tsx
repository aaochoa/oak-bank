import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  CalendarClock, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Building, 
  DollarSign, 
  Clock, 
  RefreshCw,
  Plus
} from 'lucide-react';

export const ScheduledBillsView: React.FC = () => {
  const { 
    upcomingBills, 
    payBill, 
    toggleBillAutopay, 
    hideBalances,
    showToast 
  } = useBank();

  const totalUpcoming = upcomingBills
    .filter(b => b.status !== 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#131C24] to-[#0D151D] border border-slate-800 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Accounts Payable & Subscriptions
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              Smart Autopay
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-1">Scheduled Payables</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic liquidity sweep protects against NSF and overdraft charges
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-right">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Total Due Next 30 Days</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {hideBalances ? '••••••' : `$${totalUpcoming.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
        </div>
      </div>

      {/* Bill Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingBills.map(bill => {
          const isPaid = bill.status === 'paid';
          const isAutopay = bill.status === 'autopay';

          return (
            <div
              key={bill.id}
              className={`p-5 rounded-2xl border transition-all ${
                isPaid
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/30 opacity-75'
                  : 'bg-white dark:bg-[#121820] border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                    <Building className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{bill.payee}</h3>
                    <p className="text-xs text-slate-400">{bill.category} • {bill.recurringFrequency}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white block">
                    {hideBalances ? '••••' : `$${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </span>
                  <span className="text-[11px] text-slate-400">Due {bill.dueDate}</span>
                </div>
              </div>

              {/* Status and Action bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBillAutopay(bill.id)}
                    disabled={isPaid}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isAutopay
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Settled</span>
                      </>
                    ) : isAutopay ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Autopay Enabled</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Manual Pay</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    from {bill.accountName.split(' ')[0]}
                  </span>
                </div>

                {!isPaid && (
                  <button
                    onClick={() => payBill(bill.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
                  >
                    <span>Pay Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


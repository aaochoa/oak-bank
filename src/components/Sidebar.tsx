import React from 'react';
import { useBank } from '../context/BankContext';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  ReceiptText, 
  CreditCard, 
  BarChart3, 
  CalendarClock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  PlusCircle,
  Building2,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    currentView, 
    setCurrentView, 
    accounts, 
    selectedAccountId, 
    setSelectedAccountId,
    setIsNewAccountModalOpen,
    transactions,
    upcomingBills,
    hideBalances
  } = useBank();

  const pendingBillsCount = upcomingBills.filter(b => b.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText, count: transactions.length },
    { id: 'transfers', label: 'Transfers & Pay', icon: ArrowLeftRight },
    { id: 'cards', label: 'Cards & Limits', icon: CreditCard },
    { id: 'analytics', label: 'Cash Flow & Analytics', icon: BarChart3 },
    { id: 'bills', label: 'Scheduled Bills', icon: CalendarClock, badge: pendingBillsCount > 0 ? pendingBillsCount : undefined },
  ] as const;

  const handleNavClick = (viewId: typeof currentView) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-[#0D1217] border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 9v11a2 2 0 002 2h14a2 2 0 002-2V9l-9-7z"/>
                <path d="M12 9a3 3 0 100 6 3 3 0 000-6z"/>
              </svg>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0D1217]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">OAK BANK</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Private
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Wealth & Commercial</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-400">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {'badge' in item && item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {'count' in item && item.count !== undefined && (
                        <span className="text-xs text-slate-400 group-hover:text-slate-300">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Accounts Quick Switcher */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-400">
                Your Vaults & Accounts
              </span>
              <button 
                onClick={() => setIsNewAccountModalOpen(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                title="Create New Vault or Account"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedAccountId('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  selectedAccountId === 'all'
                    ? 'bg-slate-200/80 dark:bg-slate-800/90 text-slate-900 dark:text-white font-semibold ring-1 ring-slate-300 dark:ring-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Consolidated (All Accounts)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {accounts.map(acc => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-400/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: acc.color }} 
                      />
                      <span className="truncate">{acc.name}</span>
                    </div>
                    <span className="font-mono text-[11px] shrink-0 text-slate-700 dark:text-slate-300">
                      {hideBalances ? '••••' : `$${(acc.balance / 1000).toFixed(0)}k`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security & Regulatory Compliance Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-900/60 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Bank FDIC Insured</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Deposits insured up to $2,500,000 via our programmatic network of sweep institutions.
            </p>
            <div className="mt-2.5 pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FedNow 24/7 Rails
              </span>
              <span>256-Bit TLS</span>
            </div>
          </div>
        </div>

        {/* Profile Card Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0A0E13]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow">
                <div className="w-full h-full rounded-full bg-[#0D1217] flex items-center justify-center font-bold text-xs text-white">
                  AV
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0A0E13]" title="Verified KYC Verified" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Anderson Vance</p>
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Vance Technologies Ltd</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { Account } from '../types';
import { 
  Building2, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  PiggyBank, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export const AccountsCarousel: React.FC = () => {
  const { 
    accounts, 
    selectedAccountId, 
    setSelectedAccountId, 
    hideBalances, 
    setIsNewAccountModalOpen,
    showToast
  } = useBank();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    showToast('Copied to Clipboard', `${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking': return Landmark;
      case 'treasury': return ShieldCheck;
      case 'investment': return TrendingUp;
      case 'credit': return CreditCard;
      default: return PiggyBank;
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Accounts & Vaults</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {accounts.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any account to isolate transaction ledger and cash analytics
          </p>
        </div>

        <button
          onClick={() => setIsNewAccountModalOpen(true)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open New Vault</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map(account => {
          const isSelected = selectedAccountId === account.id;
          const Icon = getAccountIcon(account.type);

          return (
            <div
              key={account.id}
              onClick={() => setSelectedAccountId(isSelected ? 'all' : account.id)}
              className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-200 border text-left ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/10'
                  : 'bg-white dark:bg-[#121820] hover:bg-slate-50 dark:hover:bg-[#151D26] border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: account.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  {account.apy && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {account.apy}% APY
                    </span>
                  )}
                  {account.type === 'credit' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      Credit Line
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {account.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{account.accountNumber}</span>
                  <button
                    onClick={(e) => handleCopy(account.accountNumber.replace('•••• ', '884920'), 'Account #', e)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Copy full account number"
                  >
                    {copiedId === 'Account #' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span className="text-[10px] text-slate-400">• Routing {account.routingNumber}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">
                    {account.type === 'credit' ? 'Current Balance Due' : 'Available Balance'}
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {hideBalances ? '••••••' : `$${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>

                {isSelected ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Active Filter
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 group-hover:text-emerald-500 transition-colors">
                    Filter →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

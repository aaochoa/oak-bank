import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { AccountType } from '../types';
import { X, Landmark, ShieldCheck, TrendingUp, PiggyBank, ArrowRight } from 'lucide-react';

export const NewAccountModal: React.FC = () => {
  const { 
    isNewAccountModalOpen, 
    setIsNewAccountModalOpen, 
    createNewAccount, 
    accounts,
    showToast 
  } = useBank();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('treasury');
  const [initialDepositStr, setInitialDepositStr] = useState('10000');

  if (!isNewAccountModalOpen) return null;

  const primaryChecking = accounts[0];
  const initialDeposit = parseFloat(initialDepositStr) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name Required', 'Please enter a name for the new vault.', 'error');
      return;
    }

    if (initialDeposit > primaryChecking.availableBalance) {
      showToast('Insufficient Balance', `Available balance in primary checking is $${primaryChecking.availableBalance.toLocaleString()}`, 'error');
      return;
    }

    createNewAccount(name.trim(), type, initialDeposit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Open Dedicated Vault</h3>
              <p className="text-xs text-slate-400">Institutional FDIC programmatic account</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewAccountModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Vault Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Corporate Tax Reserve, M&A Escrow"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Vault Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('treasury')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'treasury'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Treasury Reserve</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-500 block mt-0.5">5.15% APY Yield</span>
              </button>

              <button
                type="button"
                onClick={() => setType('savings')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'savings'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <PiggyBank className="w-3.5 h-3.5 text-amber-500" />
                  <span>High-Yield Cash</span>
                </div>
                <span className="text-[10px] font-semibold text-amber-500 block mt-0.5">4.85% APY Yield</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Initial Deposit (from Checking)
              </label>
              <span className="text-[11px] text-slate-400">
                Avail: ${primaryChecking.availableBalance.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={initialDepositStr}
                onChange={(e) => setInitialDepositStr(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm font-mono font-bold bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Create Institutional Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


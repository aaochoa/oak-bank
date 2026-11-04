import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Landmark, 
  Send,
  Building2,
  DollarSign
} from 'lucide-react';

export const TransferModal: React.FC = () => {
  const { 
    isTransferModalOpen, 
    setIsTransferModalOpen, 
    accounts, 
    transferFunds,
    showToast 
  } = useBank();

  const [transferMode, setTransferMode] = useState<'internal' | 'external'>('internal');
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
  const [destAccountId, setDestAccountId] = useState(accounts[1]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRouting, setRecipientRouting] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [speed, setSpeed] = useState<'instant' | 'standard'>('instant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTransferModalOpen) return null;

  const sourceAccount = accounts.find(a => a.id === sourceAccountId) || accounts[0];
  const destAccount = accounts.find(a => a.id === destAccountId) || accounts[1];
  const amount = parseFloat(amountStr) || 0;

  const handlePreset = (val: number) => {
    setAmountStr(val.toString());
  };

  const handleMax = () => {
    if (sourceAccount) {
      setAmountStr(Math.max(0, sourceAccount.availableBalance).toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid amount greater than $0.', 'error');
      return;
    }

    if (amount > sourceAccount.availableBalance) {
      showToast('Insufficient Funds', `Available balance is $${sourceAccount.availableBalance.toLocaleString()}`, 'error');
      return;
    }

    if (transferMode === 'external' && !recipientName.trim()) {
      showToast('Missing Recipient', 'Please enter recipient name or business.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const destinationId = transferMode === 'internal' ? destAccountId : 'external-wire';
      const destinationLabel = transferMode === 'internal' ? destAccount.name : recipientName;

      const success = transferFunds(
        sourceAccountId,
        destinationId,
        destinationLabel,
        amount,
        note,
        speed
      );

      setIsSubmitting(false);
      if (success) {
        setIsTransferModalOpen(false);
        setAmountStr('');
        setNote('');
        setRecipientName('');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Move & Transfer Funds</h3>
              <p className="text-xs text-slate-400">Institutional FedNow & ACH Instant Settlement</p>
            </div>
          </div>

          <button
            onClick={() => setIsTransferModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTransferMode('internal')}
              className={`py-2 rounded-lg transition-colors ${
                transferMode === 'internal'
                  ? 'bg-white dark:bg-[#121820] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Between Oak Vaults
            </button>
            <button
              type="button"
              onClick={() => setTransferMode('external')}
              className={`py-2 rounded-lg transition-colors ${
                transferMode === 'external'
                  ? 'bg-white dark:bg-[#121820] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              External Payee / Wire
            </button>
          </div>

          {/* Source Account */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              From Account
            </label>
            <select
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — Available: ${acc.availableBalance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          {transferMode === 'internal' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                To Vault / Account
              </label>
              <select
                value={destAccountId}
                onChange={(e) => setDestAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                {accounts.filter(a => a.id !== sourceAccountId).map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) {acc.apy ? `• ${acc.apy}% APY` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Recipient Name / Entity
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Acme Capital Partners, LLC"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Routing (ABA)</label>
                  <input
                    type="text"
                    value={recipientRouting}
                    onChange={(e) => setRecipientRouting(e.target.value)}
                    placeholder="021000021"
                    maxLength={9}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Account Number</label>
                  <input
                    type="text"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                    placeholder="482019482"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Amount (USD)
              </label>
              <button
                type="button"
                onClick={handleMax}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Max (${sourceAccount.availableBalance.toLocaleString()})
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 rounded-2xl text-2xl font-extrabold font-mono bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Amount Presets */}
            <div className="flex items-center gap-2 pt-1">
              {[500, 1000, 5000, 25000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700/60 transition-colors"
                >
                  +${val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Settlement Speed
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSpeed('instant')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  speed === 'instant'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>FedNow Instant</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Real-time 2-second clearance • Fee: $0.00</p>
              </button>

              <button
                type="button"
                onClick={() => setSpeed('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  speed === 'standard'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Standard ACH</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">1-2 business days • Fee: $0.00</p>
              </button>
            </div>
          </div>

          {/* Memo / Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Memo / Purpose
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Q4 distribution, software invoice"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || amount <= 0}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authorizing via Secure Rails...</span>
            ) : (
              <>
                <span>Authorize & Send ${amount > 0 ? amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

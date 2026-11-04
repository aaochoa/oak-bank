import React, { useState, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Tag, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  Building,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

export const TransactionDetailModal: React.FC = () => {
  const { 
    selectedTransaction, 
    setSelectedTransaction, 
    updateTransactionNote, 
    deleteTransaction,
    showToast 
  } = useBank();

  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (selectedTransaction) {
      setNotes(selectedTransaction.notes || '');
      setTags(selectedTransaction.tags || []);
    }
  }, [selectedTransaction]);

  if (!selectedTransaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(selectedTransaction.referenceNumber);
    setCopiedRef(true);
    showToast('Reference Copied', selectedTransaction.referenceNumber);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSaveNotes = () => {
    updateTransactionNote(selectedTransaction.id, notes, tags);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim().toLowerCase())) {
      const nextTags = [...tags, newTagInput.trim().toLowerCase()];
      setTags(nextTags);
      updateTransactionNote(selectedTransaction.id, notes, nextTags);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = tags.filter(t => t !== tagToRemove);
    setTags(nextTags);
    updateTransactionNote(selectedTransaction.id, notes, nextTags);
  };

  const isInflow = selectedTransaction.type === 'inflow';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transaction Receipt</h3>
              <p className="text-[11px] text-slate-400 font-mono">Reference ID: {selectedTransaction.referenceNumber}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedTransaction(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hero Amount & Merchant */}
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified & Cleared by Oak Bank</span>
            </div>
            
            <h2 className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
              {isInflow ? '+' : '-'}${selectedTransaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {selectedTransaction.merchant}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Debited/Credited</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTransaction.accountName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Settlement Method / Rails</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTransaction.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Category</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-medium text-slate-800 dark:text-slate-200">
                {selectedTransaction.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timestamp</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {new Date(selectedTransaction.date).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Transaction Fee</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">$0.00 (Waived)</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-400">Reference ID</span>
              <button 
                onClick={handleCopyRef}
                className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>{selectedTransaction.referenceNumber}</span>
                {copiedRef ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Interactive Notes & Annotation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Audit Memo / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add memo or accounting justification..."
              className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Save Memo
              </button>
            </div>
          </div>

          {/* Interactive Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Accounting Tags
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <form onSubmit={handleAddTag} className="inline-flex items-center">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="+ Add tag"
                  className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 w-24"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#0E141B] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              deleteTransaction(selectedTransaction.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast('Receipt Generated', 'PDF receipt downloaded to downloads folder.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { 
    isExportModalOpen, 
    setIsExportModalOpen, 
    accounts,
    transactions,
    showToast 
  } = useBank();

  const [format, setFormat] = useState<'csv' | 'pdf' | 'qbo'>('csv');
  const [dateRange, setDateRange] = useState('30d');
  const [exportAccountId, setExportAccountId] = useState('all');

  if (!isExportModalOpen) return null;

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();

    if (format === 'csv') {
      // Generate real downloadable CSV file!
      const headers = ['Transaction ID', 'Date', 'Merchant', 'Category', 'Type', 'Amount', 'Account', 'Status', 'Reference ID'];
      const rows = transactions.map(t => [
        t.id,
        t.date,
        `"${t.merchant.replace(/"/g, '""')}"`,
        `"${t.category}"`,
        t.type,
        t.amount,
        `"${t.accountName}"`,
        t.status,
        t.referenceNumber
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Oak_Bank_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    showToast(
      'Export Generated', 
      `Statement exported in ${format.toUpperCase()} format (${transactions.length} records).`
    );
    setIsExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Export Official Statement</h3>
              <p className="text-xs text-slate-400">CSV, PDF, or QuickBooks Journal</p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  format === 'csv'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <span className="text-xs block">CSV / Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  format === 'pdf'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                <span className="text-xs block">Official PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('qbo')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  format === 'qbo'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D26] text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
                <span className="text-xs block">QuickBooks</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Date Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="30d">Last 30 Days (Oct - Nov 2026)</option>
              <option value="90d">Q4 YTD (Last 90 Days)</option>
              <option value="1y">Full Fiscal Year 2026</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Included Accounts
            </label>
            <select
              value={exportAccountId}
              onChange={(e) => setExportAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Consolidated (All 4 Accounts)</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download</span>
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useBank } from '../context/BankContext';
import { Transaction, TransactionCategory } from '../types';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  Download, 
  ChevronDown, 
  SlidersHorizontal,
  X,
  CreditCard,
  Building,
  Tag,
  Receipt
} from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { 
    transactions, 
    accounts,
    selectedAccountId, 
    setSelectedAccountId,
    searchQuery, 
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    setSelectedTransaction,
    setIsExportModalOpen,
    hideBalances
  } = useBank();

  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Available categories for filter dropdown
  const categories: ('All' | TransactionCategory)[] = [
    'All',
    'Income & Payouts',
    'Transfers',
    'Cloud & Tech',
    'Professional Services',
    'Dining & Entertainment',
    'Travel & Lodging',
    'Payroll & Benefits',
    'Operations & Office',
    'Dividends & Interest'
  ];

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Account filter
      if (selectedAccountId !== 'all' && tx.accountId !== selectedAccountId) {
        return false;
      }
      // Category filter
      if (filterCategory !== 'All' && tx.category !== filterCategory) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'All' && tx.status !== filterStatus.toLowerCase()) {
        return false;
      }
      // Type filter
      if (filterType !== 'All') {
        if (filterType === 'inflow' && tx.type !== 'inflow') return false;
        if (filterType === 'outflow' && tx.type !== 'outflow') return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesMerchant = tx.merchant.toLowerCase().includes(q);
        const matchesRef = tx.referenceNumber.toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        const matchesNotes = tx.notes?.toLowerCase().includes(q);
        const matchesTags = tx.tags?.some(tag => tag.toLowerCase().includes(q));
        if (!matchesMerchant && !matchesRef && !matchesCategory && !matchesNotes && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortField === 'date') {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });
  }, [transactions, selectedAccountId, filterCategory, filterStatus, filterType, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCategory('All');
    setFilterStatus('All');
    setFilterType('All');
    setSelectedAccountId('all');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    filterCategory !== 'All' || 
    filterStatus !== 'All' || 
    filterType !== 'All' || 
    selectedAccountId !== 'all';

  const formatTxDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTxTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Toolbar Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <span>Transaction Activity Ledger</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredTransactions.length} of {transactions.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time settlement history with interactive receipt inspection
            </p>
          </div>

          {/* Quick Type Filter Tabs & Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
              <button
                onClick={() => setFilterType('All')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'All'
                    ? 'bg-white dark:bg-[#121820] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('inflow')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'inflow'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Inflows (+)
              </button>
              <button
                onClick={() => setFilterType('outflow')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'outflow'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Spend (-)
              </button>
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              title="Download CSV / PDF statement"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search Field */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchants, ref #, or tags..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Account Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Accounts & Vaults</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#151D26] border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Filter clear tag pill */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Active filters:</span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-[#0E141B] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Merchant & Details</th>
              <th className="py-3.5 px-4">Account / Rails</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Date & Time</span>
                  {sortField === 'date' && (
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {sortField === 'amount' && (
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto">
                    <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">No transactions match your filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try broadening your search query or reset the applied filters.</p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isInflow = tx.type === 'inflow';
                const isPending = tx.status === 'pending';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="group hover:bg-slate-50 dark:hover:bg-[#151E28] cursor-pointer transition-colors"
                  >
                    {/* Merchant & Reference */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          isInflow
                            ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isInflow ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === 'transfer' ? (
                            <ArrowLeftRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {tx.merchant}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="font-mono">{tx.referenceNumber}</span>
                            {tx.tags && tx.tags.length > 0 && (
                              <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                                #{tx.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Account & Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {tx.accountName.split(' ')[0]} {tx.accountName.split(' ')[1]}
                      </p>
                      <p className="text-[11px] text-slate-400">{tx.paymentMethod}</p>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {formatTxDate(tx.date)}
                      </p>
                      <p className="text-[11px] text-slate-400">{formatTxTime(tx.date)}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`font-mono font-bold text-sm ${
                        isInflow
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {hideBalances ? '••••••' : `${isInflow ? '+' : '-'}$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


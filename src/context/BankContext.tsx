import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, BankCard, NotificationItem, Transaction, UpcomingBill } from '../types';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_CARDS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_UPCOMING_BILLS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface BankContextType {
  // Accounts
  accounts: Account[];
  selectedAccountId: string | 'all';
  setSelectedAccountId: (id: string | 'all') => void;
  selectedAccount: Account | undefined;
  totalNetWorth: number;
  totalLiquidCash: number;
  totalMonthlyYield: number;
  hideBalances: boolean;
  toggleHideBalances: () => void;
  createNewAccount: (name: string, type: Account['type'], initialDeposit: number) => void;

  // Transactions
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterStatus: string;
  setFilterStatus: (st: string) => void;
  filterType: string;
  setFilterType: (tp: string) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  updateTransactionNote: (id: string, notes: string, tags?: string[]) => void;
  deleteTransaction: (id: string) => void;

  // Transfers & Operations
  transferFunds: (
    fromAccountId: string,
    toAccountId: string,
    recipientName: string,
    amount: number,
    note: string,
    speed: 'instant' | 'standard'
  ) => boolean;

  // Cards
  cards: BankCard[];
  toggleCardFreeze: (cardId: string) => void;
  updateCardLimit: (cardId: string, limit: number) => void;
  toggleCardSetting: (cardId: string, setting: 'isContactless' | 'isInternationalEnabled') => void;

  // Bills
  upcomingBills: UpcomingBill[];
  payBill: (billId: string) => void;
  toggleBillAutopay: (billId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Navigation & Views
  currentView: 'overview' | 'transactions' | 'transfers' | 'cards' | 'analytics' | 'bills';
  setCurrentView: (view: 'overview' | 'transactions' | 'transfers' | 'cards' | 'analytics' | 'bills') => void;

  // Modals & Toasts
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isNewAccountModalOpen: boolean;
  setIsNewAccountModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return true; // default to sleek modern dark mode
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Balances visibility toggle (privacy mode)
  const [hideBalances, setHideBalances] = useState<boolean>(false);
  const toggleHideBalances = () => setHideBalances(prev => !prev);

  // Accounts state
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string | 'all'>('all');

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Cards & Bills state
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(INITIAL_UPCOMING_BILLS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation
  const [currentView, setCurrentView] = useState<'overview' | 'transactions' | 'transfers' | 'cards' | 'analytics' | 'bills'>('overview');

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Derived metrics
  const selectedAccount = selectedAccountId === 'all' 
    ? undefined 
    : accounts.find(a => a.id === selectedAccountId);

  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const totalLiquidCash = accounts
    .filter(a => a.type === 'checking' || a.type === 'treasury')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalMonthlyYield = accounts.reduce((acc, curr) => acc + (curr.monthlyYield || 0), 0);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Actions: Transfer Funds
  const transferFunds = (
    fromAccountId: string,
    toAccountId: string,
    recipientName: string,
    amount: number,
    note: string,
    speed: 'instant' | 'standard'
  ): boolean => {
    const sourceAcc = accounts.find(a => a.id === fromAccountId);
    if (!sourceAcc) {
      showToast('Transfer Failed', 'Source account not found.', 'error');
      return false;
    }

    if (sourceAcc.availableBalance < amount) {
      showToast('Insufficient Funds', `Available balance is $${sourceAcc.availableBalance.toLocaleString()}`, 'error');
      return false;
    }

    const isInternal = accounts.some(a => a.id === toAccountId);
    const destinationAcc = accounts.find(a => a.id === toAccountId);

    // Update balances
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return {
          ...acc,
          balance: acc.balance - amount,
          availableBalance: acc.availableBalance - amount
        };
      }
      if (isInternal && acc.id === toAccountId) {
        return {
          ...acc,
          balance: acc.balance + amount,
          availableBalance: acc.availableBalance + amount
        };
      }
      return acc;
    }));

    // Create Outflow Transaction for sender
    const refCode = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      merchant: isInternal && destinationAcc ? `Transfer to ${destinationAcc.name}` : `Transfer to ${recipientName}`,
      category: 'Transfers',
      type: 'transfer',
      amount: amount,
      accountId: sourceAcc.id,
      accountName: sourceAcc.name,
      status: 'completed',
      referenceNumber: refCode,
      paymentMethod: speed === 'instant' ? 'FedNow Instant Rails' : 'Standard ACH',
      notes: note || (isInternal ? 'Account rebalancing sweep' : `Direct payout to ${recipientName}`),
      recipient: isInternal && destinationAcc ? destinationAcc.name : recipientName,
      tags: ['transfer', speed === 'instant' ? 'instant' : 'ach'],
      fee: 0
    };

    setTransactions(prev => [newTx, ...prev]);

    // If internal transfer, create complementary inflow record
    if (isInternal && destinationAcc) {
      const incomingTx: Transaction = {
        id: `tx-in-${Date.now()}`,
        date: new Date().toISOString(),
        merchant: `Transfer from ${sourceAcc.name}`,
        category: 'Transfers',
        type: 'inflow',
        amount: amount,
        accountId: destinationAcc.id,
        accountName: destinationAcc.name,
        status: 'completed',
        referenceNumber: `${refCode}-CR`,
        paymentMethod: 'Internal Instant Sweep',
        notes: note || 'Account rebalancing sweep',
        tags: ['transfer', 'inflow'],
        fee: 0
      };
      setTransactions(prev => [incomingTx, ...prev]);
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Transfer Completed Successfully',
      message: `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} sent to ${recipientName || (destinationAcc?.name)}`,
      timestamp: 'Just now',
      type: 'transfer',
      read: false,
      amount: amount
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(
      'Transfer Successful',
      `Sent $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} via ${speed === 'instant' ? 'FedNow' : 'ACH'}.`
    );
    return true;
  };

  // Actions: Cards
  const toggleCardFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'active' ? 'frozen' : 'active';
        showToast(
          nextStatus === 'frozen' ? 'Card Locked' : 'Card Unlocked',
          `Card ending in ${c.last4} is now ${nextStatus}.`,
          nextStatus === 'frozen' ? 'info' : 'success'
        );
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const updateCardLimit = (cardId: string, limit: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        showToast('Limit Updated', `Monthly spending limit updated to $${limit.toLocaleString()}`);
        return { ...c, spendingLimit: limit };
      }
      return c;
    }));
  };

  const toggleCardSetting = (cardId: string, setting: 'isContactless' | 'isInternationalEnabled') => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const updated = { ...c, [setting]: !c[setting] };
        showToast('Security Preferences Updated', `${setting === 'isContactless' ? 'Contactless pay' : 'International transactions'} updated.`);
        return updated;
      }
      return c;
    }));
  };

  // Actions: Pay Bill
  const payBill = (billId: string) => {
    const bill = upcomingBills.find(b => b.id === billId);
    if (!bill || bill.status === 'paid') return;

    const account = accounts.find(a => a.id === bill.accountId) || accounts[0];
    if (account.availableBalance < bill.amount) {
      showToast('Payment Failed', `Insufficient balance in ${account.name}`, 'error');
      return;
    }

    // Deduct from account
    setAccounts(prev => prev.map(a => {
      if (a.id === account.id) {
        return {
          ...a,
          balance: a.balance - bill.amount,
          availableBalance: a.availableBalance - bill.amount
        };
      }
      return a;
    }));

    // Mark bill paid
    setUpcomingBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'paid' } : b));

    // Create Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      merchant: bill.payee,
      category: bill.category,
      type: 'outflow',
      amount: bill.amount,
      accountId: account.id,
      accountName: account.name,
      status: 'completed',
      referenceNumber: `BIL-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'Direct Bill Pay',
      notes: `Scheduled ${bill.recurringFrequency} payment for ${bill.payee}`,
      tags: ['bill-pay', 'scheduled'],
      fee: 0
    };
    setTransactions(prev => [newTx, ...prev]);

    showToast('Bill Paid', `Paid $${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to ${bill.payee}`);
  };

  const toggleBillAutopay = (billId: string) => {
    setUpcomingBills(prev => prev.map(b => {
      if (b.id === billId) {
        const nextStatus = b.status === 'autopay' ? 'pending' : 'autopay';
        showToast('Autopay Updated', `${b.payee} autopay is now ${nextStatus === 'autopay' ? 'enabled' : 'disabled'}.`);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // Actions: New Account Vault
  const createNewAccount = (name: string, type: Account['type'], initialDeposit: number) => {
    const sourceAcc = accounts[0];
    if (initialDeposit > 0 && sourceAcc.availableBalance < initialDeposit) {
      showToast('Deposit Failed', 'Insufficient funds in primary checking for initial deposit.', 'error');
      return;
    }

    if (initialDeposit > 0) {
      setAccounts(prev => prev.map(a => a.id === sourceAcc.id ? {
        ...a,
        balance: a.balance - initialDeposit,
        availableBalance: a.availableBalance - initialDeposit
      } : a));
    }

    const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name,
      type,
      accountNumber: `•••• ${randomLast4}`,
      routingNumber: '021000089',
      balance: initialDeposit,
      availableBalance: initialDeposit,
      currency: 'USD',
      apy: type === 'treasury' ? 5.15 : type === 'savings' ? 4.85 : undefined,
      monthlyYield: type === 'treasury' ? (initialDeposit * 0.0515) / 12 : undefined,
      status: 'active',
      color: randomColor
    };

    setAccounts(prev => [...prev, newAcc]);
    setIsNewAccountModalOpen(false);
    showToast('Vault Opened', `Created "${name}" with $${initialDeposit.toLocaleString()} initial deposit.`);
  };

  // Actions: Transactions
  const updateTransactionNote = (id: string, notes: string, tags?: string[]) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, notes, tags: tags || t.tags };
        if (selectedTransaction?.id === id) {
          setSelectedTransaction(updated);
        }
        return updated;
      }
      return t;
    }));
    showToast('Transaction Updated', 'Notes and tags have been saved.');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (selectedTransaction?.id === id) {
      setSelectedTransaction(null);
    }
    showToast('Transaction Removed', 'The transaction has been removed from ledger.', 'info');
  };

  // Actions: Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All notifications marked as read.');
  };

  return (
    <BankContext.Provider
      value={{
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        selectedAccount,
        totalNetWorth,
        totalLiquidCash,
        totalMonthlyYield,
        hideBalances,
        toggleHideBalances,
        createNewAccount,

        transactions,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        filterType,
        setFilterType,
        selectedTransaction,
        setSelectedTransaction,
        updateTransactionNote,
        deleteTransaction,

        transferFunds,

        cards,
        toggleCardFreeze,
        updateCardLimit,
        toggleCardSetting,

        upcomingBills,
        payBill,
        toggleBillAutopay,

        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,

        currentView,
        setCurrentView,

        isTransferModalOpen,
        setIsTransferModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isNewAccountModalOpen,
        setIsNewAccountModalOpen,

        toasts,
        dismissToast,
        showToast,

        isDark,
        toggleTheme
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};


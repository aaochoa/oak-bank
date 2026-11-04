export type AccountType = 'checking' | 'savings' | 'treasury' | 'investment' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  availableBalance: number;
  currency: string;
  apy?: number;
  monthlyYield?: number;
  status: 'active' | 'restricted' | 'locked';
  color: string;
  cardLimit?: number;
  usedLimit?: number;
}

export type TransactionType = 'inflow' | 'outflow' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'flagged';
export type TransactionCategory = 
  | 'Income & Payouts'
  | 'Transfers'
  | 'Cloud & Tech'
  | 'Professional Services'
  | 'Dining & Entertainment'
  | 'Travel & Lodging'
  | 'Payroll & Benefits'
  | 'Operations & Office'
  | 'Dividends & Interest';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  merchantLogo?: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  accountId: string;
  accountName: string;
  status: TransactionStatus;
  referenceNumber: string;
  paymentMethod: string;
  notes?: string;
  tags?: string[];
  fee?: number;
  recipient?: string;
}

export interface BankCard {
  id: string;
  accountId: string;
  cardholderName: string;
  cardNumber: string; // full masked
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  type: 'virtual' | 'physical';
  tier: 'Oak Titanium' | 'Oak Black' | 'Corporate Emerald';
  brand: 'Visa Infinite' | 'Mastercard World Elite';
  status: 'active' | 'frozen';
  spendingLimit: number;
  currentSpent: number;
  theme: 'emerald' | 'obsidian' | 'gold';
  isContactless: boolean;
  isInternationalEnabled: boolean;
}

export interface CashFlowDataPoint {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  budget: number;
  color: string;
}

export interface UpcomingBill {
  id: string;
  payee: string;
  category: TransactionCategory;
  amount: number;
  dueDate: string;
  status: 'pending' | 'autopay' | 'paid';
  accountId: string;
  accountName: string;
  recurringFrequency: 'Monthly' | 'Annual' | 'Quarterly';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'transfer' | 'security' | 'bill' | 'system';
  read: boolean;
  amount?: number;
}


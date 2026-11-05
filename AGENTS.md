# AGENTS.md — Oak Bank Developer & Agent Guide

> **Target Audience**: AI coding assistants, automated agents, and software engineers working on, extending, or maintaining the **Oak Bank** codebase.

---

## 1. Project Mission & Overview

**Oak Bank** is a modern, high-performance, responsive digital banking and wealth management dashboard designed for high-net-worth private clients and high-growth commercial entities.

It delivers a clean, intuitive fintech experience (inspired by Mercury, Brex, Revolut, and Linear) complete with:
- **Consolidated Net Worth & Multi-Vault Management** (Operating Checking, 5.18% APY Treasury, Investment Portfolio, Titanium Credit Card)
- **Real-Time Settlement & Money Movement** (Internal account-to-account sweeps, FedNow 24/7 instant rails, and standard ACH)
- **Comprehensive Transaction Ledger** (Multi-attribute filtering, live search, column sorting, interactive digital receipt modals, audit memos, accounting tags, and instant CSV/PDF export)
- **Interactive Financial Visualizations** (Recharts-powered Cash Flow Area Chart with timeframe toggles and categorized Spending Donut Chart)
- **Card Portfolio & Security Controls** (3D flippable bank card, PIN/CVV masking, instant card freeze, spending limit slider, and payment rail toggles)
- **Scheduled Payables (Bill Pay)** (Upcoming recurring SaaS and payroll invoices with instant pay and autopay)
- **Privacy & Theming** (Persistent Dark/Light mode and a one-click Privacy Mode to mask sensitive balances in public settings)

---

## 2. Technology Stack & Specifications

| Component | Technology | Version / Details |
|---|---|---|
| **Runtime & Language** | TypeScript / Node.js | TypeScript `^5.7.3`, Node `v26+` |
| **Package Manager** | `pnpm` | `v12.16.1` (Configured with `package-import-method=copy` in `.npmrc`) |
| **Frontend Framework** | React | `^19.0.0` (with React DOM 19) |
| **Build Tool & Bundler** | Vite | `^6.2.0` (with `@vitejs/plugin-react` and manual chunk optimization) |
| **Styling & CSS** | Tailwind CSS | `^3.4.17` (Extended with custom `oak`, `forest`, and `slatebg` palettes) |
| **Data Visualization** | Recharts | `^2.15.1` (AreaChart, PieChart, ResponsiveContainer) |
| **Iconography** | Lucide React | `^1.16.0` |
| **Typography** | Google Fonts | *Plus Jakarta Sans* (Sans) & *JetBrains Mono* (Code / Currency) |

---

## 3. Directory & File Structure

```
/Users/anderson/oak-bank/
├── .npmrc                           # pnpm configuration for isolated hard-linking (package-import-method=copy)
├── .gitignore                       # Git ignore list (node_modules, dist, logs, etc.)
├── package.json                     # Project manifest and pnpm packageManager specification
├── pnpm-lock.yaml                   # Deterministic pnpm dependency lockfile
├── index.html                       # Entry HTML with custom SVG acorn favicon & Google fonts
├── postcss.config.js                # PostCSS configuration for Tailwind CSS & Autoprefixer
├── tailwind.config.js               # Theme extensions (colors, box shadows, fonts, darkMode: 'class')
├── tsconfig.json                    # TypeScript compiler options (ES2020, Bundler module resolution)
├── vite.config.ts                   # Vite bundler configuration with manual code-splitting chunks
├── README.md                        # User-facing documentation and quickstart instructions
├── AGENTS.md                        # Machine-readable and developer-focused repository manual (this file)
└── src/
    ├── main.tsx                     # React DOM entry point
    ├── App.tsx                      # Primary dashboard container, top-level layout, and view routing
    ├── index.css                    # Tailwind directives, custom scrollbars, and glassmorphic utilities
    ├── types/
    │   └── index.ts                 # Central TypeScript interfaces and union types
    ├── data/
    │   └── mockData.ts              # Authentic initial dataset (accounts, transactions, cards, bills, charts)
    ├── context/
    │   └── BankContext.tsx          # React Context state orchestrator (accounts, ledger, cards, toasts)
    └── components/
        ├── Sidebar.tsx              # Main navigation sidebar, vault switcher, FDIC sweep guarantee badge
        ├── TopNavbar.tsx            # Global search input, theme toggle, privacy balance eye, notification drawer
        ├── AccountSummaryCards.tsx  # Hero Net Worth display, quick action dock, and MTD inflow/outflow metrics
        ├── AccountsCarousel.tsx     # Account cards with one-click copy for account & routing numbers
        ├── DataVisualization.tsx    # Recharts Area Chart (Cash Flow) & Donut Chart (Spending by Category)
        ├── TransactionHistory.tsx   # Searchable, filterable, sortable transaction activity table
        ├── TransactionDetailModal.tsx # Itemized digital receipt, audit memo editor, tag manager, PDF simulation
        ├── TransferModal.tsx        # Money movement modal: internal vault sweep or external FedNow/ACH wire
        ├── CardManagementView.tsx   # 3D interactive flippable card, freeze toggle, limit slider, rail controls
        ├── ScheduledBillsView.tsx   # Accounts payable dashboard with instant pay and smart autopay toggles
        ├── NewAccountModal.tsx      # Modal to open a new Treasury Reserve or Savings Vault with initial deposit
        ├── ExportModal.tsx          # Export modal generating live CSV downloads or QuickBooks/PDF statements
        └── ToastContainer.tsx       # Floating toast notifications providing instant feedback on user actions
```

---

## 4. Core Domain Models (`src/types/index.ts`)

### `Account`
Represents an individual vault or financial account:
```typescript
interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'treasury' | 'investment' | 'credit';
  accountNumber: string; // e.g. "•••• 8824"
  routingNumber: string; // e.g. "021000089"
  balance: number;
  availableBalance: number;
  currency: string;
  apy?: number;          // e.g. 5.18 for Treasury
  monthlyYield?: number; // Accrued compound yield
  status: 'active' | 'restricted' | 'locked';
  color: string;
  cardLimit?: number;    // Credit line limit
  usedLimit?: number;    // Current credit utilized
}
```

### `Transaction`
Represents an entry in the double-entry accounting ledger:
```typescript
interface Transaction {
  id: string;
  date: string;              // ISO-8601 string
  merchant: string;
  merchantLogo?: string;
  category: TransactionCategory;
  type: 'inflow' | 'outflow' | 'transfer';
  amount: number;
  accountId: string;
  accountName: string;
  status: 'completed' | 'pending' | 'flagged';
  referenceNumber: string;   // e.g. "STR-99482104-US"
  paymentMethod: string;     // e.g. "FedNow Instant Settlement"
  notes?: string;            // User-editable audit memo
  tags?: string[];           // User-editable accounting tags
  fee?: number;
  recipient?: string;
}
```

### `BankCard`
Represents physical titanium or virtual single-use cards:
```typescript
interface BankCard {
  id: string;
  accountId: string;
  cardholderName: string;
  cardNumber: string;        // Full masked representation
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
```

### `UpcomingBill`
Represents scheduled corporate obligations and SaaS subscriptions:
```typescript
interface UpcomingBill {
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
```

---

## 5. Application State Architecture (`src/context/BankContext.tsx`)

The application state is centralized in `BankProvider` and accessed across components via the custom hook `useBank()`.

### Key State & Handlers Provided by `useBank()`:
- **Accounts**:
  - `accounts`: Active array of accounts.
  - `selectedAccountId`: Active account filter (`'all'` or specific account ID).
  - `createNewAccount(name, type, initialDeposit)`: Debits primary checking and appends a new vault to state.
  - `totalNetWorth`, `totalLiquidCash`, `totalMonthlyYield`: Automatically calculated reactive aggregates.
- **Privacy & Balances**:
  - `hideBalances`: Boolean flag toggled via eye icon to mask amounts as `••••••`.
- **Transactions**:
  - `transactions`: Array of ledger items.
  - `searchQuery`, `filterCategory`, `filterStatus`, `filterType`: Filtering states for the ledger.
  - `selectedTransaction`: Currently active receipt displayed in `TransactionDetailModal`.
  - `updateTransactionNote(id, note, tags)`: Persists user-entered memos and tags directly to the transaction record.
  - `deleteTransaction(id)`: Archives a transaction from the active ledger.
- **Transfers (`transferFunds`)**:
  - Validates source account available funds.
  - Deducts from source account and credits destination account (if internal).
  - Generates an immediate `Transaction` entry with unique reference code (`TXN-XXXXXX`).
  - Creates an activity notification in the notification center.
  - Emits a success toast.
- **Cards**:
  - `toggleCardFreeze(cardId)`: Toggles active card state between `'active'` and `'frozen'`.
  - `updateCardLimit(cardId, limit)`: Sets the monthly cap.
  - `toggleCardSetting(cardId, setting)`: Toggles contactless or international permissions.
- **Bills (`payBill`, `toggleBillAutopay`)**:
  - `payBill(billId)`: Debits associated bank account, marks bill as `'paid'`, and adds an outflow transaction.
- **Theme**:
  - `isDark`, `toggleTheme`: Synchronizes `'dark'` class to the `<html>` root element.
- **Modals & Toasts**:
  - `showToast(title, message, type)`: Dispatches auto-dismissing floating toasts.

---

## 6. Development Workflows & Commands

All commands must be executed using **`pnpm`**:

```bash
# Install dependencies
pnpm install

# Start development server on port 3000
pnpm run dev

# Run TypeScript type check and compile Vite production build
pnpm run build

# Preview production build locally
pnpm run preview
```

### Build Optimization
In `vite.config.ts`, `build.rollupOptions.output.manualChunks` splits the bundle into discrete chunks:
- `vendor-react`: `react`, `react-dom`
- `vendor-charts`: `recharts`
- `vendor-icons`: `lucide-react`

---

## 7. Guidelines for Agents Modifying Code

1. **Package Manager Consistency**: Always use `pnpm` (never `npm` or `yarn`). Do not recreate `package-lock.json`.
2. **Strict Type Safety**: All new components, hooks, and helpers must be strictly typed. Avoid `any` except where required for external third-party chart payloads.
3. **Privacy Mode Respect**: Any component displaying monetary amounts must check `hideBalances` from `useBank()`. If `hideBalances` is true, render masked bullets (`••••`) instead of raw numbers.
4. **Tailwind Design System**:
   - Primary accents: `emerald-500` / `emerald-600`
   - Dark surfaces: `#090D11` (base background), `#0D1217` (sidebar/navbar), `#121820` (cards/panels)
   - Border colors: `slate-200` (light mode) / `slate-800` (dark mode)
   - Number formatting: Use `font-mono` (`JetBrains Mono`) for all financial figures, account numbers, and timestamps.
5. **Interactive Feedback**: When adding new functional mutations (e.g. creating rules, sending payments, updating limits), always call `showToast(...)` to inform the user.
6. **Documentation Preservation**: Maintain docstrings, component comments, and update this `AGENTS.md` file whenever domain models or core workflows change.

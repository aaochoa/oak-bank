# Oak Bank — Modern Digital Banking & Wealth Management Dashboard

Oak Bank is an institutional-grade, modern banking dashboard designed for private wealth and high-growth commercial entities. Built with React 19, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide Icons, it demonstrates a clean, responsive, high-performance fintech UI with rich interactive features and realistic financial modeling.

---

## 🌟 Key Features

### 1. Modern UI / UX Architecture
- **Fintech Aesthetic**: High-end dark/light theme inspired by modern private banking and enterprise fintechs (Mercury, Brex, Linear, Revolut).
- **Responsive Layout**: Collapsible sidebar, mobile navigation drawer, and fluid grid adapting smoothly across desktop, tablet, and mobile viewports.
- **Micro-Interactions**: Smooth state transitions, hover elevations, badge pulses, and glassmorphic panels.
- **Privacy Mode**: One-click balance reveal/hide toggle to mask sensitive numbers in public environments.

### 2. Comprehensive Account Overview
- **Consolidated Net Worth Card**: Real-time balance tally across multiple institutional vaults with 30-day percentage growth metrics.
- **Multi-Account Carousel**:
  - *Oak Premier Operating Checking* (Real-time checking with FedNow support)
  - *High-Yield Treasury Reserve* (5.18% APY with monthly yield tracking)
  - *Strategic Investment Portfolio* (8.42% return model)
  - *Oak Titanium Corporate Credit* (Active credit line with live utilization bar)
- **Account Quick Actions**: One-click routing and account number copy with instant clipboard confirmation.
- **Vault Creation**: Programmatic modal to launch new dedicated tax reserves, escrow accounts, or savings vaults with custom deposit allocations.

### 3. Transaction Management & Ledger
- **Multi-Criteria Filtering**: Filter by account, status (Cleared, Pending), type (Inflow, Outflow, Transfers), and category.
- **Instant Search**: Real-time searching by merchant name, transaction reference number, notes, or tags.
- **Interactive Sorting**: Sort by settlement timestamp or monetary amount.
- **Detailed Receipt Modal**: Inspect itemized transaction receipts, copy FedNow/ACH reference IDs, add custom audit memos, assign accounting tags, or archive records.
- **Export Capabilities**: Generate live CSV exports directly in the browser or prepare official PDF / QuickBooks statements.

### 4. Interactive Data Visualization
- **Cash Flow Activity & Trajectory**: Area chart comparing inbound revenue vs operating expenditures across customizable timeframes (`7D`, `30D`, `1Y`).
- **Net Asset Curve**: Trajectory view tracking total treasury liquidity over time.
- **Spending Breakdown**: Donut chart detailing categorized expenditures (Payroll, Cloud Infra, OpEx, Travel, Legal, Dining) with hover tooltips and category percentage shares.

### 5. Functional Banking Elements
- **Institutional Money Movement (Send Funds)**:
  - Internal vault sweeps vs external ACH / FedNow instant transfers.
  - Live available balance validation.
  - Instant balance deduction and immediate injection into the transaction ledger and notification center.
- **Card Portfolio & Security Controls**:
  - Interactive 3D credit/debit cards with 180° flip effect to inspect magnetic stripe, CVV, and cardholder info.
  - Show / Hide card numbers and CVV with security masking.
  - Freeze / Unfreeze card toggles with visual holographic freeze overlay.
  - Dynamic monthly spending cap slider.
  - Contactless & International transaction toggles.
- **Scheduled Payables (Bill Pay)**:
  - Monitor upcoming corporate invoices and software subscriptions.
  - Autopay toggling and instant "Pay Now" actions that automatically debit the chosen account and log an outflow transaction.
- **Notification Center**: Real-time activity badge with alert drawer and one-click "Mark All Read".
- **Toast Notifications**: Non-intrusive alerts providing instant visual feedback on all user actions.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Run
```bash
# Install dependencies (already installed in workspace)
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

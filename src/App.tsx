import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { AccountSummaryCards } from './components/AccountSummaryCards';
import { AccountsCarousel } from './components/AccountsCarousel';
import { DataVisualization } from './components/DataVisualization';
import { TransactionHistory } from './components/TransactionHistory';
import { CardManagementView } from './components/CardManagementView';
import { ScheduledBillsView } from './components/ScheduledBillsView';
import { TransferModal } from './components/TransferModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { NewAccountModal } from './components/NewAccountModal';
import { ExportModal } from './components/ExportModal';
import { ToastContainer } from './components/ToastContainer';
import { 
  ArrowLeftRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentView, setIsTransferModalOpen } = useBank();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-7">
          {/* View Routing */}
          {currentView === 'overview' && (
            <>
              {/* Account Overview Hero & Key Metrics */}
              <AccountSummaryCards />

              {/* Multi-Account Cards Carousel */}
              <AccountsCarousel />

              {/* Data Visualization & Interactive Analytics */}
              <DataVisualization />

              {/* Real-time Transaction Ledger */}
              <TransactionHistory />
            </>
          )}

          {currentView === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Audit & Transaction Ledger
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Multi-entity transaction auditing with export, search, and real-time filtering
                  </p>
                </div>
              </div>
              <TransactionHistory />
            </div>
          )}

          {currentView === 'transfers' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0B1A13] to-[#0D151D] border border-emerald-500/25 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Settlement Rails
                  </span>
                  <h1 className="text-2xl font-bold mt-1">Institutional Money Movement</h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct FedNow connectivity for instant sub-second domestic transfers and international SWIFT wires
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-center"
                >
                  Initiate New Transfer
                </button>
              </div>

              {/* Accounts balance quick cards */}
              <AccountsCarousel />

              {/* Filtered Transfer ledger */}
              <TransactionHistory />
            </div>
          )}

          {currentView === 'cards' && (
            <CardManagementView />
          )}

          {currentView === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Financial Analytics & Cash Forecasting
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Macro spending velocity, runway projection, and compound interest models
                </p>
              </div>
              <DataVisualization />
              <AccountsCarousel />
            </div>
          )}

          {currentView === 'bills' && (
            <ScheduledBillsView />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 mt-12 bg-white/50 dark:bg-[#0A0E13]/50">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">OAK BANK N.A.</span>
            <span>• Member FDIC • Equal Housing Lender</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Routing: 021000089</span>
            <span>256-Bit TLS Rails</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </footer>
      </div>

      {/* Global Interactive Modals */}
      <TransferModal />
      <TransactionDetailModal />
      <NewAccountModal />
      <ExportModal />

      {/* Toast Notification Stream */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BankProvider>
      <DashboardContent />
    </BankProvider>
  );
};

export default App;


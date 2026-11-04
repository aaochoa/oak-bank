import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { 
  Menu, 
  Search, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Bell, 
  ArrowUpRight, 
  Download, 
  Check, 
  ShieldAlert, 
  DollarSign, 
  Sparkles,
  X
} from 'lucide-react';

interface TopNavbarProps {
  onOpenMobileMenu: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    isDark, 
    toggleTheme, 
    hideBalances, 
    toggleHideBalances, 
    setIsTransferModalOpen,
    setIsExportModalOpen,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView
  } = useBank();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setCurrentView('transactions');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0D1217]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search transactions, merchants, wires, tags... (Press / to focus)"
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-[#131A21] border border-transparent dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#161F28] focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Balance Privacy Toggle */}
        <button
          onClick={toggleHideBalances}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={hideBalances ? "Show Balances" : "Privacy Mode (Hide Balances)"}
          aria-label="Toggle sensitive balances visibility"
        >
          {hideBalances ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D1217]" />
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/20 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Activity Alerts</span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto my-1">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`py-3 px-2 flex items-start gap-3 cursor-pointer rounded-xl transition-colors ${
                      notif.read 
                        ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/40' 
                        : 'bg-emerald-500/5 hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      {notif.type === 'security' ? <ShieldAlert className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Statement Trigger */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          title="Export Statements (CSV, PDF)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Primary Action: Send Money / Transfer */}
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.98] transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Send Funds</span>
        </button>
      </div>
    </header>
  );
};


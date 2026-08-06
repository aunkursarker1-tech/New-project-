import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  Shield,
  ChevronDown,
  ExternalLink,
  Package,
  AlertTriangle
} from 'lucide-react';

interface AdminHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileSidebar: () => void;
  lowStockCount: number;
  pendingOrdersCount: number;
  onNavigateTab: (tab: any) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenMobileSidebar,
  lowStockCount,
  pendingOrdersCount,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const totalNotifications = (lowStockCount > 0 ? 1 : 0) + (pendingOrdersCount > 0 ? 1 : 0);

  return (
    <header className={`sticky top-0 z-30 px-6 py-4 border-b transition-colors flex items-center justify-between ${
      darkMode ? 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-md' : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl bg-slate-800/20 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Live Store Synchronization Active
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2.5 rounded-2xl border transition-colors ${
            darkMode ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-2xl border relative transition-colors ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-bounce">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-3xl border shadow-2xl p-4 space-y-3 z-50 text-xs ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                <span className="font-extrabold text-sm">Notifications & Alerts</span>
                <span className="text-[10px] text-slate-400">Real-time</span>
              </div>

              <div className="space-y-2">
                {pendingOrdersCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab('orders');
                      setShowNotifications(false);
                    }}
                    className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 cursor-pointer space-y-1 hover:brightness-110"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Pending Orders</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black">{pendingOrdersCount}</span>
                    </div>
                    <p className="text-[10px] text-slate-300">Orders requiring bKash verification and packing.</p>
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab('products');
                      setShowNotifications(false);
                    }}
                    className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-pointer space-y-1 hover:brightness-110"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Low Stock Warning</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-black">{lowStockCount} Items</span>
                    </div>
                    <p className="text-[10px] text-slate-300">Products with stock under 10 units.</p>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <p className="text-center text-slate-500 py-4">No active warnings or pending alerts.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Widget */}
        <div className={`flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl border ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-black leading-none text-slate-200">Admin Manager</h4>
            <span className="text-[9px] text-emerald-400 font-bold">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

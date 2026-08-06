import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';
import { Customer, Order } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface CustomersSectionProps {
  darkMode: boolean;
  customers: Customer[];
  orders: Order[];
  onToggleBlockCustomer?: (customerId: string) => void;
}

export const CustomersSection: React.FC<CustomersSectionProps> = ({
  darkMode,
  customers,
  orders,
  onToggleBlockCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.shippingAddress.phone === selectedCustomer.phone)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Registered Customers Database</h2>
          <p className="text-xs text-slate-400 mt-0.5">View buying activity, total lifetime spend, order history & account status</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customer name, phone number, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border transition-all ${
              darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-base shadow-md">
                    {cust.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{cust.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Joined: {cust.joinedDate}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  cust.status === 'Blocked'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {cust.status || 'Active'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/40">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {cust.phone}</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {cust.email}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {cust.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Spent</span>
                  <p className="font-black text-emerald-400 text-sm">{formatPrice(cust.totalSpent)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Orders Placed</span>
                  <p className="font-black text-cyan-400 text-sm">{cust.totalOrders} Orders</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800/40 text-xs">
              <button
                onClick={() => setSelectedCustomer(cust)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> View History
              </button>

              {onToggleBlockCustomer && (
                <button
                  onClick={() => onToggleBlockCustomer(cust.id)}
                  className={`p-2 rounded-xl font-bold transition-colors ${
                    cust.status === 'Blocked'
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                  }`}
                  title={cust.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
                >
                  {cust.status === 'Blocked' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Customer History Modal Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold">{selectedCustomer.name}'s Order Record</h3>
                <p className="text-xs text-slate-400">📞 {selectedCustomer.phone} • {selectedCustomer.email}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {customerOrders.length > 0 ? (
                customerOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-400">#{ord.id}</span>
                      <span className="text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-200">
                      <span>Status: <strong className="text-amber-400">{ord.status}</strong></span>
                      <strong className="text-emerald-400 text-sm">{formatPrice(ord.total)} ({ord.paymentMethod})</strong>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No previous live orders logged for this phone number</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

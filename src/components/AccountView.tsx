import React, { useState } from 'react';
import { User, Package, MapPin, Key, RefreshCw, Star, ShieldCheck, Phone, CheckCircle, Truck, Info, LogOut } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/helpers';

interface AccountViewProps {
  orders: Order[];
  darkMode: boolean;
  customerName: string;
  customerPhone: string;
  onLogout: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  orders,
  darkMode,
  customerName,
  customerPhone,
  onLogout,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'password'>('orders');

  // Profile Form state
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [email, setEmail] = useState('corporate.user@domain.com');

  // Address State
  const [address, setAddress] = useState('Gulshan Avenue, Road 11, Dhaka');

  // Password State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Mock past logs
  const customerOrders = orders; // Show matching or all demo orders for preview!

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile information updated successfully!');
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Shipping addresses saved successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    alert('Account password modified successfully!');
    setOldPass('');
    setNewPass('');
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-500 font-bold">My Account</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-3xl border text-center ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8" />
            </div>
            <h3 className={`text-base font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
            <p className="text-xs text-slate-400 font-mono font-bold mt-1">{phone}</p>
          </div>

          <div className={`rounded-3xl border overflow-hidden p-2 ${
            darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {[
              { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
              { id: 'profile', label: 'Edit Profile', icon: <User className="w-4 h-4" /> },
              { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
              { id: 'password', label: 'Security & Password', icon: <Key className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-xs font-black text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border-t border-slate-800/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Panel (9 cols) */}
        <div className="lg:col-span-9">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/20">
                <h2 className={`text-lg sm:text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>My Purchase History</h2>
                <span className="text-xs text-slate-400 font-semibold">{customerOrders.length} orders total</span>
              </div>

              {customerOrders.length > 0 ? (
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`rounded-3xl border p-5 space-y-4 transition-all ${
                        darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
                      }`}
                    >
                      {/* Summary Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/10 dark:border-slate-800/30 pb-3">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-500 font-bold">ORDER REFERENCE</p>
                          <h4 className="text-sm font-black font-mono text-emerald-400">{order.id}</h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-500 font-bold">PURCHASE DATE</p>
                          <span className="text-xs font-semibold text-slate-300">{order.createdAt || 'Just Now'}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-500 font-bold">STATUS</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="divide-y divide-slate-300/10 dark:divide-slate-800/10">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2.5 gap-4">
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate max-w-xs sm:max-w-md ${darkMode ? 'text-white' : 'text-slate-900'}`}>{it.product.name}</p>
                              <span className="text-[10px] text-slate-400">Qty: {it.quantity} {it.selectedColor && `• Color: ${it.selectedColor}`}</span>
                            </div>
                            <span className="text-xs font-black text-slate-300 shrink-0">{formatPrice(it.product.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Totals Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-300/10 dark:border-slate-800/30">
                        <div className="text-xs text-slate-400 font-semibold">
                          Payment Method: <span className="text-slate-300 font-black">{order.paymentMethod}</span>
                          {order.paymentDetails?.transactionId && (
                            <span className="block text-[10px] text-slate-500 font-mono mt-0.5">TXID: {order.paymentDetails.transactionId}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold block">TOTAL AMOUNT</span>
                            <span className="text-sm font-black text-emerald-400">{formatPrice(order.totalAmount)}</span>
                          </div>

                          <button
                            onClick={() => onTrackOrder(order.id)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] transition-all shrink-0"
                          >
                            Track Shipment
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Info className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-xs font-bold">You haven't ordered any gadgets yet.</p>
                  <a href="/shop" className="mt-3 inline-block text-xs font-bold text-emerald-400 hover:underline">Shop Now</a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className={`p-5 rounded-3xl border space-y-4 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-black border-b border-slate-800/10 pb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Edit Profile Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-semibold border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-mono font-bold border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-xs font-semibold border outline-none focus:border-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
              >
                Save Profile Updates
              </button>
            </form>
          )}

          {activeTab === 'addresses' && (
            <form onSubmit={handleUpdateAddress} className={`p-5 rounded-3xl border space-y-4 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-black border-b border-slate-800/10 pb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Saved Shipping Addresses</h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Home Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none focus:border-emerald-500 resize-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
              >
                Save Shipping Address
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className={`p-5 rounded-3xl border space-y-4 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-black border-b border-slate-800/10 pb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Security Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-semibold border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-semibold border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
              >
                Change Workspace Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  Send,
  Printer,
  ShieldAlert
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface OrdersSectionProps {
  darkMode: boolean;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateCourierInfo?: (orderId: string, courierName: any, trackingNumber: string) => void;
  onSelectOrderInvoice: (order: Order) => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  darkMode,
  orders,
  onUpdateOrderStatus,
  onUpdateCourierInfo,
  onSelectOrderInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [tempTrackingNum, setTempTrackingNum] = useState('');
  const [tempCourierName, setTempCourierName] = useState<'Steadfast Courier' | 'Pathao Courier' | 'Paperfly'>('Steadfast Courier');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.phone.includes(searchTerm) ||
      (o.bkashTrxId && o.bkashTrxId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleSaveCourier = (orderId: string) => {
    if (onUpdateCourierInfo) {
      onUpdateCourierInfo(orderId, tempCourierName, tempTrackingNum);
    }
    setEditingTrackingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Order Management & Logistics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter by payment method, update dispatch status, assign courier tracking & print invoices</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID, Phone, Customer Name, or bKash TrxID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border transition-all ${
                darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="All">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="COD">Cash on Delivery (COD)</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className={`p-6 rounded-3xl border space-y-4 transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800/40">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-emerald-400 text-base">#{ord.id}</span>
                <span className="text-xs text-slate-400">Placed on {new Date(ord.createdAt).toLocaleString()}</span>
                {ord.fraudScore !== undefined && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                    (ord.fraudScore || 0) >= 70
                      ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                      : (ord.fraudScore || 0) >= 30
                      ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  }`}>
                    <ShieldAlert className="w-3 h-3 shrink-0" />
                    <span>Risk: {ord.fraudScore}/100 ({ord.riskLevel || 'Low Risk'})</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={ord.status}
                  onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border outline-none ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : ord.status === 'Shipped'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : ord.status === 'Processing'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Processing">Processing & Packing</option>
                  <option value="Shipped">Shipped to Courier</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered & Closed</option>
                  <option value="Cancelled">Cancelled Order</option>
                </select>

                <button
                  onClick={() => onSelectOrderInvoice(ord)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <FileText className="w-4 h-4" /> Generate Invoice
                </button>
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Items Summary */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                  Purchased Items ({ord.items.reduce((acc, i) => acc + i.quantity, 0)} total)
                </span>
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/60 hover:border-slate-700/80 transition-all">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700/50 shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-100 text-xs truncate">{item.product.name}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 font-mono font-bold">
                            Qty: <strong className="text-emerald-400">{item.quantity}</strong>
                          </span>
                          <span className="font-black text-slate-200">{formatPrice(item.product.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Customer */}
              <div className="space-y-2 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Customer Profile</span>
                
                <div className="flex items-center gap-3 pb-2 border-b border-slate-800/50">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                    {ord.shippingAddress.fullName ? ord.shippingAddress.fullName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-100 text-sm truncate">{ord.shippingAddress.fullName}</p>
                    <p className="text-xs text-slate-400 font-medium">📞 {ord.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-1 text-slate-300">
                  <p className="text-slate-400 font-medium">{ord.shippingAddress.fullAddress}</p>
                  <p className="text-emerald-400 font-bold">{ord.shippingAddress.thana}, {ord.shippingAddress.district}, {ord.shippingAddress.division}</p>
                </div>
              </div>

              {/* Payment & Courier Dispatch details */}
              <div className="space-y-2 bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Payment & Logistics</span>
                
                <div className="flex justify-between items-center text-slate-300">
                  <span>Method: <strong className="text-emerald-400">{ord.paymentMethod}</strong></span>
                  <span className="font-black text-sm text-white">{formatPrice(ord.total)}</span>
                </div>

                {ord.bkashTrxId && (
                  <p className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                    TrxID: {ord.bkashTrxId} ({ord.bkashNumber})
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Courier: <strong>{ord.courierName}</strong></span>
                    <button
                      onClick={() => {
                        setEditingTrackingId(ord.id);
                        setTempCourierName(ord.courierName);
                        setTempTrackingNum(ord.courierTrackingNumber);
                      }}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      Edit Courier
                    </button>
                  </div>

                  {editingTrackingId === ord.id ? (
                    <div className="flex gap-1.5 pt-1">
                      <select
                        value={tempCourierName}
                        onChange={(e: any) => setTempCourierName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1 text-white font-bold"
                      >
                        <option value="Steadfast Courier">Steadfast Courier</option>
                        <option value="Pathao Courier">Pathao Courier</option>
                        <option value="Paperfly">Paperfly</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Tracking ID..."
                        value={tempTrackingNum}
                        onChange={(e) => setTempTrackingNum(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-[10px] rounded p-1 text-white font-mono"
                      />

                      <button
                        onClick={() => handleSaveCourier(ord.id)}
                        className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="font-mono text-slate-400 text-[11px]">
                      Tracking #: <strong className="text-slate-200">{ord.courierTrackingNumber || 'Unassigned'}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

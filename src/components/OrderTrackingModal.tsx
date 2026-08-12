import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  PackageCheck,
  Truck,
  CheckCircle,
  Phone,
  AlertCircle,
  MapPin,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../utils/helpers';
import { fetchLiveTracking, TrackingDetailsResponse } from '../services/courierClient';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  darkMode: boolean;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  darkMode,
  initialOrderId = '',
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [foundOrder, setFoundOrder] = useState<Order | null>(
    initialOrderId ? orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null : null
  );
  const [liveTracking, setLiveTracking] = useState<TrackingDetailsResponse | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadTrackingInfo = async (order: Order) => {
    setLoadingTracking(true);
    try {
      const tracking = await fetchLiveTracking(order.courierTrackingNumber, order.courierName, order.id);
      setLiveTracking(tracking);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTracking(false);
    }
  };

  useEffect(() => {
    if (foundOrder) {
      loadTrackingInfo(foundOrder);
    }
  }, [foundOrder]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matched = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.shippingAddress.phone.includes(query) ||
        (o.courierTrackingNumber && o.courierTrackingNumber.toLowerCase().includes(query))
    );

    if (matched) {
      setFoundOrder(matched);
      setErrorMsg('');
    } else {
      setFoundOrder(null);
      setLiveTracking(null);
      setErrorMsg(`No active order found matching "${searchQuery}". Please check your Order ID (e.g., GDB-89421) or phone number.`);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const statuses: { label: OrderStatus; desc: string }[] = [
    { label: 'Pending', desc: 'Order logged & inventory reserved' },
    { label: 'Processing', desc: 'Quality checked & assigned to courier hub' },
    { label: 'Shipped', desc: 'Dispatched via Steadfast/Pathao Courier' },
    { label: 'Out for Delivery', desc: 'Assigned to delivery executive' },
    { label: 'Delivered', desc: 'Delivered & COD settled' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"></div>

      <div
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[90vh] flex flex-col z-10 ${
          darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Bangladeshi Courier Live Tracker</h2>
              <p className="text-[11px] text-slate-400">Real-time status from Steadfast & Pathao Courier APIs</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Input Form */}
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. GDB-89421), Tracking #, or Phone"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Live</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Found Order Card & Live Timeline */}
          {foundOrder ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-400 text-sm">Order #{foundOrder.id}</span>
                    <button
                      onClick={() => loadTrackingInfo(foundOrder)}
                      disabled={loadingTracking}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                      title="Refresh Courier Status"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingTracking ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Status: {foundOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recipient:</span>
                    <strong className="text-white">{foundOrder.shippingAddress.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Courier Partner:</span>
                    <strong className="text-cyan-400">{foundOrder.courierName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consignment Tracking #:</span>
                    <span className="font-mono font-extrabold text-amber-400">{foundOrder.courierTrackingNumber || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {foundOrder.paymentMethod === 'COD' ? 'COD Amount To Collect:' : 'Total Amount:'}
                    </span>
                    <strong className="text-emerald-400">
                      {formatPrice(foundOrder.paymentMethod === 'COD' ? (foundOrder.codAmount ?? foundOrder.total) : foundOrder.total)}
                    </strong>
                  </div>
                </div>

                {liveTracking?.riderName && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <UserCheck className="w-4 h-4" />
                      <span className="font-bold">{liveTracking.riderName}</span>
                    </div>
                    {liveTracking.riderPhone && (
                      <a href={`tel:${liveTracking.riderPhone}`} className="flex items-center gap-1 text-emerald-400 font-mono font-bold hover:underline">
                        <Phone className="w-3 h-3" />
                        <span>{liveTracking.riderPhone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Status Stepper Timeline */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                  <span>Live Courier API Event History</span>
                  {liveTracking?.location && (
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 lowercase">
                      <MapPin className="w-3 h-3" /> {liveTracking.location}
                    </span>
                  )}
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                  {statuses.map((st, idx) => {
                    const currentIdx = getStepIndex(foundOrder.status);
                    const isCompleted = idx + 1 <= currentIdx;
                    const isCurrent = idx + 1 === currentIdx;

                    return (
                      <div key={st.label} className="relative">
                        <div
                          className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <h4
                            className={`text-xs font-extrabold ${
                              isCurrent
                                ? 'text-emerald-400'
                                : isCompleted
                                ? 'text-white'
                                : 'text-slate-500'
                            }`}
                          >
                            {st.label}
                          </h4>
                          <p className="text-[11px] text-slate-400">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {liveTracking?.events && liveTracking.events.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Detailed Courier API Log Entries</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {liveTracking.events.map((ev, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between">
                          <div>
                            <span className="font-bold text-emerald-400">{ev.status}</span>
                            <p className="text-slate-400">{ev.description}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p>Type any Order ID above (e.g. <strong>GDB-89421</strong>) to view live courier tracking status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

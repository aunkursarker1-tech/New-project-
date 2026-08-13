import React, { useState, useEffect } from 'react';
import { Search, PackageCheck, Truck, CheckCircle, AlertCircle, MapPin, RefreshCw, Clock, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../utils/helpers';
import { fetchLiveTracking, TrackingDetailsResponse } from '../services/courierClient';

interface TrackOrderViewProps {
  orders: Order[];
  darkMode: boolean;
  initialOrderId?: string;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  orders,
  darkMode,
  initialOrderId = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [liveTracking, setLiveTracking] = useState<TrackingDetailsResponse | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto load tracking if initialOrderId is passed and matching
  useEffect(() => {
    if (initialOrderId) {
      const match = orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (match) {
        setFoundOrder(match);
        setSearchQuery(initialOrderId);
      }
    }
  }, [initialOrderId, orders]);

  const loadTrackingInfo = async (order: Order) => {
    setLoadingTracking(true);
    setErrorMsg('');
    try {
      const tracking = await fetchLiveTracking(order.courierTrackingNumber, order.courierName, order.id);
      setLiveTracking(tracking);
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to sync live courier tracking status. Showing offline database logs instead.');
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
      setErrorMsg(`No active order found matching "${searchQuery}". Check your Order ID (e.g. GDB-21444) or phone.`);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const statuses: { label: OrderStatus; desc: string }[] = [
    { label: 'Pending', desc: 'Order received & pending verification' },
    { label: 'Processing', desc: 'Item quality tested & packaged for transit' },
    { label: 'Shipped', desc: 'Dispatched to professional courier partner' },
    { label: 'Out for Delivery', desc: 'Assigned to regional hub courier agent' },
    { label: 'Delivered', desc: 'Order successfully delivered & COD completed' },
  ];

  const stepIdx = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-500 font-bold">Track Order</span>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h1 className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Live Courier Dispatch Tracker
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Input your purchase Order ID, tracking number, or shipping mobile phone to check real-time courier updates.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Order ID (e.g., GDB-21444), Tracking #, or Mobile"
            className={`flex-1 px-4 py-3 rounded-2xl text-xs font-mono font-bold outline-none border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {foundOrder && (
          <div className={`rounded-3xl border overflow-hidden transition-all ${
            darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Tracking Summary Header */}
            <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SECURE ORDER REFERENCE</p>
                <h3 className={`text-base font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {foundOrder.id}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    foundOrder.status === 'Cancelled' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {foundOrder.status}
                  </span>
                </h3>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-400">Courier Partner:</span>
                <p className="font-bold text-emerald-400">{foundOrder.courierName || 'Pending Courier Assignment'}</p>
                {foundOrder.courierTrackingNumber && (
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">AWB: {foundOrder.courierTrackingNumber}</p>
                )}
              </div>
            </div>

            {/* Timeline Map Grid */}
            <div className="p-6">
              {stepIdx === -1 ? (
                <div className="py-6 text-center text-rose-400 space-y-2">
                  <AlertCircle className="w-10 h-10 mx-auto" />
                  <h4 className="text-sm font-bold">This order is Cancelled</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    The item packages for this order have been cancelled and inventory released. If you think this is a mistake, contact our helpline.
                  </p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-slate-800">
                  {statuses.map((item, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepIdx >= stepNum;
                    const isCurrent = stepIdx === stepNum;

                    return (
                      <div key={item.label} className="relative pl-10 flex items-start gap-4">
                        {/* Circle Indicator */}
                        <div className={`absolute left-0 w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                            : isCurrent
                            ? 'bg-slate-950 border-emerald-500 text-emerald-400 font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px]">{stepNum}</span>}
                        </div>

                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-bold ${
                            isCompleted ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-slate-500'
                          }`}>
                            {item.label}
                          </h4>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Courier API Logs */}
            {foundOrder.courierTrackingNumber && (
              <div className={`p-5 border-t ${darkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50'}`}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loadingTracking ? 'animate-spin' : ''}`} />
                  Live Courier Tracking Logs ({foundOrder.courierName})
                </h4>

                {loadingTracking ? (
                  <p className="text-[11px] text-slate-400">Syncing updates with Steadfast/Pathao APIs...</p>
                ) : liveTracking && liveTracking.trackingEvents && liveTracking.trackingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {liveTracking.trackingEvents.map((ev, i) => (
                      <div key={i} className="text-xs flex gap-3 p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/50">
                        <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 mt-0.5">{ev.time}</span>
                        <div>
                          <p className="font-semibold text-slate-300">{ev.event}</p>
                          {ev.location && <p className="text-[10px] text-slate-500 mt-0.5">📍 Location: {ev.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">Order is pre-registered with courier. Live tracking codes will update as dispatch progresses.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

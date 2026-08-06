import React, { useState } from 'react';
import { Truck, CheckCircle2, RefreshCw, Key, ShieldCheck, Zap, ExternalLink, Send, ArrowUpRight, BarChart2, MapPin, Calculator, Store } from 'lucide-react';
import { Order, CourierApiConfig } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface CourierIntegrationSectionProps {
  darkMode: boolean;
  orders: Order[];
  onUpdateCourierInfo?: (orderId: string, courierName: any, trackingNumber: string) => void;
}

export const CourierIntegrationSection: React.FC<CourierIntegrationSectionProps> = ({
  darkMode,
  orders,
  onUpdateCourierInfo,
}) => {
  const [config, setConfig] = useState<CourierApiConfig>({
    steadfastApiKey: 'st_live_987412354a9b8c7d',
    steadfastSecret: 'st_sec_bd8812399',
    pathaoClientId: 'pth_client_441209',
    pathaoSecret: 'pth_sec_9012384712',
    redxApiKey: 'redx_api_live_88127394',
    autoSyncOrders: true,
    activeDefaultCourier: 'Pathao Courier',
  });

  // Pathao Store Specific Settings
  const [pathaoStoreId, setPathaoStoreId] = useState('pth_store_dhanmondi_01');
  const [pathaoPickupZone, setPathaoPickupZone] = useState('Dhanmondi Zone 12');
  const [pathaoCity, setPathaoCity] = useState('Dhaka');
  const [pathaoDeliveryType, setPathaoDeliveryType] = useState<'48 Hours' | 'Express Same Day'>('Express Same Day');

  // Rate Estimator State
  const [calcWeight, setCalcWeight] = useState<number>(0.5);
  const [calcCity, setCalcCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [estimatedFee, setEstimatedFee] = useState<number>(60);

  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const calculatePathaoFee = (weight: number, city: 'Dhaka' | 'Outside Dhaka') => {
    if (city === 'Dhaka') {
      return weight <= 0.5 ? 60 : 60 + Math.ceil(weight - 0.5) * 15;
    } else {
      return weight <= 0.5 ? 120 : 120 + Math.ceil(weight - 0.5) * 25;
    }
  };

  const handleWeightChange = (w: number, c: 'Dhaka' | 'Outside Dhaka') => {
    setCalcWeight(w);
    setCalcCity(c);
    setEstimatedFee(calculatePathaoFee(w, c));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Pathao Courier & Merchant Store API Settings Saved Successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSyncToCourier = (order: Order, courierName: 'Steadfast Courier' | 'Pathao Courier' | 'RedX') => {
    setSyncingOrderId(order.id);
    setTimeout(() => {
      const generatedTracking = `${courierName === 'Steadfast Courier' ? 'ST' : courierName === 'Pathao Courier' ? 'PTH' : 'RDX'}-${Math.floor(100000 + Math.random() * 900000)}`;
      if (onUpdateCourierInfo) {
        onUpdateCourierInfo(order.id, courierName as any, generatedTracking);
      }
      setSyncingOrderId(null);
      setSuccessMessage(`Order #${order.id} dispatched via ${courierName}! Tracking Number: ${generatedTracking}`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1000);
  };

  const pendingCourierOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-950 text-[10px] font-black uppercase tracking-wider">
              Pathao Official Partner
            </span>
            <h2 className="text-xl font-black">Pathao Courier API & Logistics Hub</h2>
          </div>
          <p className="text-xs text-rose-100 mt-1">
            Official OAuth integration with Pathao Merchant API for automated city parcel dispatch & rider tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <p className="text-[10px] uppercase text-rose-200 font-bold">Pathao Merchant Status</p>
            <p className="text-sm font-black text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Gold VIP Merchant
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Courier Partners API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pathao Courier Highlight */}
        <div className={`p-5 rounded-3xl border transition-all ring-2 ring-rose-500/50 ${
          darkMode ? 'bg-slate-900 border-rose-500/40' : 'bg-white border-rose-300'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-rose-500/30">
                PTH
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Pathao Courier API</h3>
                <span className="text-[10px] text-rose-400 font-bold">Primary Default Courier</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Live Synced</span>
          </div>
          <p className="text-[11px] text-slate-400">On-demand city rider dispatch, instant COD settlement & GPS tracking.</p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Merchant Store:</span>
            <span className="font-mono font-bold text-rose-400">{pathaoStoreId}</span>
          </div>
        </div>

        {/* Steadfast Courier */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                ST
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Steadfast Courier</h3>
                <span className="text-[10px] text-emerald-400 font-bold">Recommended for COD</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
          </div>
          <p className="text-[11px] text-slate-400">Next-day delivery across 64 districts with instant cash pickup.</p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">API Balance:</span>
            <span className="font-mono font-bold text-emerald-400">৳ 12,450.00</span>
          </div>
        </div>

        {/* RedX Logistics */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                RDX
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">RedX Logistics</h3>
                <span className="text-[10px] text-amber-400 font-bold">Nationwide Hub Network</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
          </div>
          <p className="text-[11px] text-slate-400">Deep coverage across remote Upazilas and Unions in BD.</p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Webhook Status:</span>
            <span className="font-mono font-bold text-amber-400">Listening (200 OK)</span>
          </div>
        </div>
      </div>

      {/* Pathao Delivery Rate Calculator Widget */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">Pathao Delivery Charge Estimator</h3>
              <p className="text-[11px] text-slate-400">Live API calculation for parcel weight and destination</p>
            </div>
          </div>
          <span className="text-xs font-black text-rose-400 font-mono">Official Pathao Pricing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
          <div>
            <label className="block text-slate-400 mb-1">Parcel Weight (kg)</label>
            <select
              value={calcWeight}
              onChange={(e) => handleWeightChange(Number(e.target.value), calcCity)}
              className={`w-full px-3.5 py-2 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
            >
              <option value={0.5}>Up to 0.5 kg (Small Gadget)</option>
              <option value={1.0}>1.0 kg (Headphones / Power Bank)</option>
              <option value={2.0}>2.0 kg (Monitor / Speaker Box)</option>
              <option value={5.0}>5.0 kg (Heavy Equipment)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Destination Zone</label>
            <select
              value={calcCity}
              onChange={(e) => handleWeightChange(calcWeight, e.target.value as any)}
              className={`w-full px-3.5 py-2 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
            >
              <option value="Dhaka">Inside Dhaka Metro (60 BDT)</option>
              <option value="Outside Dhaka">Outside Dhaka / District Hub (120 BDT)</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-rose-300 uppercase font-extrabold">Estimated Pathao Fee</p>
              <p className="text-lg font-black text-rose-400 font-mono">৳ {estimatedFee}.00</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-bold">Same-Day</span>
          </div>
        </div>
      </div>

      {/* Orders Ready for One-Click Dispatch */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 text-slate-100">
            <Send className="w-4 h-4 text-rose-400" />
            <span>Orders Ready for Pathao Courier Dispatch ({pendingCourierOrders.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-bold">1-Click Pathao Consignment API Sync</span>
        </div>

        <div className="divide-y divide-slate-800/60 overflow-x-auto">
          {pendingCourierOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">All orders have been dispatched to courier APIs!</div>
          ) : (
            pendingCourierOrders.map((order) => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-400">Order #{order.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {order.shippingAddress.division} ({order.shippingAddress.district})
                    </span>
                  </div>
                  <p className="text-slate-200 font-bold mt-0.5">{order.shippingAddress.fullName} • {order.shippingAddress.phone}</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-md">{order.shippingAddress.fullAddress}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-black text-emerald-400 mr-2">{formatPrice(order.total)}</span>

                  <button
                    onClick={() => handleSyncToCourier(order, 'Pathao Courier')}
                    disabled={syncingOrderId === order.id}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    {syncingOrderId === order.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
                    <span>Dispatch Pathao</span>
                  </button>

                  <button
                    onClick={() => handleSyncToCourier(order, 'Steadfast Courier')}
                    disabled={syncingOrderId === order.id}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-all disabled:opacity-50"
                  >
                    Steadfast
                  </button>

                  <button
                    onClick={() => handleSyncToCourier(order, 'RedX')}
                    disabled={syncingOrderId === order.id}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-all disabled:opacity-50"
                  >
                    RedX
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pathao & Courier API Configuration Form */}
      <form onSubmit={handleSaveConfig} className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <h3 className="font-black text-sm uppercase tracking-wider text-slate-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-rose-400" />
          <span>Pathao Merchant Credentials & Store Config</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
          <div>
            <label className="block text-slate-400 mb-1">Pathao Client ID</label>
            <input
              type="text"
              value={config.pathaoClientId}
              onChange={(e) => setConfig({ ...config, pathaoClientId: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Pathao Client Secret</label>
            <input
              type="password"
              value={config.pathaoSecret}
              onChange={(e) => setConfig({ ...config, pathaoSecret: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Pathao Store ID / Hub ID</label>
            <input
              type="text"
              value={pathaoStoreId}
              onChange={(e) => setPathaoStoreId(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'}`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/20 transition-all"
        >
          Save Pathao API Configuration
        </button>
      </form>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, RefreshCw, Key, ShieldCheck, Zap, Send, Calculator, AlertTriangle, Activity, Save } from 'lucide-react';
import { Order, CourierName } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import { checkCourierHealth, dispatchOrderToCourier, testCourierConnection, saveCourierSettings, getCourierSettings, CourierApiStatus } from '../../../services/courierClient';

interface CourierIntegrationSectionProps {
  darkMode: boolean;
  orders: Order[];
  onUpdateCourierInfo?: (orderId: string, courierName: CourierName, trackingNumber: string) => void;
}

export const CourierIntegrationSection: React.FC<CourierIntegrationSectionProps> = ({
  darkMode,
  orders,
  onUpdateCourierInfo,
}) => {
  const [courierHealth, setCourierHealth] = useState<CourierApiStatus[]>([]);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  // Selected Provider in Settings Form
  const [selectedProvider, setSelectedProvider] = useState<'Pathao' | 'Steadfast' | 'RedX' | 'Paperfly'>('Pathao');

  // Form Fields State per Provider
  const [formData, setFormData] = useState({
    client_id: 'pth_client_441209',
    client_secret: 'pth_sec_9012384712',
    username: '',
    password: '',
    store_id: 'pth_store_dhanmondi_01',
    sandbox: true,
    is_active: true,
  });

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  // Load health & settings on mount
  useEffect(() => {
    loadHealth();
    loadProviderSettings(selectedProvider);
  }, []);

  const loadHealth = async () => {
    setLoadingHealth(true);
    try {
      const health = await checkCourierHealth();
      setCourierHealth(health);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHealth(false);
    }
  };

  const loadProviderSettings = async (provider: string) => {
    try {
      const settings = await getCourierSettings(provider);
      if (settings) {
        setFormData({
          client_id: settings.client_id || '',
          client_secret: settings.client_secret || '',
          username: settings.username || '',
          password: settings.password || '',
          store_id: settings.store_id || '',
          sandbox: settings.sandbox !== undefined ? settings.sandbox : true,
          is_active: settings.is_active !== undefined ? settings.is_active : true,
        });
      }
    } catch (err) {
      console.error('Failed to load provider settings:', err);
    }
  };

  const handleProviderChange = (provider: 'Pathao' | 'Steadfast' | 'RedX' | 'Paperfly') => {
    setSelectedProvider(provider);
    setTestResult(null);
    loadProviderSettings(provider);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSave(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate fields
      if (!formData.client_id) {
        throw new Error('Client ID / API Key is required.');
      }

      const res = await saveCourierSettings({
        provider: selectedProvider,
        ...formData,
      });

      if (res.success) {
        setSuccessMessage(`✅ Successfully saved configuration and credentials for ${selectedProvider}!`);
      } else {
        throw new Error(res.message || 'Failed to save configuration');
      }
    } catch (err: any) {
      console.error('[Save Error]', err);
      setErrorMessage(err?.message || 'Failed to save courier settings.');
    } finally {
      setLoadingSave(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleTestConnection = async () => {
    setLoadingTest(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      const res = await testCourierConnection({
        provider: selectedProvider,
        ...formData,
      });
      setTestResult({
        success: res.success,
        message: res.message || `✅ Connection Successful to ${selectedProvider} API`,
      });
    } catch (err: any) {
      console.error('[Test Connection Error]', err);
      setTestResult({
        success: false,
        message: err?.message || `❌ Connection Failed: Unauthorized or invalid credentials for ${selectedProvider}`,
      });
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSyncToCourier = async (order: Order, courierName: CourierName) => {
    setSyncingOrderId(order.id);
    setErrorMessage('');
    try {
      const res = await dispatchOrderToCourier(order, courierName);
      if (res.success) {
        if (onUpdateCourierInfo) {
          onUpdateCourierInfo(order.id, res.courierName, res.trackingNumber);
        }
        setSuccessMessage(`Order #${order.id} dispatched via ${res.courierName}! Tracking ID: ${res.trackingNumber}`);
      } else {
        setErrorMessage(`Dispatch Error: ${res.message}`);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to dispatch: ${err?.message}`);
    } finally {
      setSyncingOrderId(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-950 text-[10px] font-black uppercase tracking-wider">
              Supabase & Secure API Hub
            </span>
            <h2 className="text-xl font-black">Courier Integration & API Credentials Management</h2>
          </div>
          <p className="text-xs text-rose-100 mt-1">
            Configure secure API keys, test handshake connections, and manage automated parcel dispatches for Pathao, Steadfast, RedX, and Paperfly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadHealth}
            disabled={loadingHealth}
            className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            <span>Ping Status</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Courier Settings Configuration Form */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} space-y-6 shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Courier API Credentials & Settings</h3>
              <p className="text-xs text-slate-400">Stored securely in Supabase `courier_settings` table</p>
            </div>
          </div>

          {/* Provider Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {(['Pathao', 'Steadfast', 'RedX', 'Paperfly'] as const).map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => handleProviderChange(prov)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProvider === prov
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider} Client ID / API Key / Token *
              </label>
              <input
                type="text"
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                placeholder={`Enter ${selectedProvider} API Key or Client ID`}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider} Client Secret / Password
              </label>
              <input
                type="password"
                value={formData.client_secret}
                onChange={(e) => setFormData({ ...formData, client_secret: e.target.value })}
                placeholder="Enter Secret Key"
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Username (Optional)</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Merchant Username"
                className={`w-full px-4 py-2.5 rounded-2xl text-xs outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Store ID / Warehouse ID</label>
              <input
                type="text"
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                placeholder="e.g. pth_store_dhanmondi_01"
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sandbox}
                onChange={(e) => setFormData({ ...formData, sandbox: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
              />
              <span className="text-xs font-bold text-slate-300">Sandbox / Testing Mode</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-xs font-bold text-slate-300">Active Integration</span>
            </label>
          </div>

          {/* Test Connection Result Box */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              testResult.success ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={loadingTest}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50 border border-slate-700"
            >
              {loadingTest ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> : <Activity className="w-4 h-4 text-cyan-400" />}
              <span>Test Connection</span>
            </button>

            <button
              type="submit"
              disabled={loadingSave}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50"
            >
              {loadingSave ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
              <span>Save Courier Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Orders Ready for Dispatch / Live Consignment */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-500" />
            <h3 className="font-extrabold text-sm">Orders Ready for Dispatch ({pendingOrders.length})</h3>
          </div>
          <span className="text-xs text-slate-400">Click dispatch to push order directly to courier API</span>
        </div>

        {pendingOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No pending orders awaiting dispatch.</p>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400 text-xs">#{ord.id}</span>
                    <span className="text-xs font-bold text-white">{ord.shippingAddress.fullName}</span>
                    <span className="text-[11px] text-slate-400">({ord.shippingAddress.district})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Total: {formatPrice(ord.total)} • {ord.paymentMethod}</p>
                </div>

                <div className="flex items-center gap-2">
                  {(['Pathao', 'Steadfast', 'RedX', 'Paperfly'] as const).map((courierName) => (
                    <button
                      key={courierName}
                      disabled={syncingOrderId === ord.id}
                      onClick={() => handleSyncToCourier(ord, `${courierName} Courier` as CourierName)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-[11px] border border-rose-500/30 flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      {syncingOrderId === ord.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      <span>{courierName}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

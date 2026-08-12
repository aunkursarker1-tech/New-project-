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
  const [selectedProvider, setSelectedProvider] = useState<'Steadfast' | 'Pathao'>('Steadfast');

  // Individual test connection state for Steadfast & Pathao cards
  const [loadingSteadfastTest, setLoadingSteadfastTest] = useState(false);
  const [steadfastTestResult, setSteadfastTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [loadingPathaoTest, setLoadingPathaoTest] = useState(false);
  const [pathaoTestResult, setPathaoTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form Fields State per Provider
  const [formData, setFormData] = useState({
    client_id: '',
    client_secret: '',
    username: '',
    password: '',
    store_id: '',
    sandbox: true,
    is_active: true,
  });

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  const handleTestSpecificConnection = async (provider: 'Steadfast' | 'Pathao') => {
    if (provider === 'Steadfast') {
      setLoadingSteadfastTest(true);
      setSteadfastTestResult(null);
      try {
        const res = await testCourierConnection({ provider: 'Steadfast', client_id: 'env_configured' });
        setSteadfastTestResult({
          success: res.success,
          message: res.message || '✅ Connection Successful to Steadfast API',
        });
      } catch (err: any) {
        setSteadfastTestResult({
          success: false,
          message: err?.message || '❌ Connection Failed to Steadfast API',
        });
      } finally {
        setLoadingSteadfastTest(false);
      }
    } else if (provider === 'Pathao') {
      setLoadingPathaoTest(true);
      setPathaoTestResult(null);
      try {
        const settings = await getCourierSettings('Pathao');
        const res = await testCourierConnection({
          provider: 'Pathao',
          client_id: settings?.client_id || formData.client_id,
          client_secret: settings?.client_secret || formData.client_secret,
          username: settings?.username || formData.username,
          password: settings?.password || formData.password,
          store_id: settings?.store_id || formData.store_id,
        });
        setPathaoTestResult({
          success: res.success,
          message: res.message || '✅ Connection Successful to Pathao API',
        });
      } catch (err: any) {
        setPathaoTestResult({
          success: false,
          message: err?.message || '❌ Connection Failed to Pathao API',
        });
      } finally {
        setLoadingPathaoTest(false);
      }
    }
  };

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
      } else {
        setFormData({
          client_id: '',
          client_secret: '',
          username: '',
          password: '',
          store_id: '',
          sandbox: true,
          is_active: true,
        });
      }
    } catch (err) {
      console.error('Failed to load provider settings:', err);
    }
  };

  const handleProviderChange = (provider: 'Steadfast' | 'Pathao') => {
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
      if (selectedProvider === 'Pathao') {
        if (!formData.client_id || !formData.client_secret || !formData.username || !formData.password || !formData.store_id) {
          throw new Error('For Pathao integration, Client ID, Client Secret, Username, Password, and Store ID are all required.');
        }
      } else {
        if (!formData.client_id || !formData.client_secret) {
          throw new Error('Steadfast API Key and Secret Key are required.');
        }
      }

      const res = await saveCourierSettings({
        provider: selectedProvider,
        ...formData,
      });

      if (res.success) {
        setSuccessMessage(`✅ Successfully saved configuration and credentials for ${selectedProvider}!`);
        await loadProviderSettings(selectedProvider);
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
            Configure secure API keys, test handshake connections, and manage automated parcel dispatches for Steadfast Courier and Pathao Courier.
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

      {/* Side-by-side Courier Integration Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STEADFAST COURIER CARD */}
        <div className={`p-6 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm space-y-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                SF
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white">STEADFAST COURIER</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Nationwide Express COD Parcel Delivery in Bangladesh
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ENABLED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Server Environment Secret:</span>
              <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Configured (Env)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Steadfast API Key and Secret Key are read securely from server-side environment variables (<code className="font-mono text-emerald-600 dark:text-emerald-400">STEADFAST_API_KEY</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">STEADFAST_SECRET_KEY</code>).
            </p>
          </div>

          {steadfastTestResult && (
            <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              steadfastTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
            }`}>
              {steadfastTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
              <span className="text-[11px]">{steadfastTestResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready for order consignment dispatch
            </span>

            <button
              type="button"
              onClick={() => handleTestSpecificConnection('Steadfast')}
              disabled={loadingSteadfastTest}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50 border border-slate-700/50 shadow-sm"
            >
              {loadingSteadfastTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Activity className="w-3.5 h-3.5 text-emerald-400" />}
              <span>TEST CONNECTION</span>
            </button>
          </div>
        </div>

        {/* PATHAO COURIER CARD */}
        <div className={`p-6 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm space-y-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                PTH
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white">PATHAO COURIER</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Express Same Day & Nationwide Courier Service
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ENABLED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Server & Supabase OAuth:</span>
              <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                Configured (OAuth)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Pathao Client ID, Secret, Username, Password and Store ID are managed securely via Supabase <code className="font-mono text-rose-600 dark:text-rose-400">courier_settings</code> and OAuth handshake.
            </p>
          </div>

          {pathaoTestResult && (
            <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              pathaoTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
            }`}>
              {pathaoTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
              <span className="text-[11px]">{pathaoTestResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready for order consignment dispatch
            </span>

            <button
              type="button"
              onClick={() => handleTestSpecificConnection('Pathao')}
              disabled={loadingPathaoTest}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50 border border-slate-700/50 shadow-sm"
            >
              {loadingPathaoTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Activity className="w-3.5 h-3.5 text-rose-400" />}
              <span>TEST CONNECTION</span>
            </button>
          </div>
        </div>
      </div>

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
            {(['Steadfast', 'Pathao'] as const).map((prov) => (
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
                {selectedProvider === 'Pathao' ? 'Pathao Client ID *' : 'Steadfast API Key *'}
              </label>
              <input
                type="text"
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                placeholder={selectedProvider === 'Pathao' ? 'Enter Pathao Client ID' : 'Enter Steadfast API Key'}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider === 'Pathao' ? 'Pathao Client Secret *' : 'Steadfast Secret Key *'}
              </label>
              <input
                type="password"
                required
                value={formData.client_secret}
                onChange={(e) => setFormData({ ...formData, client_secret: e.target.value })}
                placeholder={selectedProvider === 'Pathao' ? 'Enter Pathao Client Secret' : 'Enter Steadfast Secret Key'}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider === 'Pathao' ? 'Pathao Merchant Username / Email *' : 'Username (Optional)'}
              </label>
              <input
                type="text"
                required={selectedProvider === 'Pathao'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder={selectedProvider === 'Pathao' ? 'merchant@example.com' : 'Optional Username'}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider === 'Pathao' ? 'Pathao Account Password *' : 'Password (Optional)'}
              </label>
              <input
                type="password"
                required={selectedProvider === 'Pathao'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={selectedProvider === 'Pathao' ? 'Enter Pathao Account Password' : 'Optional Password'}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs outline-none border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {selectedProvider === 'Pathao' ? 'Pathao Store ID *' : 'Store ID / Warehouse ID (Optional)'}
              </label>
              <input
                type="text"
                required={selectedProvider === 'Pathao'}
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                placeholder={selectedProvider === 'Pathao' ? 'e.g. 123456 or pth_store_dhanmondi_01' : 'Optional Store ID'}
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
                  {(['Steadfast', 'Pathao'] as const).map((courierName) => (
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

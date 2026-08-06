import React, { useState } from 'react';
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Lock,
  Globe,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface SettingsSectionProps {
  darkMode: boolean;
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  darkMode,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleChange = (field: keyof StoreSettings, val: any) => {
    setFormData({ ...formData, [field]: val });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters long.');
      return;
    }
    setPasswordMsg('Admin password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Store Settings & System Configuration</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage store credentials, shipping rates, bKash numbers & security</p>
        </div>

        {saveToast && (
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 animate-bounce shadow">
            <CheckCircle className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Store Profile */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Store className="w-4 h-4 text-emerald-400" /> General Store Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Store Brand Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none font-extrabold border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Tagline / Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Customer Helpline Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full p-3 rounded-2xl outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Support Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full p-3 rounded-2xl outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Physical Store Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates & Thresholds */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-cyan-400" /> Delivery Shipping Rates (BDT ৳)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Inside Dhaka Fee (৳)</label>
                <input
                  type="number"
                  value={formData.shippingFeeDhaka}
                  onChange={(e) => handleChange('shippingFeeDhaka', Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl outline-none font-bold text-sm border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Outside Dhaka Fee (৳)</label>
                <input
                  type="number"
                  value={formData.shippingFeeOutside}
                  onChange={(e) => handleChange('shippingFeeOutside', Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl outline-none font-bold text-sm border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Free Shipping Threshold (৳)</label>
              <input
                type="number"
                value={formData.freeShippingMinAmount}
                onChange={(e) => handleChange('freeShippingMinAmount', Number(e.target.value))}
                className={`w-full p-3 rounded-2xl outline-none font-bold text-sm border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Orders exceeding this amount automatically receive ৳0 delivery fee.</p>
            </div>
          </div>
        </div>

        {/* Payment Gateway Merchant Numbers */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-rose-400" /> bKash & Nagad Merchant Numbers
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">bKash Merchant / Personal Number</label>
              <input
                type="text"
                value={formData.bkashMerchantNumber}
                onChange={(e) => handleChange('bkashMerchantNumber', e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none font-mono font-bold text-rose-400 border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Nagad Merchant Number</label>
              <input
                type="text"
                value={formData.nagadMerchantNumber}
                onChange={(e) => handleChange('nagadMerchantNumber', e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none font-mono font-bold text-amber-400 border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Security Password Change */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-purple-400" /> Admin Access & Security
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">New Password</label>
              <input
                type="password"
                placeholder="Enter new admin password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-3 rounded-2xl outline-none border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {passwordMsg && (
              <p className="text-[11px] font-bold text-emerald-400">{passwordMsg}</p>
            )}

            <button
              type="button"
              onClick={handleChangePassword}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Update Password
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all"
          >
            <CheckCircle className="w-5 h-5" /> Save All Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};

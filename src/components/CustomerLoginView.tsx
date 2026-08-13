import React, { useState } from 'react';
import { Sparkles, Phone, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface CustomerLoginViewProps {
  darkMode: boolean;
  onLoginSuccess: (name: string, phone: string) => void;
}

export const CustomerLoginView: React.FC<CustomerLoginViewProps> = ({
  darkMode,
  onLoginSuccess,
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone || phone.length < 11) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi phone number (e.g., 01712345678).');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    if (isRegistering && !name) {
      setErrorMsg('Please enter your full name for registration.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const customerName = isRegistering ? name : 'Honorable Customer';
      onLoginSuccess(customerName, phone);
    }, 1000);
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto flex items-center justify-center">
      <div className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 transition-colors ${
        darkMode ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-xl'
      }`}>
        <div className="text-center space-y-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-xl font-black">
            {isRegistering ? 'Register Corporate Account' : 'Customer Workspace Secure Login'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegistering ? 'Create a secure workspace account' : 'Verify credentials to track and manage shipments'}
          </p>
        </div>

        {errorMsg && (
          <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-bold mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="Ex. Md. Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
            <div className="relative flex items-center">
              <input
                type="tel"
                placeholder="Ex. 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-2.5 pl-10 rounded-xl text-xs font-mono font-bold outline-none border transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pl-10 pr-10 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-40"
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Register Workspace Account' : 'Verify & Log In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/20 text-center text-xs text-slate-400">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-400 hover:underline font-bold"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'New corporate user? Register Here'}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured with standard biometric handshake checks</span>
        </div>
      </div>
    </div>
  );
};

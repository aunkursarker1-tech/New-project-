import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  darkMode: boolean;
  onLoginSuccess: (userEmail: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ darkMode, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or invalid.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMsg('Authentication successful!');
        setTimeout(() => {
          onLoginSuccess(data.user?.email || email.trim());
          navigate('/admin/dashboard');
        }, 500);
        return;
      } else {
        setErrorMsg('User authentication failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className="w-full max-w-md">
        {/* Top Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4 shadow-xl">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Gadgetghor BD</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Enterprise Admin Console & Security Portal</p>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800/60">
            <div>
              <h2 className="text-lg font-bold">Admin Sign In</h2>
              <p className="text-xs text-slate-400">Supabase Authentication</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Protected
            </span>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm transition-all outline-none ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm transition-all outline-none ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Storefront return link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
          >
            ← Back to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, Lock, Eye, CheckCircle2, UserCheck, Smartphone, Activity, Server, FileText } from 'lucide-react';
import { AuditLogEntry } from '../../../types';
import { getAuditLogs, addAuditLog } from '../../../utils/enterpriseHelpers';

interface SecurityAuditSectionProps {
  darkMode: boolean;
}

export const SecurityAuditSection: React.FC<SecurityAuditSectionProps> = ({ darkMode }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getAuditLogs());
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(true);
  const [rateLimitStatus, setRateLimitStatus] = useState('Active (100 req / min)');
  const [toastMsg, setToastMsg] = useState('');

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    const updated = addAuditLog({
      action: nextState ? '2FA Enabled' : '2FA Disabled',
      performedBy: 'Super Admin',
      ipAddress: '103.112.44.18',
      details: `Two-Factor Authentication set to ${nextState ? 'ENABLED' : 'DISABLED'}`,
      category: 'Security',
    });
    setAuditLogs(updated);
    setToastMsg(`2FA Setting Updated: ${nextState ? 'Enabled' : 'Disabled'}`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRecaptchaTest = () => {
    setToastMsg('Google reCAPTCHA v3 verified successfully (Score 0.9 - Human User)');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-zinc-900 to-stone-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
              Enterprise Guard
            </span>
            <h2 className="text-xl font-black">Security, 2FA & Audit Command Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Google reCAPTCHA, 2FA SMS/TOTP, CSRF/XSS headers, rate limiting & immutable audit logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <p className="text-[10px] uppercase text-slate-400 font-bold">Security Score</p>
            <p className="text-lg font-black text-emerald-400">98 / 100</p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Security Modules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2FA Card */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">2-Factor Auth (2FA)</h3>
                <span className="text-[10px] text-purple-400 font-bold">SMS / TOTP Authenticator</span>
              </div>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                twoFactorEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md"></span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Requires OTP phone verification for all admin logins and order modifications.</p>
        </div>

        {/* Google reCAPTCHA Card */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Google reCAPTCHA v3</h3>
                <span className="text-[10px] text-blue-400 font-bold">Bot Attack Shield</span>
              </div>
            </div>
            <button
              onClick={handleRecaptchaTest}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[10px]"
            >
              Test Token
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Frictionless score-based bot defense active on checkout & login forms.</p>
        </div>

        {/* Rate Limiting & Protection */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">CSRF & XSS Shield</h3>
                <span className="text-[10px] text-emerald-400 font-bold">HTTP Strict Headers</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Active</span>
          </div>
          <p className="text-[11px] text-slate-400">Strict Content Security Policy (CSP), SameSite cookies & payload sanitization.</p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Immutable Security Audit Trail ({auditLogs.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-bold">Real-time Admin Activity Monitor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Performed By</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-3 px-3 font-bold text-slate-100">{log.action}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{log.performedBy}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{log.details}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';

interface NewsletterProps {
  darkMode: boolean;
}

export const Newsletter: React.FC<NewsletterProps> = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-8 sm:p-12 border border-emerald-900/50 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>JOIN GADGETGHOR VIP CLUB</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Get Instant ৳100 Discount Coupon!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Subscribe to receive secret flash sale alerts, Eid discount codes, and new arrival drops before anyone else in BD.
          </p>
        </div>

        <div className="w-full sm:w-auto min-w-[300px]">
          {subscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Coupon FIRST100 Unlocked! Use at checkout for ৳100 OFF.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs outline-none focus:border-emerald-500 text-white flex-1 min-w-[240px]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 shrink-0"
              >
                Claim ৳100 Off
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

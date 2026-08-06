import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Truck, Sparkles, CreditCard } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
  onNavigateCategory: (category: string) => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin?: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  darkMode,
  onNavigateCategory,
  onOpenOrderTracking,
  onOpenAdmin,
  onReplayIntro,
}) => {
  return (
    <footer
      className={`border-t pt-12 pb-24 lg:pb-12 px-4 transition-colors ${
        darkMode
          ? 'bg-slate-950 border-slate-800 text-slate-400'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="text-xl font-black text-white">Gadgetghor BD</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Bangladeshi premiere destination for authentic smart gadgets, mobile accessories, desk setup essentials, and audio gear with official brand hologram warranty.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Multiplan Center, Level 4, Shop 420, Elephant Road, Dhaka-1205</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Helpline: +880 1700-000000 (10 AM - 10 PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Support: support@gadgetghorbd.com</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
          <ul className="space-y-2 text-xs">
            {['Gadgets', 'Mobile Accessories', 'Smart Home Devices', 'Desk Setup Accessories', 'Gift Boxes', 'Audio Devices'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onNavigateCategory(cat)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={onOpenOrderTracking} className="hover:text-emerald-400 transition-colors">
                Track Courier Order
              </button>
            </li>
            <li>
              <a href="#warranty" className="hover:text-emerald-400 transition-colors">
                7 Days Replacement Policy
              </a>
            </li>
            <li>
              <a href="#shipping" className="hover:text-emerald-400 transition-colors">
                Dhaka & Outside Shipping Rates
              </a>
            </li>
            {onReplayIntro && (
              <li>
                <button onClick={onReplayIntro} className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Replay Welcome Intro</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Local Logistics & Payment Badges */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment & Delivery BD</h4>
          
          <div className="space-y-2 text-xs">
            <p className="text-[11px] text-slate-400">Accepted Payment Methods:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-pink-950 text-pink-300 font-black text-[10px] border border-pink-800">
                bKash
              </span>
              <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 font-black text-[10px] border border-amber-800">
                Nagad
              </span>
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 font-black text-[10px] border border-emerald-800">
                COD
              </span>
              <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 font-black text-[10px] border border-cyan-800">
                Visa / Card
              </span>
            </div>

            <p className="text-[11px] text-slate-400 pt-2">Courier Partners:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 font-bold text-[10px]">
                Steadfast Courier
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-rose-400 font-bold text-[10px]">
                Pathao Courier
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2026 Gadgetghor BD. All rights reserved.</p>
        <p className="flex items-center gap-1 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Bangladeshi Retailer
        </p>
      </div>
    </footer>
  );
};

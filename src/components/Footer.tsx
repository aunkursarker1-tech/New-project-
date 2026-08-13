import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Truck, Sparkles, CreditCard, Facebook, Youtube, ShieldAlert } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
  onNavigateCategory: (category: string) => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  darkMode,
  onNavigateCategory,
  onOpenOrderTracking,
  onOpenAdmin,
}) => {
  return (
    <footer
      className={`border-t pt-6 pb-20 lg:pb-6 px-4 transition-colors ${
        darkMode
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="text-lg font-black text-white uppercase tracking-tight">Gadget Corporate</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
            Bangladeshi premier destination for authentic smart gadgets, power adapters, fast GaN chargers, premium smart audio, and workspace setup gear with official holographic brand warranties.
          </p>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Multiplan Center, Level 4, Shop 420, Elephant Road, Dhaka-1205</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Corporate Helpline: +880 1700-000000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Business support: support@gadgetcorporate.com</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-white">Product Categories</h4>
          <ul className="space-y-1.5 text-[11px]">
            {['Gadgets', 'Mobile Accessories', 'Smart Home Devices', 'Desk Setup Accessories', 'Gift Boxes', 'Audio Devices'].map((cat) => (
              <li key={cat}>
                <Link
                  to="/shop"
                  onClick={() => onNavigateCategory(cat)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support policies */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-white">Corporate Support</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link to="/track-order" className="hover:text-emerald-400 transition-colors">
                Track Courier Shipments
              </Link>
            </li>
            <li>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">
                7 Days Replacement Policy
              </span>
            </li>
            <li>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">
                Corporate Delivery Fee Table
              </span>
            </li>
            {onOpenAdmin && (
              <li>
                <button onClick={onOpenAdmin} className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin Panel Workspace</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Local Payment Badges */}
        <div className="space-y-3">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-white mb-1.5">Accepted Payment Methods</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 font-bold text-[9px] border border-pink-900">
                bKash Merchant
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 font-bold text-[9px] border border-orange-900">
                Nagad Wallet
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[9px] border border-emerald-900">
                COD Handshake
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Courier Channels</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 font-bold text-[9px]">
                Pathao Logistics
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold text-[9px]">
                Steadfast Courier
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1.5">
        <p>© 2026 Gadget Corporate BD. All rights reserved.</p>
        <p className="flex items-center gap-1 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Hologram Gadget Distributor in BD
        </p>
      </div>
    </footer>
  );
};

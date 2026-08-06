import React, { useState } from 'react';
import { Target, Gift, MessageSquare, Send, CheckCircle2, TrendingUp, Users, ShoppingCart, Award, Sparkles, Flame } from 'lucide-react';
import { AbandonedCart, LoyaltyAccount } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface MarketingRecoverySectionProps {
  darkMode: boolean;
}

export const MarketingRecoverySection: React.FC<MarketingRecoverySectionProps> = ({ darkMode }) => {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([
    {
      id: 'ab-1',
      customerName: 'Tanvir Hossain',
      phone: '01711223344',
      items: [
        {
          product: {
            id: 'p-1',
            name: 'Baseus Blade 100W Power Bank',
            brand: 'Baseus',
            category: 'Gadgets',
            price: 5200,
            originalPrice: 6000,
            discountPercent: 13,
            rating: 4.8,
            reviewsCount: 42,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
            gallery: [],
            description: '',
            specs: {},
            warrantyInfo: '1 Year',
            sku: 'GG-BAS-100',
            availabilityDhaka: true,
            availabilityOutside: true,
            tags: [],
          },
          quantity: 1,
        },
      ],
      totalValue: 5200,
      abandonedAt: new Date(Date.now() - 1800000).toISOString(),
      recoveryStatus: 'Pending',
    },
    {
      id: 'ab-2',
      customerName: 'Nusrat Jahan',
      phone: '01899112233',
      items: [
        {
          product: {
            id: 'p-2',
            name: 'Anker Soundcore Motion+ Bluetooth Speaker',
            brand: 'Anker',
            category: 'Audio Devices',
            price: 9800,
            originalPrice: 11000,
            discountPercent: 11,
            rating: 4.9,
            reviewsCount: 88,
            stock: 8,
            image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
            gallery: [],
            description: '',
            specs: {},
            warrantyInfo: '1 Year',
            sku: 'GG-ANK-900',
            availabilityDhaka: true,
            availabilityOutside: true,
            tags: [],
          },
          quantity: 1,
        },
      ],
      totalValue: 9800,
      abandonedAt: new Date(Date.now() - 5400000).toISOString(),
      recoveryStatus: 'Pending',
    },
  ]);

  const [message, setMessage] = useState('');

  const handleSendRecoverySMS = (cartId: string, phone: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.id === cartId ? { ...c, recoveryStatus: 'SMS Sent' as const } : c))
    );
    setMessage(`Recovery SMS with 5% discount link dispatched to ${phone}!`);
    setTimeout(() => setMessage(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-purple-950 text-[10px] font-black uppercase tracking-wider">
              Growth Engine
            </span>
            <h2 className="text-xl font-black">Marketing & Abandoned Cart Recovery</h2>
          </div>
          <p className="text-xs text-purple-100 mt-1">
            Facebook Pixel, GA4, automated SMS recovery triggers & loyalty points engine
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <p className="text-[10px] uppercase text-purple-200 font-bold">Recovered Revenue</p>
            <p className="text-sm font-black text-white">৳ 18,450.00</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Analytics Pixels Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Facebook Pixel */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-100">Facebook Meta Pixel</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ID: 881290384</span>
          </div>
          <p className="text-[11px] text-slate-400">Tracking Purchase, AddToCart, ViewContent & InitiateCheckout events.</p>
        </div>

        {/* GA4 */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-100">Google Analytics 4</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">G-GG881290</span>
          </div>
          <p className="text-[11px] text-slate-400">Enhanced E-commerce telemetry and real-time active user tracking.</p>
        </div>

        {/* Loyalty Engine */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-100">Loyalty & Referral Hub</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">1 BDT = 1 Pt</span>
          </div>
          <p className="text-[11px] text-slate-400">Automatic cash back discount points & shareable referral codes.</p>
        </div>
      </div>

      {/* Abandoned Cart Recovery Table */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-purple-400" />
            <span>Abandoned Checkout Sessions ({abandonedCarts.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-bold">SMS / WhatsApp 1-Click Dispatches</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {abandonedCarts.map((cart) => (
            <div key={cart.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-100">{cart.customerName}</span>
                  <span className="font-mono text-slate-400">({cart.phone})</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Items: {cart.items.map((i) => i.product.name).join(', ')}
                </p>
                <p className="text-[10px] text-slate-500">
                  Abandoned: {new Date(cart.abandonedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-black text-emerald-400 text-sm">{formatPrice(cart.totalValue)}</span>

                <button
                  onClick={() => handleSendRecoverySMS(cart.id, cart.phone)}
                  disabled={cart.recoveryStatus === 'SMS Sent'}
                  className={`px-3.5 py-2 rounded-xl font-black text-[11px] flex items-center gap-1.5 transition-all ${
                    cart.recoveryStatus === 'SMS Sent'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>{cart.recoveryStatus === 'SMS Sent' ? 'SMS Sent ✓' : 'Send Recovery SMS'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Calendar,
  Percent,
  DollarSign,
  X
} from 'lucide-react';
import { Coupon } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface CouponsSectionProps {
  darkMode: boolean;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onToggleCouponActive?: (code: string) => void;
}

export const CouponsSection: React.FC<CouponsSectionProps> = ({
  darkMode,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  onToggleCouponActive,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('fixed');
  const [value, setValue] = useState(200);
  const [minSpend, setMinSpend] = useState(1500);
  const [description, setDescription] = useState('Flat BDT promo discount');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newCoupon: Coupon = {
      code: code.toUpperCase().trim(),
      discountType: type,
      value: Number(value),
      minSpend: Number(minSpend),
      description,
      expiryDate,
      usedCount: 0,
      active: true,
    };

    onAddCoupon(newCoupon);
    setShowModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Promotional Coupon & Voucher Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">Create percentage or flat BDT discount codes with minimum spend thresholds</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Create Voucher Code
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.code}
            className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono font-black text-lg text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  {c.code}
                </span>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  c.discountType === 'percentage'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {c.discountType === 'percentage' ? `${c.value}% OFF` : `৳${c.value} OFF`}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">{c.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Min. Spend</span>
                  <p className="font-bold text-slate-200">{formatPrice(c.minSpend)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Expires</span>
                  <p className="font-mono text-amber-400">{c.expiryDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 text-xs">
              <span className="text-slate-400 font-bold text-[11px]">
                Usage: {c.usedCount || 0} redeemed
              </span>

              <button
                onClick={() => onDeleteCoupon(c.code)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                title="Delete Voucher"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold">Create New Coupon Code</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDGIFT2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-black text-sm uppercase outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                  >
                    <option value="fixed">Flat Amount (৳)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Minimum Spend Requirement (৳)</label>
                <input
                  type="number"
                  required
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Offer Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

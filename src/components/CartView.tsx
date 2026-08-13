import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Tag } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { formatPrice } from '../utils/helpers';

interface CartViewProps {
  cartItems: CartItem[];
  darkMode: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyCoupon: (code: string) => Promise<boolean>;
  appliedCoupon: Coupon | null;
  onProceedToCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  darkMode,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  appliedCoupon,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Coupon discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplying(true);
    setPromoError('');
    setPromoSuccess(false);

    try {
      const ok = await onApplyCoupon(promoCode.trim());
      if (ok) {
        setPromoSuccess(true);
      } else {
        setPromoError('Invalid coupon code or minimum purchase not met.');
      }
    } catch (err) {
      setPromoError('Coupon expired or invalid.');
    } finally {
      setIsApplying(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your Shopping Bag is empty</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Looks like you haven't added any premium gadgets to your bag yet. Explore our curated catalog of authentic chargers, smart audio, and desk setups.
          </p>
          <a
            href="/shop"
            className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
          >
            Start Discovering Gadgets
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-500 font-bold">Shopping Bag</span>
      </div>

      <h1 className={`text-2xl sm:text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Your Shopping Bag <span className="text-emerald-400">({cartItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Items list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`rounded-3xl border overflow-hidden ${
            darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor || ''}`} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Thumbnail & Meta */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-950/20 border border-slate-300 dark:border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className={`text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.product.name}
                      </h3>
                      <p className="text-[10px] font-bold text-emerald-400 mt-0.5">{item.product.brand}</p>
                      {item.selectedColor && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/40">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-xs font-bold text-emerald-400">{formatPrice(item.product.price)}</span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-[10px] text-slate-400 line-through mt-0.5">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-800 overflow-hidden bg-slate-800/20 shrink-0">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block min-w-[70px]">
                      <span className="text-xs font-black text-slate-200">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all shrink-0"
                      title="Remove gadget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'}`}>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-[10px]">
                <p className="font-bold">100% Genuine Tech</p>
                <p className="text-slate-400">Hologram Verification</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-[10px]">
                <p className="font-bold">Same-Day Shipping</p>
                <p className="text-slate-400">Orders before 4 PM</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'}`}>
              <RotateCcw className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-[10px]">
                <p className="font-bold">7-Day Free Claim</p>
                <p className="text-slate-400">Manufacturing defects replacement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-black uppercase tracking-wider mb-4 border-b border-slate-800/20 pb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-slate-400 font-semibold mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-slate-200">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon Discount ({appliedCoupon?.code})
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Shipping Fees</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-slate-800/30 pt-3 flex justify-between text-sm font-black">
                <span className={darkMode ? 'text-white' : 'text-slate-800'}>Grand Total</span>
                <span className="text-emerald-400 text-lg font-black">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            <form onSubmit={handleApplyPromo} className="mb-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo/Coupon Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold outline-none border transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors disabled:opacity-40"
                >
                  Apply
                </button>
              </div>

              {promoSuccess && (
                <p className="text-[10px] text-emerald-400 font-bold mt-1.5">✓ Coupon code applied successfully!</p>
              )}
              {promoError && (
                <p className="text-[10px] text-rose-500 font-bold mt-1.5">{promoError}</p>
              )}
            </form>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

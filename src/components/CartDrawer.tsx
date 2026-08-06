import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  CheckCircle,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { formatPrice, getDeliveryFee } from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  darkMode: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  deliveryDivision: string;
  setDeliveryDivision: (division: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  darkMode,
  onUpdateQuantity,
  onRemoveItem,
  coupons,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  deliveryDivision,
  setDeliveryDivision,
}) => {
  if (!isOpen) return null;

  const [inputCouponCode, setInputCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = cartItems.length > 0 ? getDeliveryFee(deliveryDivision) : 0;

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Free shipping threshold for Dhaka (৳2000)
  const freeShippingThreshold = 2000;
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const isDhaka = deliveryDivision.toLowerCase().includes('dhaka');
  const isFreeShipping = isDhaka && subtotal >= freeShippingThreshold;

  const finalShippingFee = isFreeShipping ? 0 : shippingFee;
  const total = Math.max(0, subtotal + finalShippingFee - discountAmount);

  const handleApplyInputCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCouponCode.trim()) return;
    const found = coupons.find((c) => c.code.toUpperCase() === inputCouponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid promo coupon code');
      return;
    }
    if (subtotal < found.minSpend) {
      setCouponError(`Minimum spend for ${found.code} is ${formatPrice(found.minSpend)}`);
      return;
    }
    setCouponError('');
    onApplyCoupon(found.code);
    setInputCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer */}
      <div
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ${
          darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Your Cart</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cartItems.length > 0 && isDhaka && (
          <div className="bg-emerald-950/60 p-3 border-b border-emerald-900/40 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Congratulations! You unlocked FREE Dhaka Delivery!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-300 mb-1">
                  <span>Free Dhaka Shipping Progress</span>
                  <span className="text-emerald-400">Add {formatPrice(freeShippingNeeded)} more</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold line-clamp-1 leading-snug">{item.product.name}</h4>
                  {item.selectedColor && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Color: {item.selectedColor}
                    </span>
                  )}
                  <div className="text-xs font-black text-emerald-400 mt-1">
                    {formatPrice(item.product.price)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded hover:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-300"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded hover:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-300"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold">
                      Sub: {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 text-slate-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Your shopping cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Discover trending authentic gadgets with official warranty and add them to your cart!
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className={`p-4 border-t space-y-3 shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
            
            {/* Delivery Location Switch */}
            <div className="flex items-center justify-between text-xs font-semibold bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-cyan-400" /> Delivery Area:
              </span>
              <select
                value={deliveryDivision}
                onChange={(e) => setDeliveryDivision(e.target.value)}
                className="bg-slate-800 text-emerald-400 font-bold px-2 py-1 rounded-lg outline-none text-xs"
              >
                <option value="Dhaka">Dhaka City (৳60)</option>
                <option value="Chittagong">Outside Dhaka (৳120)</option>
              </select>
            </div>

            {/* Coupons Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon.code}' Applied</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-[11px] font-bold text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyInputCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCouponCode}
                    onChange={(e) => setInputCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. BKASH200)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs uppercase outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}

              {/* Recommended Coupon Pills */}
              {!appliedCoupon && (
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">Try:</span>
                  {coupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => onApplyCoupon(c.code)}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold border border-slate-700 shrink-0"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Items Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Charge</span>
                <span className="font-semibold">
                  {finalShippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    formatPrice(finalShippingFee)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-emerald-400 text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

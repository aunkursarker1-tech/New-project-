import React from 'react';
import { CartItem, Coupon, Order } from '../types';
import { OnePageCheckout } from './checkout/OnePageCheckout';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  darkMode: boolean;
  appliedCoupon: Coupon | null;
  onOrderPlaced: (order: Order) => void;
  initialDivision?: string;
  onUpdateCartQuantity?: (productId: string, quantity: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  darkMode,
  appliedCoupon,
  onOrderPlaced,
  initialDivision = 'Dhaka',
  onUpdateCartQuantity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Darkened Backdrop with Blur */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"></div>

      {/* Modal Card Shell */}
      <div
        className={`relative w-full max-w-5xl my-auto z-10 max-h-[96vh] overflow-y-auto rounded-3xl shadow-2xl border ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <OnePageCheckout
          cartItems={cartItems}
          darkMode={darkMode}
          appliedCoupon={appliedCoupon}
          onOrderPlaced={onOrderPlaced}
          onUpdateCartQuantity={onUpdateCartQuantity}
          onClose={onClose}
          initialDivision={initialDivision}
        />
      </div>
    </div>
  );
};

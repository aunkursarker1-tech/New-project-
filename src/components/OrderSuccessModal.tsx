import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  Phone,
  Download,
  Share2,
  PackageCheck,
  MessageCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/helpers';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  darkMode: boolean;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  darkMode,
  onTrackOrder,
}) => {
  if (!order) return null;

  useEffect(() => {
    // Fire festive confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
    });
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hello Gadgetghor BD! I just placed Order #${order.id} for ${formatPrice(
      order.total
    )} via ${order.paymentMethod}. Please confirm my shipment!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"></div>

      <div
        className={`relative w-full max-w-xl rounded-3xl shadow-2xl border p-6 sm:p-8 text-center z-10 overflow-hidden ${
          darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Glowing Success Ring */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto mb-4 shadow-2xl shadow-emerald-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-500/30">
          ORDER CONFIRMED 🎉
        </span>

        <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
          Thank You For Shopping!
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Your order has been logged into our inventory system and dispatched to courier.
        </p>

        {/* Order Details Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Order Number:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">{order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Payment Method:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Courier Partner:</span>
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> {order.courierName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Tracking Code:</span>
            <span className="font-mono font-bold text-slate-200">{order.courierTrackingNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Estimated Arrival:</span>
            <span className="font-bold text-amber-400">{order.estimatedDelivery}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-black">
            <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD) Amount:' : 'Total Paid Amount:'}</span>
            <span className="text-emerald-400 text-base">
              {formatPrice(order.paymentMethod === 'COD' ? (order.codAmount ?? order.total) : order.total)}
            </span>
          </div>
        </div>

        {/* Instant WhatsApp Confirmation Button */}
        <div className="mt-6 space-y-3">
          <a
            href={`https://wa.me/8801700000000?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Confirm Order Instantly via WhatsApp</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onTrackOrder(order.id);
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Track Order</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:brightness-110"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Order, StoreSettings } from '../../types';
import { formatPrice } from '../../utils/helpers';

interface InvoiceModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col border border-slate-200">
        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Official Store Invoice — #{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body Printable */}
        <div ref={printRef} className="p-8 space-y-8 bg-white text-slate-900 font-sans print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  GG
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{settings.storeName}</h1>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">{settings.tagline}</p>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {settings.address}</p>
                <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {settings.phone}</p>
                <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {settings.email}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-100 text-emerald-800 inline-block mb-1">
                INVOICE
              </span>
              <h2 className="text-lg font-mono font-black text-slate-900">#{order.id}</h2>
              <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-slate-500">Payment: <strong className="text-slate-800">{order.paymentMethod} ({order.paymentStatus})</strong></p>
              {order.bkashTrxId && (
                <p className="text-xs text-emerald-700 font-mono font-semibold">TrxID: {order.bkashTrxId}</p>
              )}
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
            <div>
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Billed & Shipped To</h3>
              <p className="font-bold text-slate-900 text-sm mb-1">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">📞 {order.shippingAddress.phone}</p>
              {order.shippingAddress.email && <p className="text-slate-600">✉️ {order.shippingAddress.email}</p>}
              <p className="text-slate-700 mt-1">{order.shippingAddress.fullAddress}</p>
              <p className="text-slate-600 font-medium">{order.shippingAddress.thana}, {order.shippingAddress.district}, {order.shippingAddress.division}</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Logistics & Courier</h3>
              <p className="text-slate-700">Courier Partner: <strong className="text-slate-900">{order.courierName}</strong></p>
              <p className="text-slate-700 font-mono mt-0.5">Tracking No: <strong>{order.courierTrackingNumber || 'Pending'}</strong></p>
              <p className="text-slate-700 mt-0.5">Est. Delivery: <strong>{order.estimatedDelivery}</strong></p>
              {order.shippingAddress.notes && (
                <p className="mt-2 text-[11px] italic text-slate-500 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  Note: "{order.shippingAddress.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Item Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      {item.selectedColor && (
                        <span className="text-[10px] text-slate-500">Color: {item.selectedColor}</span>
                      )}
                      <span className="text-[10px] text-slate-400 block font-mono">SKU: {item.product.sku}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">{formatPrice(item.product.price)}</td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900">{formatPrice(item.product.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-xs space-y-1">
              <p className="font-bold text-slate-800">Return & Replacement Policy:</p>
              <p>7 Days replacement guarantee for official manufacturing defects with proof of purchase invoice.</p>
              <div className="pt-2 flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle className="w-4 h-4" /> Authentic Gadget Verified
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Delivery Fee</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer stamp */}
          <div className="pt-6 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400">
            <p>Thank you for shopping with Gadgetghor BD — www.gadgetghorbd.com</p>
            <p className="mt-0.5">This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

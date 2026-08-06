import React from 'react';
import { X, Shuffle, ShoppingBag, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  darkMode: boolean;
  onRemoveCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  darkMode,
  onRemoveCompare,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"></div>

      <div
        className={`relative w-full max-w-5xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 ${
          darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Gadget Spec Comparison</h2>
              <p className="text-[11px] text-slate-400">Comparing {compareProducts.length} Selected Products</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto">
          {compareProducts.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[600px] text-xs">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-950/40 text-slate-400 font-bold w-36 border-b border-slate-800">
                    Feature
                  </th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-3 border-b border-slate-800 text-center min-w-[180px]">
                      <div className="relative group">
                        <button
                          onClick={() => onRemoveCompare(p.id)}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-rose-500 text-white hover:scale-110"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded-xl mx-auto mb-2 border border-slate-800"
                        />
                        <h4 className="font-extrabold text-xs line-clamp-2 text-white">{p.name}</h4>
                        <div className="text-sm font-black text-emerald-400 mt-1">{formatPrice(p.price)}</div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="mt-2 w-full py-1.5 px-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Add to Cart
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-slate-950/20">Brand</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-slate-200">
                      {p.brand}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-slate-950/20">Category</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-semibold text-emerald-400">
                      {p.category}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-slate-950/20">Rating</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-amber-400">
                      ★ {p.rating} ({p.reviewsCount} reviews)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-slate-950/20">Warranty</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-semibold text-cyan-300">
                      {p.warrantyInfo}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-slate-950/20">Dhaka Availability</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        Same Day Express
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Shuffle className="w-10 h-10 mx-auto mb-2 text-slate-500" />
              <p>No products selected for comparison yet.</p>
              <p className="text-[11px] mt-1 text-slate-500">Click the compare icon on product cards to view side-by-side specs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

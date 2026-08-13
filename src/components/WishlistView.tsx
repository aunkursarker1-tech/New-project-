import React from 'react';
import { Heart, Trash2, ShoppingBag, Eye, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';

interface WishlistViewProps {
  wishlistProducts: Product[];
  darkMode: boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistProducts,
  darkMode,
  onAddToCart,
  onRemoveFromWishlist,
  onQuickView,
}) => {
  if (wishlistProducts.length === 0) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your Wishlist is empty</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't saved any gadgets yet. Find your favorite power banks, speakers, or chargers and tap the heart icon to save them here.
          </p>
          <a
            href="/shop"
            className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
          >
            Browse Authentic Tech
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
        <span className="text-slate-500 font-bold">Wishlist</span>
      </div>

      <h1 className={`text-2xl sm:text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Saved Gadgets <span className="text-rose-400">({wishlistProducts.length})</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className={`group rounded-2xl border p-4 flex gap-4 hover:-translate-y-1 transition-all duration-300 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Image Preview */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-950/20 border border-slate-300 dark:border-slate-800 shrink-0 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.discountPercent > 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[9px]">
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            {/* details & Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400">{product.brand}</span>
                <h3 className={`text-xs font-bold leading-snug truncate mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`} title={product.name}>
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-black text-emerald-400">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-slate-500 line-through font-semibold">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-1.5 pt-2">
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-emerald-400 active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-3 h-3 shrink-0" />
                  <span>Add</span>
                </button>

                <button
                  onClick={() => onQuickView(product)}
                  className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40"
                  title="Quick view details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRemoveFromWishlist(product)}
                  className="p-1.5 rounded-xl border border-rose-500/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 ml-auto"
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

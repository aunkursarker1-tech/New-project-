import React from 'react';
import { Shuffle, Trash2, ShoppingBag, X, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';

interface CompareViewProps {
  compareProducts: Product[];
  darkMode: boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCompare: (product: Product) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareProducts,
  darkMode,
  onAddToCart,
  onRemoveFromCompare,
}) => {
  if (compareProducts.length === 0) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-cyan-400">
            <Shuffle className="w-8 h-8" />
          </div>
          <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your Comparison List is empty</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't added any products to compare yet. Browse our smart gadgets and select the compare button to see specs side by side.
          </p>
          <a
            href="/shop"
            className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
          >
            Start Comparing Gadgets
          </a>
        </div>
      </div>
    );
  }

  // Gather unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set<string>(
      compareProducts.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  ) as string[];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-500 font-bold">Compare Products</span>
      </div>

      <h1 className={`text-2xl sm:text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Compare Gadgets <span className="text-cyan-400">({compareProducts.length})</span>
      </h1>

      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="min-w-[700px] divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          {/* Header row: Product Cards preview */}
          <div className={`grid grid-cols-12 gap-4 p-5 ${darkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <div className="col-span-3 flex flex-col justify-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">PRODUCT MATRIX</h3>
              <p className="text-[11px] text-slate-500 mt-1">Side by side specifications sheets comparison</p>
            </div>

            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 relative space-y-3">
                <button
                  onClick={() => onRemoveFromCompare(p)}
                  className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="w-20 h-20 rounded-xl bg-slate-950/20 border border-slate-300 dark:border-slate-800 overflow-hidden flex items-center justify-center mx-auto">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>

                <div className="text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{p.brand}</span>
                  <h4 className={`text-xs font-black truncate mt-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{p.name}</h4>
                </div>

                <button
                  onClick={() => onAddToCart(p)}
                  className="w-full py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1 hover:brightness-110"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy/Add</span>
                </button>
              </div>
            ))}

            {/* Empty slots placeholders if comparison list has fewer than 3 items */}
            {Array.from({ length: Math.max(0, 3 - compareProducts.length) }).map((_, idx) => (
              <div key={idx} className="col-span-3 border border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center py-8 text-slate-500 text-xs">
                <span>Add gadget...</span>
              </div>
            ))}
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold items-center">
            <div className="col-span-3 text-slate-400 uppercase tracking-wider">Price BDT</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 text-emerald-400 font-extrabold text-sm text-center">
                {formatPrice(p.price)}
              </div>
            ))}
          </div>

          {/* Brand Row */}
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold items-center">
            <div className="col-span-3 text-slate-400 uppercase tracking-wider">Manufacturer</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 text-slate-300 text-center font-bold">
                {p.brand}
              </div>
            ))}
          </div>

          {/* Ratings Row */}
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold items-center">
            <div className="col-span-3 text-slate-400 uppercase tracking-wider">Rating</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-amber-500">{p.rating}</span>
                <span className="text-slate-500 text-[10px]">({p.reviewsCount})</span>
              </div>
            ))}
          </div>

          {/* Categories Row */}
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold items-center">
            <div className="col-span-3 text-slate-400 uppercase tracking-wider">Category</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 text-slate-300 text-center">
                {p.category}
              </div>
            ))}
          </div>

          {/* Stock Availability Row */}
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold items-center">
            <div className="col-span-3 text-slate-400 uppercase tracking-wider">Availability</div>
            {compareProducts.map((p) => (
              <div key={p.id} className="col-span-3 text-center">
                <span className={`px-2 py-0.5 rounded text-[10px] ${p.stock > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                  {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>
            ))}
          </div>

          {/* Dynamic Specifications Rows */}
          {allSpecKeys.map((key) => (
            <div key={key} className="grid grid-cols-12 gap-4 p-4 text-xs font-medium items-center">
              <div className="col-span-3 text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              {compareProducts.map((p) => {
                const specValue = p.specs?.[key] || 'N/A';
                return (
                  <div key={p.id} className="col-span-3 text-center text-slate-300 font-semibold truncate" title={String(specValue)}>
                    {String(specValue)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

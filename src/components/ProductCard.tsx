import React from 'react';
import { Star, Heart, Shuffle, Eye, ShoppingBag, Check, Shield, Truck } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  darkMode: boolean;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  isWishlisted: boolean;
  isCompared: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  darkMode,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  onQuickView,
  onBuyNow,
  isWishlisted,
  isCompared,
}) => {
  return (
    <div
      className={`group relative rounded-xl border overflow-hidden transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1 active:scale-[0.99] ${
        darkMode
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/10'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'
      }`}
    >
      {/* Image & Badges Box */}
      <div className="relative w-full aspect-square bg-slate-950/20 overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount & Special Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] sm:text-[11px] shadow-md tracking-wider">
              -{product.discountPercent}%
            </span>
          )}

          {product.isFlashSale && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-md">
              ⚡ Flash
            </span>
          )}

          {product.isBestSeller && !product.isFlashSale && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-md">
              Top Seller
            </span>
          )}
        </div>

        {/* Action Buttons Floating Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          {/* Wishlist Icon Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border shadow-md transition-all active:scale-90 ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 border-white/10 hover:text-white'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-slate-300 border border-white/10 hover:text-white backdrop-blur-md shadow-md transition-all hidden sm:block"
            title="Quick View Specs"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Brand Tag */}
        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[9px] sm:text-[10px] font-medium text-slate-300 flex items-center gap-1">
          <Shield className="w-2.5 h-2.5 text-green-500 shrink-0" />
          <span className="truncate max-w-[80px] sm:max-w-none">{product.brand}</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-0.5">
            <span className="font-semibold text-[#007A58] truncate max-w-[90px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-bold text-[9px] sm:text-[10px]">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>{product.rating}</span>
              <span className="text-slate-500 text-[9px] hidden sm:inline">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title (Max 2 lines) */}
          <button
            onClick={() => onQuickView(product)}
            className="text-left w-full group-hover:text-[#007A58] transition-colors"
          >
            <h3 className={`text-[11px] sm:text-[12.5px] font-bold line-clamp-2 leading-tight min-h-[1.75rem] sm:min-h-[2.1rem] ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {product.name}
            </h3>
          </button>
        </div>

        {/* Stock Status Bar */}
        <div className="mt-1">
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium mb-0.5">
            <span className="text-green-600 flex items-center gap-0.5 truncate">
              <Truck className="w-2.5 h-2.5 shrink-0" /> In Stock
            </span>
            <span className="font-bold text-rose-500 shrink-0">{product.stock} left</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#007A58] rounded-full"
              style={{ width: `${Math.min(100, (product.stock / 30) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Price & Buy Button Row */}
        <div className="mt-2 pt-1.5 border-t border-slate-800/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-[13px] sm:text-[14.5px] font-black text-[#007A58] leading-none">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[9px] sm:text-[10px] text-slate-400 line-through mt-0.5 font-medium">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto">
            {onBuyNow && (
              <button
                onClick={() => onBuyNow(product)}
                className="flex-1 sm:flex-initial px-1.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] transition-all active:scale-95 text-center"
                title="1-Click Express Buy"
              >
                Buy Now
              </button>
            )}

            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 sm:flex-initial px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-[#007A58] text-slate-950 font-bold text-[10px] sm:text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-0.5"
            >
              <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

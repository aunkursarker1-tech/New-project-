import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FlashSaleSectionProps {
  products: Product[];
  darkMode: boolean;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  darkMode,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  onQuickView,
  wishlistIds,
  compareIds,
}) => {
  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-4 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Banner Box */}
      <div className="rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 p-4 sm:p-5 border border-rose-900/50 shadow-md relative overflow-hidden mb-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-slate-950 font-black shadow-md shadow-rose-600/30 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-extrabold text-[9px] tracking-wider uppercase">
                  LIMITED TIME
                </span>
                <span className="text-[10px] text-rose-300 font-bold">Up to 45% Off</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
                24 Hours Flash Deals ⚡
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-lg border border-rose-500/30 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-300 mr-1 hidden sm:inline">Ends In:</span>

            <div className="flex items-center gap-1">
              <div className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded-md border border-rose-800 text-center font-mono font-bold text-xs min-w-[28px]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-rose-400 font-bold text-xs">:</span>
              <div className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded-md border border-rose-800 text-center font-mono font-bold text-xs min-w-[28px]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-rose-400 font-bold text-xs">:</span>
              <div className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded-md border border-rose-800 text-center font-mono font-bold text-xs min-w-[28px]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {flashProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            darkMode={darkMode}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onAddToCompare={onAddToCompare}
            onQuickView={onQuickView}
            isWishlisted={wishlistIds.includes(product.id)}
            isCompared={compareIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

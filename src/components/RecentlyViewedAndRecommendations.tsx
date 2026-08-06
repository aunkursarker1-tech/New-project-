import React, { useState } from 'react';
import { History, Sparkles, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { getRecentlyViewedProductIds } from '../utils/enterpriseHelpers';

interface RecentlyViewedAndRecommendationsProps {
  darkMode: boolean;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
}

export const RecentlyViewedAndRecommendations: React.FC<RecentlyViewedAndRecommendationsProps> = ({
  darkMode,
  products,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  onQuickView,
  onBuyNow,
  wishlistIds,
  compareIds,
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'recently_viewed'>('recommendations');
  const [notifyModalProduct, setNotifyModalProduct] = useState<Product | null>(null);
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Recently Viewed Products
  const recentlyViewedIds = getRecentlyViewedProductIds();
  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id));

  // AI Recommendations (Products with high ratings / bestsellers / flash sale)
  const aiRecommendedProducts = products
    .filter((p) => p.rating >= 4.8 || p.isBestSeller || p.isFlashSale)
    .slice(0, 6);

  const displayProducts = activeTab === 'recently_viewed' ? recentlyViewedProducts : aiRecommendedProducts;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPhone) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
      setNotifyModalProduct(null);
      setNotifyPhone('');
    }, 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className={`p-6 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-100">Smart Shopping Assistant</h2>
              <p className="text-xs text-slate-400">Tailored AI Recommendations & Browsing History</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'recommendations'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Recommended
            </button>

            <button
              onClick={() => setActiveTab('recently_viewed')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'recently_viewed'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Recently Viewed ({recentlyViewedProducts.length})
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            {activeTab === 'recently_viewed'
              ? 'No recently viewed items yet. Explore our gadgets catalog above!'
              : 'Generating smart AI recommendations for you...'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                darkMode={darkMode}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onAddToCompare={onAddToCompare}
                onQuickView={onQuickView}
                onBuyNow={onBuyNow}
                isWishlisted={wishlistIds.includes(product.id)}
                isCompared={compareIds.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notify Back in Stock Modal */}
      {notifyModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setNotifyModalProduct(null)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"></div>
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Back in Stock SMS Alert</h3>
                <p className="text-xs text-slate-400">Get notified instantly when restocked</p>
              </div>
            </div>

            {notifySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Subscribed! We will SMS you the moment this item arrives in warehouse.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-3">
                <p className="text-xs text-slate-300 font-bold">{notifyModalProduct.name}</p>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mobile Phone Number (bKash/SMS)</label>
                  <input
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={notifyPhone}
                    onChange={(e) => setNotifyPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  Notify Me First
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

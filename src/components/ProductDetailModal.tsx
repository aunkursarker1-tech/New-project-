import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Heart,
  Shuffle,
  CheckCircle,
  Share2,
  Clock,
  ThumbsUp,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatPrice } from '../utils/helpers';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  darkMode: boolean;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  isWishlisted: boolean;
  isCompared: boolean;
  allReviews: Review[];
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  darkMode,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  onAddToCompare,
  isWishlisted,
  isCompared,
  allReviews,
  relatedProducts,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(
    product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews' | 'warranty'>('specs');
  const [copiedLink, setCopiedLink] = useState(false);

  const productReviews = allReviews.filter((r) => r.productId === product.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      ></div>

      {/* Main Modal Box */}
      <div
        className={`relative w-full max-w-5xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 ${
          darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Modal Sticky Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              {product.brand} Official Store
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950/30 border border-slate-800 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs shadow-xl">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === imgUrl ? 'border-emerald-500 scale-105' : 'border-slate-700/50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="gallery thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Features Cards */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-[11px] font-semibold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  100% Genuine
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 text-[11px] font-semibold text-cyan-300">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  Fast Dhaka 24h
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-[11px] font-semibold text-amber-300">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  7 Days Replace
                </div>
              </div>
            </div>

            {/* Right Column: Product Specs & Actions */}
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black mt-1 leading-snug">
                  {product.name}
                </h1>
                {product.nameBn && (
                  <p className="text-sm font-semibold text-emerald-400/90 mt-0.5">
                    {product.nameBn}
                  </p>
                )}

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    ({product.reviewsCount} Customer Reviews in BD)
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/30 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-emerald-400">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>

                {/* EMI Option Tag */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium pt-1">
                  <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    0% EMI available from <strong>{formatPrice(Math.round(product.price / 6))}/month</strong> with City Bank, EBL, Brac Bank.
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    Select Color: <span className="text-white font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === col
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Picker */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-700 font-bold text-sm text-slate-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-700 font-bold text-sm text-slate-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: <strong className="text-emerald-400">{formatPrice(product.price * quantity)}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onAddToCart(product, quantity, selectedColor)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>

                <button
                  onClick={() => onBuyNow(product, quantity, selectedColor)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm shadow-xl shadow-rose-600/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now (Instant bKash/COD)</span>
                </button>
              </div>

              {/* Wishlist & Compare Quick Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onAddToWishlist(product)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-400' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => onAddToCompare(product)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isCompared
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Compare List' : 'Compare Specs'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Specs / Description / Reviews Tabs */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex border-b border-slate-800 overflow-x-auto gap-4">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-3 px-2 font-extrabold text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Key Specifications
              </button>
              <button
                onClick={() => setActiveTab('desc')}
                className={`py-3 px-2 font-extrabold text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'desc'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Overview & Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-2 font-extrabold text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Verified BD Reviews ({productReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('warranty')}
                className={`py-3 px-2 font-extrabold text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'warranty'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Warranty & Shipping
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="font-bold text-slate-200 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'desc' && (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 text-xs">
                    <strong>Why Buy From Gadgetghor BD?</strong> Every item is imported through official channels, tested by our engineers, and stamped with our official hologram guarantee sticker before dispatching.
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                              {rev.userName[0]}
                            </span>
                            <div>
                              <h4 className="font-bold text-white">{rev.userName}</h4>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-400" /> {rev.location} • {rev.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed pt-1">{rev.comment}</p>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold pt-1">
                          <CheckCircle className="w-3 h-3" /> Verified Purchase
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No customer reviews yet for this model. Be the first buyer to review after delivery!
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-emerald-400 text-sm">Official Warranty Policy</h4>
                    <p className="text-slate-300 leading-relaxed">
                      This product comes with <strong>{product.warrantyInfo}</strong>. In case of any hardware defect, bring it to our Multiplan Center store or mail it via Steadfast Courier for instant replacement.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-cyan-400 text-sm">Delivery & Payment Terms</h4>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Dhaka City: Same Day or 24-Hour Express Home Delivery (৳60)</li>
                      <li>• Outside Dhaka: 2-3 Days via Steadfast/Pathao Courier (৳120)</li>
                      <li>• Cash on Delivery available across all 64 districts in Bangladesh</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-base font-extrabold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>You May Also Like (Related Gadgets)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:scale-105 transition-transform"
                    />
                    <h4 className="text-xs font-bold line-clamp-1 group-hover:text-emerald-400">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-black text-emerald-400 mt-1 block">
                      {formatPrice(rel.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

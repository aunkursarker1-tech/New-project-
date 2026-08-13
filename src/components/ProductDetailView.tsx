import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Heart,
  Shuffle,
  Share2,
  Clock,
  ThumbsUp,
  MapPin,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatPrice } from '../utils/helpers';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product | null;
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

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <p className="text-sm font-semibold">Gadget not found</p>
        <p className="text-xs mt-1 text-slate-500">The product you are trying to view does not exist or has been removed.</p>
        <a href="/shop" className="mt-4 inline-block px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          Browse Shop
        </a>
      </div>
    );
  }

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
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-emerald-500 transition-colors">Shop</a>
        <span>/</span>
        <span className="text-slate-500 font-bold truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950/10 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
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
            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl ? 'border-emerald-500 scale-105' : 'border-slate-300 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="gallery thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Features */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-green-500/10 text-center border border-green-500/20 text-[11px] font-bold text-green-500">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
              Genuine Warranty
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-center border border-cyan-500/20 text-[11px] font-bold text-cyan-400">
              <Truck className="w-4 h-4 mx-auto mb-1" />
              Super Fast Courier
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-center border border-amber-500/20 text-[11px] font-bold text-amber-500">
              <RotateCcw className="w-4 h-4 mx-auto mb-1" />
              Easy replacement
            </div>
          </div>
        </div>

        {/* Right Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 uppercase tracking-wider">
                {product.brand} Brand
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <h1 className={`text-xl sm:text-3xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-sm font-bold text-emerald-400">{product.nameBn}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
              <span>SKU: <span className="text-slate-300 font-bold">{product.sku}</span></span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-amber-500 font-extrabold">{product.rating}</span>
                <span>({product.reviewsCount} verified reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
            darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">PROMOTIONAL OFFER PRICE</p>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-4xl font-black text-emerald-400">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {product.discountPercent > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-600/25 tracking-wider">
                SAVE {product.discountPercent}%
              </div>
            )}
          </div>

          {/* Availability Status */}
          <div className="space-y-2 text-xs font-bold">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {product.stock > 0 ? 'Device in Stock & Ready to Ship' : 'Temporarily Out of Stock'}
              </span>
              <span>Availability: <span className="text-green-500">{product.stock} items</span></span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${Math.min(100, (product.stock / 30) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Colors Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Device Color</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      selectedColor === color
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800/30 border-slate-700/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchase Quantity</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-800 overflow-hidden bg-slate-800/20">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Standard home delivery fee: ৳{product.availabilityDhaka ? '60' : '120'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => onBuyNow(product, quantity, selectedColor)}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Express Cash On Delivery</span>
            </button>

            <button
              onClick={() => onAddToCart(product, quantity, selectedColor)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>
          </div>

          {/* Secondary Action icons */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 text-slate-400">
            <button
              onClick={() => onAddToWishlist(product)}
              className={`flex items-center gap-1.5 transition-colors ${isWishlisted ? 'text-rose-500' : 'hover:text-rose-400'}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => onAddToCompare(product)}
              className={`flex items-center gap-1.5 transition-colors ${isCompared ? 'text-cyan-400' : 'hover:text-cyan-300'}`}
            >
              <Shuffle className="w-4 h-4" />
              <span>{isCompared ? 'Added to Compare list' : 'Add to Compare'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={`rounded-3xl border overflow-hidden mb-12 transition-colors ${
        darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex border-b border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'desc', label: 'Product Description' },
            { id: 'reviews', label: `Reviews (${productReviews.length})` },
            { id: 'warranty', label: 'Replacement Policy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-slate-100/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="divide-y divide-slate-300/40 dark:divide-slate-800/40">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 py-3 gap-1">
                    <span className="text-xs font-bold text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-xs sm:col-span-2 font-semibold text-slate-300">{value as string}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Specs sheet will be uploaded soon for this device.</p>
              )}
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
              <p>{product.description || 'Authentic product with official warranty.'}</p>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <h5 className="text-xs font-bold text-emerald-400 mb-2">Key Features:</h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                  <li>Original packaging intact with retail barcode verification stickers.</li>
                  <li>Official brand distribution hologram warranty tags.</li>
                  <li>Verified and tested by Gadget Corporate quality control experts.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300/30 dark:border-slate-800/30">
                <div>
                  <h4 className="text-sm font-bold">Verified Customer Ratings</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-base font-extrabold text-amber-500">{product.rating}</span>
                    <span className="text-xs text-slate-400 font-semibold">({productReviews.length} total review logs)</span>
                  </div>
                </div>
              </div>

              {productReviews.length > 0 ? (
                <div className="space-y-4">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-950/20 border border-slate-300/10 dark:border-slate-800/30">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">{rev.userName}</h5>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">There are no customer reviews for this product yet. Be the first to purchase and review!</p>
              )}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="text-xs text-slate-300 leading-relaxed space-y-4">
              <p className="font-bold text-emerald-400">7-Day Replacement & Official Hologram Warranty</p>
              <p>
                Every single gadget shipped from Gadget Corporate has official holographic security seals. We offer an unconditional 7-day replacement guarantee if you encounter any technical manufacturing defects with your product.
              </p>
              <p className="text-slate-400">
                To claim replacement: Simply hold on to the invoice copy and the outer box of your item, and get in touch with our support hotline.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg sm:text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Related Gadgets You May Like
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {relatedProducts.slice(0, 5).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                darkMode={darkMode}
                onAddToCart={(prod) => onAddToCart(prod, 1)}
                onAddToWishlist={onAddToWishlist}
                onAddToCompare={onAddToCompare}
                onQuickView={onSelectProduct}
                isWishlisted={isWishlisted}
                isCompared={isCompared}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

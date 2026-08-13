import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Sliders, X, Check, Star, ArrowUpDown, Grid, Grid3X3, Filter } from 'lucide-react';
import { Product, CategoryType } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/helpers';

interface ShopViewProps {
  products: Product[];
  darkMode: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  onAddToCompare: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  wishlistIds: string[];
  compareIds: string[];
  initialTagFilter?: string;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  darkMode,
  selectedCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  onQuickView,
  onBuyNow,
  wishlistIds,
  compareIds,
  initialTagFilter = '',
}) => {
  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Extract unique brands from current products
  const brands = useMemo(() => {
    const list = products.map((p) => p.brand);
    return ['All', ...Array.from(new Set(list))];
  }, [products]);

  // Handle category selection and propagate
  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    onSelectCategory(cat);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveCategory('All');
    onSelectCategory('All');
    setSelectedBrand('All');
    setPriceRange(30000);
    setSelectedRating(null);
    setInStockOnly(false);
    setSortBy('default');
    onSearchChange('');
  };

  // Filtered and Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search Query
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.nameBn && p.nameBn.includes(searchQuery))
      );
    }

    // Category
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Brand
    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Price Limit
    result = result.filter((p) => p.price <= priceRange);

    // Rating
    if (selectedRating !== null) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Availability
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Tags (Flash sale, etc.)
    if (initialTagFilter === 'flash-sale') {
      result = result.filter((p) => p.isFlashSale);
    } else if (initialTagFilter === 'best-sellers') {
      result = result.filter((p) => p.isBestSeller);
    } else if (initialTagFilter === 'new-arrivals') {
      result = result.filter((p) => p.isNewArrival);
    }

    // Sort By
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, activeCategory, selectedBrand, priceRange, selectedRating, inStockOnly, sortBy, initialTagFilter]);

  const categoriesList: CategoryType[] = [
    'Gadgets',
    'Mobile Accessories',
    'Smart Home Devices',
    'Desk Setup Accessories',
    'Gift Boxes',
    'Audio Devices',
  ];

  return (
    <div className="py-4 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5 font-medium">
        <a href="/" className="hover:text-emerald-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-500 font-bold">Shop</span>
        {activeCategory !== 'All' && (
          <>
            <span>/</span>
            <span className="text-emerald-500 font-semibold">{activeCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className={`w-full lg:w-64 shrink-0 hidden lg:block p-5 rounded-2xl border transition-colors ${
          darkMode ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/20 mb-4">
            <span className="font-extrabold text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-emerald-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeCategory === 'All'
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>All Categories</span>
                {activeCategory === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeCategory === cat
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{cat}</span>
                  {activeCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Brands</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedBrand === brand
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{brand === 'All' ? 'All Brands' : brand}</span>
                  {selectedBrand === brand && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price</h4>
              <span className="text-xs font-extrabold text-emerald-400">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="200"
              max="50000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
              <span>৳200</span>
              <span>৳50,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Minimum Rating</h4>
            <div className="space-y-1">
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedRating === star
                      ? 'bg-amber-500/10 text-amber-500 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                    {Array.from({ length: 5 - star }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-slate-600" />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Display Area */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className={`p-4 rounded-2xl border mb-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
            darkMode ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}>
            <div className="text-xs font-bold text-slate-400">
              Showing <span className="text-emerald-400">{processedProducts.length}</span> gadgets
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            <div className="flex items-center gap-2.5">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold"
              >
                <Sliders className="w-3.5 h-3.5" /> Filter
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`py-1.5 px-3 text-xs font-bold rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="discount">Biggest Discounts</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {processedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {processedProducts.map((product) => (
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
          ) : (
            <div className={`text-center py-20 p-8 rounded-3xl border ${
              darkMode ? 'bg-slate-900/20 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <div className="max-w-xs mx-auto space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold">No products match your filters</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We couldn't find any gadgets matching your active filter criteria. Try adjusting your range or clear all.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                >
                  Reset Catalog Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          ></div>

          <div className={`relative w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/25 mb-6">
                <span className="font-extrabold text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" /> Filters
                </span>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="text-xs font-bold text-emerald-400"
                >
                  Clear All
                </button>
              </div>

              {/* Mobile Categories Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      activeCategory === 'All'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800/30 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    All Items
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        activeCategory === cat
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/30 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Brands</h4>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedBrand === brand
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/30 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      {brand === 'All' ? 'All Brands' : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Range Filter */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price</h4>
                  <span className="text-xs font-extrabold text-emerald-400">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="50000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Mobile Rating Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Minimum Rating</h4>
                <div className="flex gap-2">
                  {[5, 4, 3].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                        selectedRating === star
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800/30 border-slate-700/60 text-amber-500'
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Stock */}
              <div className="mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4.5 h-4.5 rounded accent-emerald-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

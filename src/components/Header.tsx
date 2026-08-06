import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Shuffle,
  Sun,
  Moon,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
  Zap,
  Tag,
  Gift,
  SearchX,
  PackageCheck,
  SlidersHorizontal
} from 'lucide-react';
import { Product, CategoryType } from '../types';
import { formatPrice } from '../utils/helpers';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
  onNavigateProducts: (tag?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenOrderTracking,
  onOpenAdmin,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  allProducts,
  onSelectProduct,
  onNavigateHome,
  onNavigateProducts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.nameBn && p.nameBn.includes(searchQuery))
        )
        .slice(0, 5)
    : [];

  const categories: CategoryType[] = [
    'Gadgets',
    'Mobile Accessories',
    'Smart Home Devices',
    'Desk Setup Accessories',
    'Gift Boxes',
    'Audio Devices',
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-slate-200 text-xs py-2 px-4 border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Truck className="w-3.5 h-3.5" /> Free Dhaka Delivery on ৳2,000+
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Multiplan Center, Level 4, Dhaka
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> +880 1700-000000
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenOrderTracking}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <PackageCheck className="w-3.5 h-3.5" /> Track Order
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin Panel
            </button>
            <span className="text-slate-600">|</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-bold tracking-wider">
              BDT ৳
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`${darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'} border-b py-3 px-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Gadgetghor
                  </span>
                  <span className="text-xs px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold tracking-widest">
                    BD
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
                  Authentic Gadgets in Bangladesh
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search gadgets, power banks, earbuds, soundbar..."
                className={`w-full py-2.5 pl-10 pr-10 rounded-xl text-sm border outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 text-white focus:border-emerald-500 focus:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Autocomplete Dropdown */}
            {searchFocused && searchQuery.trim() !== '' && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border z-50 overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-800/40">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex justify-between">
                      <span>Matching Gadgets ({searchResults.length})</span>
                      <span>Instant Search</span>
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          setSearchFocused(false);
                          onSearchChange('');
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-lg bg-slate-800 border border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-emerald-400">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-[10px] line-through text-slate-400">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-[10px] px-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                              -{product.discountPercent}%
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <SearchX className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs font-medium">No gadgets found for "{searchQuery}"</p>
                    <p className="text-[10px] mt-1 text-slate-500">Try searching "Anker", "Baseus", "Earbuds", "Charger"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Compare Badge */}
            <button
              onClick={onOpenCompare}
              className={`relative p-2.5 rounded-xl border transition-all hidden sm:flex ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Compare Gadgets"
            >
              <Shuffle className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Badge */}
            <button
              onClick={onOpenWishlist}
              className={`relative p-2.5 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Badge with Total */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-950 text-emerald-400 font-extrabold text-[9px] flex items-center justify-center border border-emerald-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase tracking-wider text-slate-900 font-extrabold opacity-80">Cart</span>
                <span className="text-xs font-black">{formatPrice(cartTotal)}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gadgets, power banks, earbuds..."
            className={`w-full py-2 pl-9 pr-8 rounded-xl text-xs border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-2.5 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Navbar */}
      <nav
        className={`hidden lg:block border-b py-2 px-4 transition-colors ${
          darkMode ? 'bg-slate-950/90 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-semibold">
            
            {/* Category Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500/20 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoryDropdownOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-2xl border z-50 p-2 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedCategory === 'All' ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    All Gadgets
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : darkMode
                          ? 'hover:bg-slate-800'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateProducts('flash-sale')}
              className="flex items-center gap-1.5 hover:text-rose-400 text-rose-400 font-bold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> Flash Sale
            </button>

            <button
              onClick={() => onNavigateProducts('best-sellers')}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-400" /> Best Sellers
            </button>

            <button
              onClick={() => onNavigateProducts('new-arrivals')}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> New Arrivals
            </button>

            <button
              onClick={() => onNavigateProducts('gift-boxes')}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" /> Gift Boxes
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Support Helpline
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          ></div>

          <div
            className={`relative w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto ${
              darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Gadgetghor BD
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold ${
                      selectedCategory === 'All' ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-medium ${
                        selectedCategory === cat ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="mt-6 space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    onOpenOrderTracking();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 text-xs font-semibold"
                >
                  <span className="flex items-center gap-2 text-emerald-400">
                    <PackageCheck className="w-4 h-4" /> Track My Order
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 text-xs font-semibold"
                >
                  <span className="flex items-center gap-2 text-amber-400">
                    <ShieldCheck className="w-4 h-4" /> Admin Console
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <p>📍 Multiplan Center, Level 4, Elephant Road, Dhaka</p>
              <p>📞 Helpline: +880 1700-000000</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t py-2 px-4 flex items-center justify-around backdrop-blur-lg ${
          darkMode ? 'bg-slate-950/95 border-slate-800 text-slate-300' : 'bg-white/95 border-slate-200 text-slate-700'
        }`}
      >
        <button
          onClick={onNavigateHome}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium"
        >
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Categories</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium relative"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        <button
          onClick={onOpenOrderTracking}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium"
        >
          <PackageCheck className="w-5 h-5 text-amber-400" />
          <span>Track</span>
        </button>
      </div>
    </header>
  );
};

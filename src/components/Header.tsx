import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  SlidersHorizontal,
  LogOut,
  Home
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
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
  onNavigateProducts: (tag?: string) => void;
  customerName?: string | null;
  onLogout?: () => void;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  allProducts,
  onSelectProduct,
  onNavigateHome,
  onNavigateProducts,
  customerName,
  onLogout,
  logoUrl,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close search and user dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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

  const handleProductClick = (p: Product) => {
    setSearchFocused(false);
    onSearchChange('');
    navigate(`/product/${p.id}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm border-b border-slate-200 dark:border-slate-800">
      {/* Top Announcement Bar - Matching Screenshot */}
      <div className="bg-[#0B0E1E] text-slate-300 text-[11px] py-1.5 px-3 md:py-2 md:px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-2">
          {/* Left Block on Desktop: Delivery details */}
          <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
            <span className="flex items-center gap-1.5 text-[#FC4C56] font-extrabold text-[11px] sm:text-[12px] tracking-tight">
              <Truck className="w-4 h-4 text-[#FC4C56] shrink-0" /> Free Dhaka Delivery on ৳2,000+
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white text-[11px] sm:text-[12px]">
              <Phone className="w-3.5 h-3.5 text-white/75 shrink-0" /> +880 1700-000000
            </span>
          </div>

          {/* Right Block on Desktop: Track Order & BDT Badge */}
          <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            <Link
              to="/track-order"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#FC4C56] font-bold transition-colors text-[11px] sm:text-[11.5px]"
            >
              <PackageCheck className="w-3.5 h-3.5 text-white/80 shrink-0" /> Track Order
            </Link>
            <span className="text-white/20">|</span>
            <span className="px-3 py-0.5 rounded bg-[#5C0612] text-[#FC4C56] text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase shadow-inner">
              BDT ৳
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-[#007A58] text-white'} py-2.5 px-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Hamburguer */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to="/"
              onClick={onNavigateHome}
              className="flex items-center gap-2 sm:gap-2.5 group text-left"
            >
              {/* Circular Icon with Shopping bag and House (matching screenshot) */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg shrink-0 select-none overflow-hidden p-[2px]">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#007A58]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shopping bag handle */}
                    <path d="M30 40 C 30 20, 70 20, 70 40" stroke="#007A58" strokeWidth="6" strokeLinecap="round" />
                    {/* Shopping bag body / house contour */}
                    <rect x="20" y="38" width="60" height="46" rx="8" fill="white" stroke="#007A58" strokeWidth="5.5" />
                    {/* House roof silhouette */}
                    <path d="M40 45 L50 37 L60 45" stroke="#EA384D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="56" y="39" width="3.5" height="5.5" fill="#EA384D" />
                    {/* Stylized E */}
                    <path d="M32 54 H42 M32 61 H40 M32 68 H42 M32 54 V68" stroke="#007A58" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Stylized H */}
                    <path d="M52 54 V68 M64 54 V68 M52 61 H64" stroke="#EA384D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Red window on H crossbar */}
                    <rect x="56" y="56" width="4" height="4" fill="white" stroke="#EA384D" strokeWidth="1.2" />
                  </svg>
                )}
              </div>

              {/* Separator line */}
              <div className="h-9 w-[1.5px] bg-white/30 shrink-0 mx-0.5 sm:mx-1"></div>

              {/* Custom Branded Text Logo (matching screenshot exactly) */}
              <div className="flex flex-col select-none">
                <div className="flex items-baseline font-sans font-black tracking-tight leading-none text-[19px] sm:text-[23px]">
                  <span className="text-white">Electro</span>
                  <span className="relative text-[#FC4C56] ml-0.5">
                    {/* House roof icon over "House" text */}
                    <span className="absolute -top-[11px] left-0 right-0 flex justify-center">
                      <svg viewBox="0 0 40 12" className="w-[38px] h-2.5 text-[#FC4C56]" fill="currentColor">
                        <path d="M2 10 L20 2 L38 10 H34 V12 H6 V10 Z" />
                        <rect x="28" y="4" width="3" height="4" />
                      </svg>
                    </span>
                    House
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-[1px] w-5 sm:w-7 bg-white/40"></div>
                  <span className="text-[7.5px] sm:text-[9.5px] font-extrabold tracking-[0.22em] text-white/95 uppercase leading-none">
                    Bangladesh
                  </span>
                  <div className="h-[1px] w-5 sm:w-7 bg-white/40"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search for products brands and more..."
                className={`w-full py-1.5 pl-9 pr-12 rounded-lg text-xs font-semibold outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-900 border border-slate-800 text-white focus:border-emerald-500'
                    : 'bg-white border border-transparent text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
              <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-[#007A58]'}`} />
              
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-12 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}

              {/* Magnifying Glass search icon separator button like screenshot */}
              <div className={`absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center border-l rounded-r-xl ${
                darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-[#007A58]'
              }`}>
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {searchFocused && searchQuery.trim() !== '' && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-100 dark:divide-slate-900">
                    <div className="px-3 py-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex justify-between items-center">
                      <span>Matching Gadgets ({searchResults.length})</span>
                      <span>Quick Finder</span>
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                          darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-950/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-[#007A58]">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] line-through text-slate-400">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <SearchX className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs font-bold">No gadgets matched "{searchQuery}"</p>
                    <p className="text-[10px] mt-1 text-slate-500">Try searching "Anker", "Earbuds", or "Charger"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Compare Shortcut - Hidden on mobile */}
            <Link
              to="/compare"
              className={`relative p-1.5 sm:p-2 rounded-lg transition-all hidden md:flex ${
                darkMode
                  ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Compare matrix"
            >
              <Shuffle className="w-4 h-4" />
              {compareCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center ${
                  darkMode ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Shortcut - Hidden on mobile */}
            <Link
              to="/wishlist"
              className={`relative p-1.5 sm:p-2 rounded-lg transition-all hidden md:flex ${
                darkMode
                  ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Saved items"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account dropdown wrapper - Hidden on mobile */}
            <div ref={userMenuRef} className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-1 p-1.5 sm:p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Customer dashboard"
              >
                <User className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden sm:inline max-w-[80px] truncate">
                  {customerName ? customerName.split(' ')[0] : 'Profile'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {userMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border z-50 p-2 ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {customerName ? (
                    <>
                      <div className="px-3 py-1.5 border-b border-slate-800/10 mb-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">SIGNED IN AS</p>
                        <p className="text-xs font-black truncate">{customerName}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left block px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        My Account Summary
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left block px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        Sign In / Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart with total - Circular transparent outline on mobile, standard pill on desktop */}
            <Link
              to="/cart"
              className={`flex items-center justify-center transition-all ${
                darkMode
                  ? 'bg-slate-900 text-emerald-400 border border-slate-800 p-2 rounded-lg'
                  : 'md:bg-white md:text-[#007A58] md:rounded-lg md:px-2.5 md:py-1.5 bg-transparent text-white border border-white/60 rounded-full p-2 w-10 h-10 min-w-[40px] max-w-[40px]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 shrink-0" />
                {cartCount >= 0 && (
                  <span className={`absolute -top-3 -right-3 w-4.5 h-4.5 rounded-full font-black text-[9px] flex items-center justify-center border ${
                    darkMode
                      ? 'bg-slate-950 text-emerald-400 border-emerald-400'
                      : 'bg-white text-[#007A58] border-[#007A58] md:bg-[#007A58] md:text-white md:border-white'
                  }`}>
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none ml-1.5">
                <span className={`text-[9px] uppercase tracking-wider font-black opacity-80 ${
                  darkMode ? 'text-slate-400' : 'text-[#007A58]'
                }`}>Bag</span>
                <span className={`text-[11px] font-black ${
                  darkMode ? 'text-white' : 'text-[#007A58]'
                }`}>{formatPrice(cartTotal)}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-1 md:hidden relative px-4 pb-2.5">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for products, brands and more..."
              className={`w-full py-2 pl-3 pr-12 rounded-md text-xs font-semibold outline-none ${
                darkMode 
                  ? 'bg-slate-900 border border-slate-800 text-white' 
                  : 'bg-white text-slate-900 border border-transparent placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')} 
                className="absolute right-12 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Magnifying glass search button overlay matching screenshot */}
            <div className={`absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center border-l rounded-r-md ${
              darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-[#007A58]'
            }`}>
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navbar */}
      <nav
        className={`hidden lg:block border-t border-slate-200 dark:border-slate-800 py-1.5 px-4 transition-colors ${
          darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-black">
            
            {/* Category Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold hover:bg-emerald-500/20 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoryDropdownOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl border z-50 p-2 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setCategoryDropdownOpen(false);
                      navigate('/shop');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                      selectedCategory === 'All' ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    All Collections
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setCategoryDropdownOpen(false);
                        navigate('/shop');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop"
              onClick={() => onNavigateProducts()}
              className="hover:text-emerald-400 transition-colors"
            >
              Shop Catalog
            </Link>

            <button
              onClick={() => {
                onNavigateProducts('flash-sale');
                navigate('/shop');
              }}
              className="flex items-center gap-1.5 text-rose-500 font-extrabold hover:text-rose-400 transition-colors animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Flash Sale</span>
            </button>

            <button
              onClick={() => {
                onNavigateProducts('best-sellers');
                navigate('/shop');
              }}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => {
                onNavigateProducts('new-arrivals');
                navigate('/shop');
              }}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => {
                onSelectCategory('Gift Boxes');
                navigate('/shop');
              }}
              className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Gift Boxes</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Corporate Hotline
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-base uppercase bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Gadget Corporate
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories list */}
              <div className="mt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Product Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setMobileMenuOpen(false);
                      navigate('/shop');
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold ${
                      selectedCategory === 'All' ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-100 dark:hover:bg-slate-850'
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
                        navigate('/shop');
                      }}
                      className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold ${
                        selectedCategory === cat ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation list */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-emerald-400"
                >
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4" /> Track My Order
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
              <p>📍 Multiplan Center, Level 4, Elephant Road, Dhaka</p>
              <p>📞 Helpline: +880 1700-000000</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-45 lg:hidden border-t py-1.5 px-2 flex items-center justify-around backdrop-blur-lg ${
          darkMode ? 'bg-slate-950/95 border-slate-900 text-slate-300' : 'bg-white/95 border-slate-200 text-slate-700'
        }`}
      >
        <Link
          to="/"
          onClick={onNavigateHome}
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold min-w-[50px]"
        >
          <Home className="w-5 h-5 text-[#007A58]" />
          <span>Home</span>
        </Link>

        <Link
          to="/shop"
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold min-w-[50px]"
        >
          <SlidersHorizontal className="w-5 h-5 text-[#007A58]" />
          <span>Category</span>
        </Link>

        {/* Hot Deals - A highlighted center circle flame badge matching the screenshot */}
        <Link
          to="/shop"
          className="flex flex-col items-center justify-center -mt-4 relative select-none"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center transform active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#111827] rounded-full flex items-center justify-center text-white">
              <span className="text-lg animate-pulse">🔥</span>
            </div>
          </div>
          <span className="text-[9px] font-black text-rose-500 mt-1">Hot Deals</span>
        </Link>

        <Link
          to="/wishlist"
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold min-w-[50px] relative"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </Link>

        <Link
          to="/account"
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold min-w-[50px]"
        >
          <User className="w-5 h-5 text-slate-500" />
          <span>Sign In</span>
        </Link>
      </div>
    </header>
  );
};

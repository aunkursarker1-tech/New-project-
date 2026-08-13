import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Truck, Zap, ChevronLeft, ChevronRight, ArrowRight, Star, PlusCircle, Eye } from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  darkMode: boolean;
  onNavigateProducts: (tag?: string) => void;
  onOpenGiftBoxes: () => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onSelectCategory?: (category: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  darkMode,
  onNavigateProducts,
  onOpenGiftBoxes,
  onQuickView,
  onAddToCart,
  onSelectCategory,
}) => {
  // Products linked from mockData for high-fidelity interactive actions
  const haierProducts: Product[] = [
    {
      id: 'haier-ac-1',
      name: 'Haier 1.6 Ton CleanCool Pro Split Inverter AC',
      brand: 'Haier',
      category: 'Air Conditioner',
      price: 54900,
      originalPrice: 74990,
      discountPercent: 26,
      rating: 4.8,
      reviewsCount: 42,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      gallery: [],
      description: 'CleanCool Pro split AC with triple inverter technology.',
      specs: { 'Capacity': '1.6 Ton (18000 BTU)' },
      warrantyInfo: '10 Years Compressor',
      sku: 'HAI-CC-16T-PRO',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags: []
    },
    {
      id: 'haier-ac-2',
      name: 'Haier 1.6 Ton AntirustCool Split Inverter AC',
      brand: 'Haier',
      category: 'Air Conditioner',
      price: 57900,
      originalPrice: 75990,
      discountPercent: 23,
      rating: 4.7,
      reviewsCount: 29,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      gallery: [],
      description: 'Split inverter AC with premium anti-rust gold fin protection.',
      specs: { 'Capacity': '1.6 Ton (18000 BTU)' },
      warrantyInfo: '10 Years Compressor',
      sku: 'HAI-AR-16T',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags: []
    },
    {
      id: 'haier-ac-3',
      name: 'Haier 1.6 Ton UltimateCool Split Inverter AC',
      brand: 'Haier',
      category: 'Air Conditioner',
      price: 80900,
      originalPrice: 99990,
      discountPercent: 19,
      rating: 4.9,
      reviewsCount: 56,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      gallery: [],
      description: 'Smart AC featuring premium voice control and PM2.5 filters.',
      specs: { 'Capacity': '1.6 Ton (18000 BTU)' },
      warrantyInfo: '10 Years Compressor',
      sku: 'HAI-UC-16T',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags: []
    }
  ];

  const samsungProducts: Product[] = [
    {
      id: 'samsung-tv-43',
      name: 'Samsung 43 Inch Crystal UHD 4K Smart TV',
      brand: 'Samsung',
      category: 'Television',
      price: 40900,
      originalPrice: 55900,
      discountPercent: 26,
      rating: 4.8,
      reviewsCount: 88,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&auto=format&fit=crop&q=80',
      gallery: [],
      description: 'Crystal UHD TV with HDR10+ and Tizen OS.',
      specs: { 'Screen Size': '43 Inch' },
      warrantyInfo: '2 Years Panel Warranty',
      sku: 'SAM-43-CRYSTAL',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags: []
    },
    {
      id: 'samsung-tv-55',
      name: 'Samsung 55 Inch Crystal UHD 4K Smart TV',
      brand: 'Samsung',
      category: 'Television',
      price: 70900,
      originalPrice: 95900,
      discountPercent: 26,
      rating: 4.9,
      reviewsCount: 112,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&auto=format&fit=crop&q=80',
      gallery: [],
      description: '55 Inch ultra high-definition boundless smart TV.',
      specs: { 'Screen Size': '55 Inch' },
      warrantyInfo: '2 Years Panel Warranty',
      sku: 'SAM-55-CRYSTAL',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags: []
    }
  ];

  const hitachiProduct: Product = {
    id: 'hitachi-wash-1',
    name: 'Hitachi 9kg Front Load Fully Automatic Washing Machine',
    brand: 'Hitachi',
    category: 'Washing Machine',
    price: 61900,
    originalPrice: 79900,
    discountPercent: 22,
    rating: 4.7,
    reviewsCount: 19,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1610557892470-7661873f70ec?w=400&auto=format&fit=crop&q=80',
    gallery: [],
    description: 'Front-load washing machine with high-efficiency inverter motor.',
    specs: { 'Capacity': '9kg Load' },
    warrantyInfo: '10 Years Motor Warranty',
    sku: 'HIT-FL-9KG',
    availabilityDhaka: true,
    availabilityOutside: true,
    tags: []
  };

  const hisenseProduct: Product = {
    id: 'hisense-ac-1',
    name: 'Hisense 1.5 Ton Split Inverter AC',
    brand: 'Hisense',
    category: 'Air Conditioner',
    price: 51490,
    originalPrice: 73900,
    discountPercent: 30,
    rating: 4.6,
    reviewsCount: 33,
    stock: 11,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    gallery: [],
    description: 'Premium split inverter AC by Hisense.',
    specs: { 'Capacity': '1.5 Ton' },
    warrantyInfo: '10 Years Compressor Warranty',
    sku: 'HIS-AS-18TW',
    availabilityDhaka: true,
    availabilityOutside: true,
    tags: []
  };

  return (
    <section className="space-y-3 pt-2 pb-2 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* SECTION 1: COMPACT HERO BANNER */}
      <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 bg-gradient-to-br from-[#0a0f26] to-[#12193b] text-white p-4 sm:p-5 flex flex-col gap-3">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider">
              <Star className="w-2.5 h-2.5 text-emerald-400" />
              <span>SAMSUNG OFFICIAL OFFER</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white mt-1 tracking-tight">
              Samsung TV Fest
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
              পছন্দের স্যামসাং ক্রিস্টাল UHD ৪কে টিভি এখন অফিসিয়াল ওয়ারেন্টি ও ক্যাশব্যাক অফারে!
            </p>
          </div>
          
          <div className="bg-[#007A58] text-white font-black text-[9px] sm:text-[10px] px-2.5 py-1 rounded shadow shrink-0 self-start sm:self-auto">
            🔥 Best Price Guaranteed
          </div>
        </div>

        {/* TV cards display */}
        <div className="grid grid-cols-2 gap-2 mt-1 w-full">
          {samsungProducts.map((tv) => (
            <div key={tv.id} className="bg-white/10 backdrop-blur-md p-2 rounded border border-white/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative group text-white">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white/5 flex items-center justify-center p-1 shrink-0">
                  <img src={tv.image} alt={tv.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[9px] sm:text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
                    {tv.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-black text-emerald-400">৳{tv.price.toLocaleString()}</span>
                    <span className="text-[8px] line-through text-slate-300">৳{tv.originalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 z-10 shrink-0">
                <button 
                  onClick={() => onAddToCart?.(tv)}
                  className="p-1 rounded bg-[#007A58] hover:bg-emerald-700 text-white transition-colors"
                  title="Add to Bag"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TWIN PROMO BANNERS - EXACTLY LIKE SCREENSHOT */}
      <div className="grid grid-cols-2 gap-2">
        {/* Left Banner: SAMSUNG TV FEST */}
        <div 
          onClick={() => onSelectCategory?.('Television')}
          className="cursor-pointer group relative overflow-hidden rounded-lg border border-[#161d3a] bg-gradient-to-br from-[#0c0f24] to-[#12193b] p-2 sm:p-3 flex items-center justify-between gap-1.5 hover:shadow-md transition-shadow min-h-[110px]"
        >
          <div className="space-y-1.5 text-left z-10 flex-1">
            <div className="inline-block text-[7px] sm:text-[9px] font-extrabold text-white bg-blue-600 px-1.5 py-0.5 rounded tracking-wider uppercase">
              SAMSUNG TV FEST
            </div>
            <h3 className="text-[10px] sm:text-xs font-black text-white leading-tight">
              পছন্দের স্যামসাং টিভি, এখন অফারে!
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 pt-0.5 text-[8px] sm:text-[10px] text-slate-300">
              <span className="bg-slate-800 px-1 py-0.5 rounded font-bold">43" ৳40,900</span>
              <span className="bg-slate-800 px-1 py-0.5 rounded font-bold">55" ৳70,900</span>
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center p-0.5 bg-black/10 rounded">
            <img 
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=120&auto=format&fit=crop&q=80" 
              alt="Samsung TV" 
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Banner: HITACHI Washing Machine */}
        <div 
          onClick={() => onSelectCategory?.('Washing Machine')}
          className="cursor-pointer group relative overflow-hidden rounded-lg border border-[#d6dcff] bg-gradient-to-br from-[#e5eaff] to-[#f3f6ff] p-2 sm:p-3 flex items-center justify-between gap-1.5 hover:shadow-md transition-shadow min-h-[110px]"
        >
          <div className="space-y-1.5 text-left z-10 flex-1">
            <div className="inline-block text-[7px] sm:text-[9px] font-extrabold text-white bg-red-600 px-1.5 py-0.5 rounded tracking-wider uppercase">
              HITACHI
            </div>
            <h3 className="text-[10px] sm:text-xs font-black text-slate-900 leading-tight">
              মার্কেট সেরা দামে কিনুন হিটাচি ওয়াশিং মেশিন!
            </h3>
            {/* Hot pink price pill matching screenshot */}
            <div className="inline-block bg-[#e31c79] text-white font-black text-[7px] sm:text-[9.5px] px-1.5 sm:px-2 py-0.5 rounded-full">
              দাম শুরু ৩৯,৯০০/- থেকে
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center p-0.5 bg-black/5 rounded">
            <img 
              src="https://images.unsplash.com/photo-1610557892470-7661873f70ec?w=120&auto=format&fit=crop&q=80" 
              alt="Hitachi Washing Machine" 
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: THIN WIDE STRIP BANNER - HISENSE AC GREEN RIBBON */}
      <div className="relative overflow-hidden rounded-lg border border-[#005a50] bg-[#007467] p-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          {/* Logo brand and AC unit illustration */}
          <span className="text-xs sm:text-sm font-black text-white italic tracking-wide uppercase px-1">
            Hisense
          </span>
          <div className="w-12 h-6 sm:w-16 sm:h-8 flex items-center justify-center bg-white/10 rounded p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=80&auto=format&fit=crop&q=80" 
              alt="Hisense AC" 
              className="max-h-full max-w-full object-contain filter brightness-110"
            />
          </div>
        </div>

        {/* Center Navy Blue dark banner block */}
        <div className="bg-[#0f1d4a] px-3 py-1 rounded text-center flex items-center gap-1.5 sm:gap-3">
          <span className="text-[7.5px] sm:text-[10px] font-black text-slate-300">
            Model: AS-18TW4RGSKB02DU
          </span>
          <span className="bg-amber-500 text-slate-950 font-extrabold text-[7px] sm:text-[9px] px-1 rounded uppercase">
            1.5 Ton
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-black text-emerald-400">৳51,490</span>
            <span className="text-[8px] sm:text-[10px] line-through text-slate-400">৳73,900</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAddToCart?.(hisenseProduct)}
            className="px-2.5 py-1 text-[8px] sm:text-[10px] font-black bg-white text-slate-900 rounded shadow-sm hover:bg-slate-100 transition-all active:scale-95"
          >
            Buy AC
          </button>
        </div>
      </div>

      {/* Trust Badges Bar */}

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${darkMode ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/60 text-slate-800 shadow-sm'}`}>
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-[#007A58] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold leading-tight">100% Authentic</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Brand Warranty Cards</p>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${darkMode ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/60 text-slate-800 shadow-sm'}`}>
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-[#007A58] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold leading-tight">Fast Dhaka Delivery</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Next Day Delivery</p>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${darkMode ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/60 text-slate-800 shadow-sm'}`}>
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-[#007A58] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold leading-tight">Cash on Delivery</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">NATIONWIDE SUPPORT</p>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${darkMode ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/60 text-slate-800 shadow-sm'}`}>
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-[#007A58] flex items-center justify-center shrink-0 flex-col font-bold text-xs">
            ৳
          </div>
          <div>
            <h4 className="text-[11px] font-bold leading-tight">Easy Installments</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Up to 12 Months EMI</p>
          </div>
        </div>
      </div>
    </section>
  );
};

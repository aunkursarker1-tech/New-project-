import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Zap, ChevronLeft, ChevronRight, ArrowRight, Gift } from 'lucide-react';

interface HeroBannerProps {
  darkMode: boolean;
  onNavigateProducts: (tag?: string) => void;
  onOpenGiftBoxes: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  darkMode,
  onNavigateProducts,
  onOpenGiftBoxes,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'EID & SUMMER GADGET FEST 2026',
      badgeColor: 'from-amber-500 to-rose-500',
      title: 'Upgrade Your Lifestyle with Authentic Tech',
      subtitle: 'Get up to 45% OFF on Anker, Baseus, Haylou, OnePlus & Xiaomi with official brand warranty.',
      cta: 'Shop Flash Deals',
      secondaryCta: 'Explore Gift Boxes',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
      discountTag: 'UP TO 45% OFF',
    },
    {
      id: 2,
      badge: 'DESK SETUP & DEVELOPER SUITE',
      badgeColor: 'from-cyan-500 to-emerald-500',
      title: 'Ergonomic Desk & Power Stations',
      subtitle: 'Elevate your workspace with 100W GaN Chargers, Vegan Leather Mats, 9-in-1 Hubs & Pixel Art Speakers.',
      cta: 'Explore Desk Gear',
      secondaryCta: 'View Power Banks',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80',
      discountTag: 'FREE DHAKA DELIVERY',
    },
    {
      id: 3,
      badge: 'HYBRID ACTIVE NOISE CANCELLATION',
      badgeColor: 'from-purple-500 to-pink-500',
      title: 'Studio Quality Audio & Crystal Calling',
      subtitle: 'Immerse in deep bass TWS earbuds, Hi-Res speakers & 50dB ANC headphones.',
      cta: 'Shop Audio Devices',
      secondaryCta: 'View Best Sellers',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
      discountTag: '1 YEAR WARRANTY',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-4 pb-8 px-4 max-w-7xl mx-auto">
      {/* Slide Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 min-h-[420px] sm:min-h-[460px] flex items-center">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
              index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transform transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>

            {/* Slide Content */}
            <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-10 text-white space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider text-white bg-gradient-to-r shadow-lg border border-white/20 uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{slide.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-lg">
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateProducts('flash-sale')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenGiftBoxes}
                  className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 backdrop-blur-md hover:border-emerald-500/50 transition-all flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>{slide.secondaryCta}</span>
                </button>
              </div>

              {/* Tag Pill */}
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold tracking-wider">
                  🔥 {slide.discountTag}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Buttons */}
        <button
          onClick={() =>
            setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700 backdrop-blur-md transition-all hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700 backdrop-blur-md transition-all hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            darkMode
              ? 'bg-slate-900/70 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">100% Authentic</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Brand Hologram Sticker</p>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            darkMode
              ? 'bg-slate-900/70 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Fast 24h Dhaka Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">2-3 Days Nationwide</p>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            darkMode
              ? 'bg-slate-900/70 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Cash on Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Pay After Receiving</p>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            darkMode
              ? 'bg-slate-900/70 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">7 Days Replacement</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Official Warranty Included</p>
          </div>
        </div>
      </div>
    </section>
  );
};

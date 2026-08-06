import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BrandShowcaseProps {
  darkMode: boolean;
  onSelectBrand: (brand: string) => void;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ darkMode, onSelectBrand }) => {
  const brands = [
    { name: 'Anker', country: 'Official Warranty', count: '45+ Products' },
    { name: 'Baseus', country: 'Official Distributor', count: '80+ Products' },
    { name: 'Haylou', country: 'Official Warranty', count: '30+ Products' },
    { name: 'OnePlus', country: 'Genuine Import', count: '25+ Products' },
    { name: 'Xiaomi', country: 'Official Global', count: '60+ Products' },
    { name: 'Joyroom', country: 'Official Partner', count: '40+ Products' },
    { name: 'Remax', country: 'Authorized Dealer', count: '35+ Products' },
    { name: 'UGREEN', country: 'Official Warranty', count: '50+ Products' },
  ];

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            OFFICIAL DISTRIBUTORS
          </span>
          <h2 className={`text-xl sm:text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Authorized Brand Partners
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {brands.map((b) => (
          <button
            key={b.name}
            onClick={() => onSelectBrand(b.name)}
            className={`p-3.5 rounded-2xl border text-center transition-all hover:scale-105 ${
              darkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="font-black text-sm text-slate-100 tracking-tight">{b.name}</div>
            <p className="text-[9px] text-emerald-400 font-bold mt-1 flex items-center justify-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> {b.country}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  darkMode: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  darkMode,
}) => {

  // Pure SVG Line-Art icon builders for the ultimate screenshot matching fidelity
  const renderCategoryIcon = (name: string) => {
    const strokeColor = '#007A58';
    
    switch (name) {
      case 'Television':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="13" rx="2" />
            <line x1="12" y1="16" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        );
      case 'Air Conditioner':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="8" rx="1" />
            <line x1="4" y1="8" x2="20" y2="8" />
            <path d="M6 16v2M12 16v2M18 16v2" />
            <path d="M4 12c.5 1.5 1.5 2 3 2s2.5-.5 3-2M14 12c.5 1.5 1.5 2 3 2s2.5-.5 3-2" />
          </svg>
        );
      case 'Refrigerator':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="5" y1="11" x2="19" y2="11" />
            <line x1="9" y1="5" x2="9" y2="8" />
            <line x1="9" y1="14" x2="9" y2="18" />
          </svg>
        );
      case 'Deep Freezer':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <path d="M7 7h3" />
            <circle cx="17" cy="14" r="1.5" />
          </svg>
        );
      case 'Washing Machine':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="14" height="20" rx="2" />
            <circle cx="11" cy="13" r="5" />
            <circle cx="11" cy="13" r="2" />
            <line x1="7" y1="5" x2="9" y2="5" />
            <circle cx="14" cy="5" r="0.75" fill={strokeColor} />
          </svg>
        );
      case 'Kitchen Appliances':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l1 7H5l1-7z" />
            <rect x="7" y="10" width="10" height="11" rx="1" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
        );
      case 'Microwave Oven':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="14" rx="2" />
            <rect x="5" y="7" width="11" height="8" rx="1" />
            <circle cx="19" cy="8" r="1" />
            <circle cx="19" cy="11" r="1" />
            <circle cx="19" cy="14" r="1" />
          </svg>
        );
      case 'Audio Devices':
      case 'Home Audio':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <circle cx="12" cy="7" r="2.5" />
            <circle cx="12" cy="15" r="4" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
        );
      case 'Gadgets':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" />
            <rect x="5" y="5" width="14" height="14" rx="2" />
            <path d="M9 12h6M12 9v6" />
          </svg>
        );
      case 'Mobile Accessories':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <circle cx="12" cy="18" r="1.5" />
            <line x1="9" y1="5" x2="15" y2="5" />
          </svg>
        );
      case 'Smart Home Devices':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'Desk Setup Accessories':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="12" rx="2" />
            <line x1="12" y1="15" x2="12" y2="19" />
            <line x1="8" y1="19" x2="16" y2="19" />
          </svg>
        );
      case 'Gift Boxes':
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M12 8V21M3 12h18" />
            <path d="M12 8c0-2-1.5-3.5-3.5-3.5S5 6 5 8h7zM12 8c0-2 1.5-3.5 3.5-3.5S19 6 19 8h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
    }
  };

  return (
    <section className="py-3 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Headings exactly reflecting the clean aesthetic of electrohousebangladesh.com */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className={`text-base sm:text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            Featured Categories
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Discover our high-performance electronic collections with brand warranties
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('All')}
          className="text-xs font-bold text-[#007A58] hover:text-[#006246] flex items-center gap-1 group transition-colors"
        >
          <span>View All Products</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid displaying the category cards as clean white rectangular cards with thin outlines */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const displayName = cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`group flex flex-col items-center justify-center p-2 sm:p-2.5 text-center rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/10 border-[#007A58] shadow-sm'
                  : darkMode
                  ? 'bg-slate-950 border-slate-850 hover:border-slate-700 hover:bg-slate-900'
                  : 'bg-white border-slate-200 hover:border-[#007A58]/40 hover:shadow-sm'
              }`}
            >
              {/* Custom Line Art SVG Container */}
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900/65 flex items-center justify-center mb-1.5 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20 transition-colors">
                <div className="scale-75 origin-center flex items-center justify-center shrink-0">
                  {renderCategoryIcon(cat.name)}
                </div>
              </div>

              <span className={`text-[10.5px] sm:text-[11.5px] font-bold block leading-tight ${darkMode ? 'text-slate-200' : 'text-slate-900'} group-hover:text-[#007A58] transition-colors truncate max-w-full px-0.5`}>
                {displayName}
              </span>

              {cat.nameBn && (
                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium block truncate max-w-full">
                  {cat.nameBn}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

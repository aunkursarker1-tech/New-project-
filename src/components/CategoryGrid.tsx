import React from 'react';
import { Cpu, Smartphone, Home, Monitor, Gift, Headphones, ArrowUpRight } from 'lucide-react';
import { Category, CategoryType } from '../types';

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
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-cyan-400" />;
      case 'Home':
        return <Home className="w-6 h-6 text-amber-400" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6 text-indigo-400" />;
      case 'Gift':
        return <Gift className="w-6 h-6 text-rose-400" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-teal-400" />;
      default:
        return <Cpu className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            EXPLORE COLLECTIONS
          </span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Product Categories
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory('All')}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
        >
          <span>View All ({categories.reduce((acc, c) => acc + c.itemCount, 0)}+ Gadgets)</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500 shadow-xl shadow-emerald-500/10'
                  : darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Category Image Background Preview */}
              <div className="relative w-full h-24 mb-3 rounded-xl overflow-hidden bg-slate-950/50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10">
                  {getIcon(cat.iconName)}
                </div>
              </div>

              <h3 className={`text-sm font-bold leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {cat.name}
              </h3>

              <p className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                {cat.nameBn}
              </p>

              <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                {cat.itemCount} Items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

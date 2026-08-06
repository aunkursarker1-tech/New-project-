import React from 'react';
import { Star, CheckCircle, MapPin, ThumbsUp, Quote } from 'lucide-react';
import { Review } from '../types';

interface CustomerReviewsSectionProps {
  reviews: Review[];
  darkMode: boolean;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  darkMode,
}) => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          REAL BUYER EXPERIENCES
        </span>
        <h2 className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Trusted by 50,000+ Bangladeshi Tech Lovers
        </h2>
        <p className="text-xs text-slate-400">
          100% verified customer ratings from Dhaka, Chittagong, Sylhet, Rajshahi & Khulna
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {rev.location}
                </span>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[9px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

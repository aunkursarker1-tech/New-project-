import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  ThumbsUp,
  MapPin,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import { Review, Product } from '../../../types';

interface ReviewsSectionProps {
  darkMode: boolean;
  reviews: Review[];
  products: Product[];
  onApproveReview?: (reviewId: string) => void;
  onRejectReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  darkMode,
  reviews,
  products,
  onApproveReview,
  onRejectReview,
  onDeleteReview,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);

  const handleApprove = (id: string) => {
    setReviewsList(
      reviewsList.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    if (onApproveReview) onApproveReview(id);
  };

  const handleReject = (id: string) => {
    setReviewsList(
      reviewsList.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    if (onRejectReview) onRejectReview(id);
  };

  const handleDelete = (id: string) => {
    setReviewsList(reviewsList.filter((r) => r.id !== id));
    if (onDeleteReview) onDeleteReview(id);
  };

  const filteredReviews = reviewsList.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = selectedRating === 'All' || r.rating === selectedRating;
    const matchesStatus = selectedStatus === 'All' || (r.status || 'Approved') === selectedStatus;

    return matchesSearch && matchesRating && matchesStatus;
  });

  // Calculate rating stats
  const totalCount = reviewsList.length || 1;
  const avgRating = (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Customer Product Reviews Moderation</h2>
          <p className="text-xs text-slate-400 mt-0.5">Approve, reject, filter & audit customer feedback from verified buyers</p>
        </div>
      </div>

      {/* Ratings Overview Bar */}
      <div className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-4 gap-6 items-center ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="text-center md:border-r border-slate-800 pr-4">
          <div className="text-4xl font-black text-amber-400 flex items-center justify-center gap-2">
            {avgRating} <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 font-bold mt-1">Average Customer Rating</p>
          <span className="text-[11px] text-slate-500">{reviewsList.length} Total Testimonials</span>
        </div>

        <div className="md:col-span-3 space-y-2 text-xs">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewsList.filter((r) => Math.floor(r.rating) === star).length;
            const pct = Math.round((count / totalCount) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 font-bold text-slate-400 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="w-10 text-right font-mono text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center gap-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reviews by comment text, buyer name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border ${
              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        <select
          value={selectedRating}
          onChange={(e: any) => setSelectedRating(e.target.value === 'All' ? 'All' : Number(e.target.value))}
          className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
            darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars Only</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
            darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <option value="All">All Moderation Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending Audit</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const prod = products.find((p) => p.id === rev.productId);
          const currentStatus = rev.status || 'Approved';

          return (
            <div
              key={rev.id}
              className={`p-6 rounded-3xl border space-y-3 transition-all ${
                darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-sm">
                    {rev.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100">{rev.userName}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> {rev.location} • {rev.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    currentStatus === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : currentStatus === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {currentStatus}
                  </span>
                </div>
              </div>

              {prod && (
                <div className="flex items-center gap-2 text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                  <img src={prod.image} alt="" className="w-8 h-8 object-cover rounded-lg" />
                  <span className="font-bold text-slate-200 line-clamp-1">{prod.name}</span>
                </div>
              )}

              <p className="text-xs text-slate-200 leading-relaxed italic">"{rev.comment}"</p>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {rev.likes} helpful votes
                </span>

                <div className="flex items-center gap-2">
                  {currentStatus !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}

                  {currentStatus !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  Upload
} from 'lucide-react';
import { Banner } from '../../../types';

interface BannerManagerSectionProps {
  darkMode: boolean;
  banners: Banner[];
  onAddBanner: (banner: Banner) => void;
  onUpdateBanner: (banner: Banner) => void;
  onDeleteBanner: (bannerId: string) => void;
}

export const BannerManagerSection: React.FC<BannerManagerSectionProps> = ({
  darkMode,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<'slider' | 'promo'>('slider');
  const [linkUrl, setLinkUrl] = useState('/category/Gadgets');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(1);
  const [buttonText, setButtonText] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('Eid Ultra Tech Mega Sale');
    setSubtitle('Up to 40% OFF on Genuine Gadgets');
    setImageUrl('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80');
    setType('slider');
    setLinkUrl('/category/Gadgets');
    setActive(true);
    setOrder(banners.length + 1);
    setButtonText('Shop Now');
    setShowModal(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImageUrl(b.imageUrl);
    setType(b.type);
    setLinkUrl(b.linkUrl || '');
    setActive(b.active);
    setOrder(b.order);
    setButtonText(b.buttonText || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingBanner) {
      onUpdateBanner({
        ...editingBanner,
        title,
        subtitle,
        imageUrl,
        type,
        linkUrl,
        active,
        order: Number(order),
        buttonText,
      });
    } else {
      onAddBanner({
        id: `ban-${Date.now()}`,
        title,
        subtitle,
        imageUrl,
        type,
        linkUrl,
        active,
        order: Number(order),
        buttonText,
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Homepage Banner & Hero Slider Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">Control main carousel sliders, promotional campaigns & Eid discount graphics</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Campaign Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />

                <div className="absolute top-2 left-2 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    b.type === 'slider' ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                  }`}>
                    {b.type === 'slider' ? 'Hero Slider' : 'Promo Banner'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    b.active ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                  }`}>
                    {b.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 font-mono text-[10px] font-bold">
                  Order #{b.order}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-100">{b.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{b.subtitle}</p>
                {b.linkUrl && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-1">Target Link: {b.linkUrl}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/40 text-xs">
              <button
                onClick={() => handleOpenEdit(b)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Banner
              </button>
              <button
                onClick={() => onDeleteBanner(b.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold">{editingBanner ? 'Edit Banner' : 'Create Campaign Banner'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Sub-Headline Offer / Text</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 block font-bold">Upload Banner Image</label>
                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-950/40 transition-colors">
                  <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-slate-400" /> Click to upload image file
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Or Direct Image URL</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Placement Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                  >
                    <option value="slider">Hero Compact Banner</option>
                    <option value="promo">Twin Promo Card / Strip</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Display Priority Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Optional Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Click Action Target URL</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <label htmlFor="activeCheck" className="text-emerald-400 font-bold">Activate Banner Immediately</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

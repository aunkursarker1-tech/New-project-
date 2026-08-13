import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  Package,
  Layers,
  CheckCircle,
  X,
  Upload
} from 'lucide-react';
import { Category, CategoryType } from '../../../types';

interface CategoriesSectionProps {
  darkMode: boolean;
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onUpdateCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  darkMode,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState<CategoryType>('Gadgets');
  const [nameBn, setNameBn] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [iconName, setIconName] = useState('Cpu');
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);

  // Upload progress / states
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState('');
  const [iconUploadError, setIconUploadError] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('Gadgets');
    setNameBn('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80');
    setIconName('Cpu');
    setIconUrl(undefined);
    setBannerUploadError('');
    setIconUploadError('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameBn(cat.nameBn);
    setDescription(cat.description);
    setImage(cat.image);
    setIconName(cat.iconName);
    setIconUrl(cat.iconUrl);
    setBannerUploadError('');
    setIconUploadError('');
    setShowModal(true);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setBannerUploadError('');
    if (!file) return;

    // Validate size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setBannerUploadError('File is too large. Max size is 2MB.');
      return;
    }

    // Validate format
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!acceptedTypes.includes(file.type)) {
      setBannerUploadError('Invalid format. Use PNG, JPG, WEBP or SVG.');
      return;
    }

    setIsUploadingBanner(true);
    // Simulate real upload network/file-reading latency with a loader
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsUploadingBanner(false);
      };
      reader.onerror = () => {
        setBannerUploadError('Failed to read image file.');
        setIsUploadingBanner(false);
      };
      reader.readAsDataURL(file);
    }, 600);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIconUploadError('');
    if (!file) return;

    // Validate size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setIconUploadError('File is too large. Max size is 2MB.');
      return;
    }

    // Validate format
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!acceptedTypes.includes(file.type)) {
      setIconUploadError('Invalid format. Use PNG, JPG, WEBP or SVG.');
      return;
    }

    setIsUploadingIcon(true);
    // Simulate real upload network/file-reading latency with a loader
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconUrl(reader.result as string);
        setIsUploadingIcon(false);
      };
      reader.onerror = () => {
        setIconUploadError('Failed to read image file.');
        setIsUploadingIcon(false);
      };
      reader.readAsDataURL(file);
    }, 600);
  };

  const handleRemoveBanner = () => {
    setImage('');
    setBannerUploadError('');
  };

  const handleRemoveIcon = () => {
    setIconUrl(undefined);
    setIconUploadError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name,
        nameBn,
        description,
        image,
        iconName,
        iconUrl,
      });
    } else {
      onAddCategory({
        id: `cat-${Date.now()}`,
        name,
        nameBn,
        description,
        image,
        iconName,
        iconUrl,
        itemCount: 0,
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Category & Subcategory Taxonomy</h2>
          <p className="text-xs text-slate-400 mt-0.5">Organize gadgets into high-level categories and sub-department groups</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Create New Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                {cat.iconUrl && (
                  <div className="absolute top-2 left-2 w-9 h-9 rounded-full bg-slate-950/90 backdrop-blur-md p-1.5 border border-slate-800/80 flex items-center justify-center">
                    <img src={cat.iconUrl} alt="Icon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 font-black text-[10px]">
                  {cat.itemCount} Items
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-100">{cat.name}</h3>
                <p className="text-xs font-bold text-emerald-400">{cat.nameBn}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/40 text-xs">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Category
              </button>
              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Category English Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Bangla Name (নাম)</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              {/* Category Icon Section */}
              <div className="space-y-2 border-t border-slate-800/40 pt-3">
                <label className="text-slate-200 block font-bold text-xs">Category Icon / Image</label>
                
                {/* Icon Preview */}
                <div className="flex items-center gap-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {iconUrl ? (
                      <img src={iconUrl} alt="Icon Preview" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-slate-500 font-bold text-[10px] text-center px-1">Default Fallback</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] font-bold text-slate-300">
                      {iconUrl ? "Custom Uploaded Icon" : "Using Default Fallback Icon"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      PNG, JPG, WEBP or SVG. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Upload Actions */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-slate-700/60">
                    {isUploadingIcon ? (
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        {iconUrl ? "Replace Icon" : "Upload Icon"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      disabled={isUploadingIcon}
                      className="hidden"
                    />
                  </label>

                  {iconUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl font-bold text-[11px] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {iconUploadError && (
                  <p className="text-[10px] text-rose-400 font-bold">{iconUploadError}</p>
                )}

                {/* Advanced Icon URL Input */}
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px] font-bold">Or Direct Icon URL (Optional)</label>
                  <input
                    type="text"
                    value={iconUrl || ''}
                    onChange={(e) => setIconUrl(e.target.value || undefined)}
                    placeholder="https://example.com/icon.png"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none text-[11px]"
                  />
                </div>
              </div>

              {/* Banner Image Section */}
              <div className="space-y-2 border-t border-slate-800/40 pt-3">
                <label className="text-slate-200 block font-bold text-xs">Banner Image</label>
                
                {/* Banner Preview */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'} alt="Banner Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-2 rounded-md bg-slate-950/70 text-[9px] text-slate-300 font-mono">
                    Banner Preview
                  </span>
                </div>

                {/* Banner Upload Actions */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-slate-700/60">
                    {isUploadingBanner ? (
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        {image ? "Replace Banner" : "Upload Banner"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={isUploadingBanner}
                      className="hidden"
                    />
                  </label>

                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl font-bold text-[11px] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {bannerUploadError && (
                  <p className="text-[10px] text-rose-400 font-bold">{bannerUploadError}</p>
                )}

                {/* Banner URL Input */}
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px] font-bold">Or Direct Banner URL</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

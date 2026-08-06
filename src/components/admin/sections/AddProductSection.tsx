import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Tag,
  DollarSign,
  Package,
  FileText,
  Sparkles,
  Zap,
  Star,
  Check,
  X
} from 'lucide-react';
import { Product, CategoryType } from '../../../types';

interface AddProductSectionProps {
  darkMode: boolean;
  editingProduct?: Product | null;
  onSaveProduct: (product: Product) => void;
  onCancel: () => void;
}

export const AddProductSection: React.FC<AddProductSectionProps> = ({
  darkMode,
  editingProduct,
  onSaveProduct,
  onCancel,
}) => {
  const [name, setName] = useState(editingProduct?.name || '');
  const [nameBn, setNameBn] = useState(editingProduct?.nameBn || '');
  const [brand, setBrand] = useState(editingProduct?.brand || 'Anker');
  const [sku, setSku] = useState(
    editingProduct?.sku || `GG-${brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<CategoryType>(editingProduct?.category || 'Gadgets');
  const [subcategory, setSubcategory] = useState(editingProduct?.subcategory || 'Wireless Tech');
  const [price, setPrice] = useState(editingProduct?.price || 3500);
  const [originalPrice, setOriginalPrice] = useState(editingProduct?.originalPrice || 4200);
  const [costPrice, setCostPrice] = useState(editingProduct?.costPrice || 2400);
  const [stock, setStock] = useState(editingProduct?.stock || 25);
  const [description, setDescription] = useState(
    editingProduct?.description ||
      'Authentic Bangladeshi imported gadget with 100% genuine brand warranty and same day Dhaka delivery.'
  );

  // Images state
  const [mainThumbnail, setMainThumbnail] = useState(
    editingProduct?.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    editingProduct?.gallery || [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specs Key-Value Editor
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    editingProduct?.specs
      ? Object.entries(editingProduct.specs).map(([k, v]) => ({ key: k, value: v }))
      : [
          { key: 'Warranty', value: '1 Year Brand Warranty' },
          { key: 'Connectivity', value: 'Bluetooth 5.3' },
          { key: 'Charging Port', value: 'Type-C USB Fast Charging' },
        ]
  );

  // Tags
  const [tags, setTags] = useState<string[]>(editingProduct?.tags || ['Gadget', 'BestSeller', 'OfficialBD']);
  const [tagInput, setTagInput] = useState('');

  // Toggles
  const [isFeatured, setIsFeatured] = useState(editingProduct?.isFeatured || false);
  const [isFlashSale, setIsFlashSale] = useState(editingProduct?.isFlashSale || false);
  const [isNewArrival, setIsNewArrival] = useState(editingProduct?.isNewArrival || true);
  const [status, setStatus] = useState<'Published' | 'Draft'>(editingProduct?.status || 'Published');

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
      if (!mainThumbnail) setMainThumbnail(newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const specObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) specObj[s.key.trim()] = s.value.trim();
    });

    const savedProduct: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name,
      nameBn,
      brand,
      sku,
      category,
      subcategory,
      price: Number(price),
      originalPrice: Number(originalPrice),
      costPrice: Number(costPrice),
      discountPercent,
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 1,
      stock: Number(stock),
      image: mainThumbnail || galleryImages[0],
      gallery: galleryImages.length > 0 ? galleryImages : [mainThumbnail],
      description,
      specs: specObj,
      warrantyInfo: specObj['Warranty'] || '6 Months Official Brand Warranty',
      availabilityDhaka: true,
      availabilityOutside: true,
      tags,
      isFeatured,
      isFlashSale,
      isNewArrival,
      status,
    };

    onSaveProduct(savedProduct);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {editingProduct ? 'Edit Product Details' : 'Add New Gadget to Catalog'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Fill in multi-image gallery, specs, prices, and promotion toggles</p>
        </div>

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
        >
          Cancel & Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Information & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
              <Package className="w-4 h-4 text-emerald-400" /> General Product Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Product Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anker Soundcore Motion+ 30W Bluetooth Speaker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 rounded-2xl outline-none border transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Bangla Title (নাম)</label>
                <input
                  type="text"
                  placeholder="e.g. অ্যাংকার সাউন্ডকোর মোশন+ ৩০ ওয়াট ব্লুটুথ স্পিকার"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className={`w-full p-3 rounded-2xl outline-none border transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={`w-full p-3 rounded-2xl outline-none border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className={`w-full p-3 rounded-2xl outline-none font-mono font-bold border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className={`w-full p-3 rounded-2xl outline-none border font-bold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Gadgets">Gadgets</option>
                    <option value="Mobile Accessories">Mobile Accessories</option>
                    <option value="Smart Home Devices">Smart Home Devices</option>
                    <option value="Desk Setup Accessories">Desk Setup Accessories</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Audio Devices">Audio Devices</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className={`w-full p-3 rounded-2xl outline-none border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Product Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 rounded-2xl outline-none border text-xs leading-relaxed ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Pricing & Inventory Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Selling Price (৳)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl font-black text-sm outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Original Price (৳)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl font-bold outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Cost Price (৳)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-purple-400' : 'bg-slate-50 border-slate-200 text-purple-700'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className={`w-full p-3 rounded-2xl font-black outline-none border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-200 text-amber-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Product Images (Multiple Upload Drag & Drop) */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2"><Upload className="w-4 h-4 text-emerald-400" /> Multi-Image Gallery & Main Thumbnail</span>
              <span className="text-xs text-slate-400">{galleryImages.length} Images Loaded</span>
            </h3>

            {/* Main Drag/Drop Zone placeholder */}
            <div className="p-6 border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-3xl bg-slate-950/50 text-center space-y-3 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">Drag & drop product images here, or add by URL</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WEBP high resolution product shots</p>
              </div>

              <div className="flex gap-2 max-w-md mx-auto pt-2">
                <input
                  type="text"
                  placeholder="Paste image URL (Unsplash, CDN...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  Add Image
                </button>
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    mainThumbnail === imgUrl ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  
                  {mainThumbnail === imgUrl && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
                      MAIN
                    </span>
                  )}

                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setMainThumbnail(imgUrl)}
                      className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px]"
                    >
                      Set Main
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg bg-rose-500 text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Key-Value Editor */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Specifications & Features Table
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Spec Row
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {specs.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Battery Life)"
                    value={s.key}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].key = e.target.value;
                      setSpecs(updated);
                    }}
                    className={`w-1/3 p-2.5 rounded-xl border outline-none font-bold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Spec Value (e.g. Up to 12 Hours)"
                    value={s.value}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].value = e.target.value;
                      setSpecs(updated);
                    }}
                    className={`flex-1 p-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Badges, Tags, Status & Save */}
        <div className="space-y-6">
          {/* Status & Publication */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold border-b border-slate-800 pb-3">Publication Status</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Catalog Visibility</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={`w-full p-3 rounded-2xl outline-none font-bold border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-700'
                  }`}
                >
                  <option value="Published">Published (Live on Website)</option>
                  <option value="Draft">Draft (Hidden from Store)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-slate-400 block font-bold">Promotion Badges</label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 font-bold text-amber-400">
                    <Zap className="w-4 h-4" /> Flash Sale Item
                  </span>
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 font-bold text-purple-400">
                    <Sparkles className="w-4 h-4" /> Featured Product
                  </span>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 font-bold text-cyan-400">
                    <Star className="w-4 h-4" /> New Arrival
                  </span>
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Product Tags */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-emerald-400" /> Search Tags & Filters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag (e.g. Wireless, ANC)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className={`flex-1 p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-bold text-[11px] flex items-center gap-1"
                  >
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)}>
                      <X className="w-3 h-3 hover:text-rose-400" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all"
            >
              <CheckCircle className="w-5 h-5" /> Save & Publish Product
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

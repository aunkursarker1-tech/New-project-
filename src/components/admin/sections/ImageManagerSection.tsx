import React, { useState } from 'react';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Info
} from 'lucide-react';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
  aspectRatio: string;
  uploadedAt: string;
}

const INITIAL_IMAGES: ImageItem[] = [
  {
    id: 'img-1',
    name: 'Anker Soundcore Motion Speaker',
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    size: '245 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-01',
  },
  {
    id: 'img-2',
    name: 'Baseus 100W Powerbank Highres',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    size: '312 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-02',
  },
  {
    id: 'img-3',
    name: 'Haylou RT3 Smartwatch Banner',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    size: '188 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-02',
  },
  {
    id: 'img-4',
    name: 'OnePlus Nord Buds 2r Clear',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    size: '210 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-03',
  },
  {
    id: 'img-5',
    name: 'Xiaomi C300 Security Camera',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    size: '290 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-03',
  },
  {
    id: 'img-6',
    name: 'Luxury Tech Gift Box Packaging',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    size: '410 KB',
    dimensions: '800 x 800',
    aspectRatio: '1:1 Square',
    uploadedAt: '2026-08-04',
  },
];

interface ImageManagerSectionProps {
  darkMode: boolean;
}

export const ImageManagerSection: React.FC<ImageManagerSectionProps> = ({ darkMode }) => {
  const [images, setImages] = useState<ImageItem[]>(INITIAL_IMAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(images[0]);

  const handleCopyUrl = (img: ImageItem) => {
    navigator.clipboard.writeText(img.url);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddImage = () => {
    if (!newUrlInput.trim()) return;
    const newImg: ImageItem = {
      id: `img-${Date.now()}`,
      name: `Uploaded Asset #${images.length + 1}`,
      url: newUrlInput.trim(),
      size: '320 KB',
      dimensions: '800 x 800',
      aspectRatio: '1:1 Square',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setImages([newImg, ...images]);
    setSelectedImage(newImg);
    setNewUrlInput('');
  };

  const handleDeleteImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    if (selectedImage?.id === id) {
      setSelectedImage(updated[0] || null);
    }
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Image & Asset Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">Upload, manage, copy links and view CDN image specifications</p>
        </div>
      </div>

      {/* Dropzone & Direct URL Add */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-3xl p-8 text-center bg-slate-950/40 space-y-3 transition-colors">
          <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">Drag and drop images to upload to store CDN</h4>
            <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP, GIF up to 10MB per file</p>
          </div>

          <div className="flex items-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Paste public image URL..."
              value={newUrlInput}
              onChange={(e) => setNewUrlInput(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none border ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
            <button
              onClick={handleAddImage}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md"
            >
              Upload Asset
            </button>
          </div>
        </div>
      </div>

      {/* Main Gallery Grid & Detail Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery Grid (Left 2 cols) */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex justify-between items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
            <span className="text-xs text-slate-400 font-bold">{filteredImages.length} Assets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative group aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage?.id === img.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(img);
                    }}
                    className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                    title="Copy Link"
                  >
                    {copiedId === img.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.id);
                    }}
                    className="p-2 rounded-xl bg-rose-500 text-white"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Image Metadata Inspector (Right 1 col) */}
        {selectedImage ? (
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-slate-800 pb-3">
              <Info className="w-4 h-4 text-emerald-400" /> Asset Inspector
            </h3>

            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img src={selectedImage.url} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">File Name</span>
                <p className="font-bold text-slate-200">{selectedImage.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Dimensions</span>
                  <p className="font-mono text-emerald-400">{selectedImage.dimensions}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                  <p className="font-mono text-cyan-400">{selectedImage.size}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Aspect Ratio</span>
                  <p className="font-mono text-amber-400">{selectedImage.aspectRatio}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Uploaded</span>
                  <p className="font-mono text-slate-300">{selectedImage.uploadedAt}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => handleCopyUrl(selectedImage)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  {copiedId === selectedImage.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === selectedImage.id ? 'URL Copied!' : 'Copy Image Direct URL'}
                </button>

                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500">
            Select an image to inspect details
          </div>
        )}
      </div>
    </div>
  );
};

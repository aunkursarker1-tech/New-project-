import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  Package,
  Layers,
  CheckCircle,
  X
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

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('Gadgets');
    setNameBn('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80');
    setIconName('Cpu');
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameBn(cat.nameBn);
    setDescription(cat.description);
    setImage(cat.image);
    setIconName(cat.iconName);
    setShowModal(true);
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
      });
    } else {
      onAddCategory({
        id: `cat-${Date.now()}`,
        name,
        nameBn,
        description,
        image,
        iconName,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
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

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
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

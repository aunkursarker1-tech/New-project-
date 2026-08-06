import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, FolderPlus, Folder, Plus } from 'lucide-react';
import { Product, WishlistCollection } from '../types';
import { formatPrice } from '../utils/helpers';
import { getWishlistCollections, saveWishlistCollection } from '../utils/enterpriseHelpers';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  darkMode: boolean;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  darkMode,
  onRemoveWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [collections, setCollections] = useState<WishlistCollection[]>(() => getWishlistCollections());
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [newColName, setNewColName] = useState('');
  const [showAddColModal, setShowAddColModal] = useState(false);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName) return;
    const newCol: WishlistCollection = {
      id: `col-${Date.now()}`,
      name: newColName,
      productIds: [],
      createdAt: new Date().toISOString(),
    };
    const updated = saveWishlistCollection(newCol);
    setCollections(updated);
    setActiveCollectionId(newCol.id);
    setNewColName('');
    setShowAddColModal(false);
  };

  const activeCol = collections.find((c) => c.id === activeCollectionId);
  const filteredWishlistProducts =
    activeCollectionId === 'all'
      ? wishlistProducts
      : wishlistProducts.filter((p) => activeCol?.productIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

      <div
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ${
          darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Wishlist Collections</h2>
              <p className="text-[11px] text-slate-400">{filteredWishlistProducts.length} Saved Items</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collections Tabs Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/30 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveCollectionId('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeCollectionId === 'all' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({wishlistProducts.length})
          </button>

          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveCollectionId(col.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                activeCollectionId === col.id ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{col.name}</span>
            </button>
          ))}

          <button
            onClick={() => setShowAddColModal(true)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all shrink-0"
            title="Create New Wishlist Collection"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddColModal && (
          <form onSubmit={handleCreateCollection} className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Collection name (e.g. Desk Setup)"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold">
              Save
            </button>
          </form>
        )}

        {/* Product Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
          {filteredWishlistProducts.length > 0 ? (
            filteredWishlistProducts.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold line-clamp-1">{p.name}</h4>
                  <div className="text-xs font-black text-emerald-400 mt-1">{formatPrice(p.price)}</div>

                  <button
                    onClick={() => {
                      onAddToCart(p);
                      onRemoveWishlist(p.id);
                    }}
                    className="mt-2 py-1 px-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Move to Cart
                  </button>
                </div>

                <button
                  onClick={() => onRemoveWishlist(p.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Heart className="w-10 h-10 mx-auto mb-2 text-rose-500/50" />
              <p className="font-bold text-slate-300">Collection is empty</p>
              <p className="text-[11px] mt-1 text-slate-500">Save gadgets to keep track of your dream desk setup.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

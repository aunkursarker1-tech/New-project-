import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  Tag
} from 'lucide-react';
import { Product, CategoryType } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface ProductsSectionProps {
  darkMode: boolean;
  products: Product[];
  onAddProductClick: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  darkMode,
  products,
  onAddProductClick,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    let matchesStock = true;
    if (stockFilter === 'In Stock') matchesStock = p.stock >= 10;
    if (stockFilter === 'Low Stock') matchesStock = p.stock > 0 && p.stock < 10;
    if (stockFilter === 'Out of Stock') matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Product Catalog Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage stock, prices, promotions & specs across {products.length} gadgets</p>
        </div>

        <button
          onClick={onAddProductClick}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Gadget
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by product name, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
              }`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="All">All Categories</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Mobile Accessories">Mobile Accessories</option>
            <option value="Smart Home Devices">Smart Home Devices</option>
            <option value="Desk Setup Accessories">Desk Setup Accessories</option>
            <option value="Gift Boxes">Gift Boxes</option>
            <option value="Audio Devices">Audio Devices</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock (&ge;10)</option>
            <option value="Low Stock">Low Stock (&lt;10)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>

          {/* Grid / Table Toggle */}
          <div className={`flex items-center p-1 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        <div className={`p-6 rounded-3xl border overflow-hidden ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-slate-400 uppercase tracking-wider font-bold ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">SKU & Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (BDT)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-11 h-11 object-cover rounded-xl bg-slate-950 border border-slate-800" />
                        <div>
                          <p className="font-bold text-slate-200 text-xs line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{p.nameBn}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-emerald-400">{p.sku}</p>
                      <span className="text-[11px] text-slate-400 font-medium">{p.brand}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-semibold text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-black text-sm text-slate-100">{formatPrice(p.price)}</p>
                      {p.originalPrice > p.price && (
                        <span className="text-[10px] text-slate-500 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        p.stock === 0
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : p.stock < 10
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} Units`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFlashSale && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px]">Flash</span>}
                        {p.isFeatured && <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[9px]">Featured</span>}
                        {p.isBestSeller && <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[9px]">Best</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateProduct(p)}
                          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((p) => (
            <div key={p.id} className={`p-4 rounded-3xl border flex flex-col justify-between space-y-3 ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold font-mono">
                  {p.sku}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{p.brand} • {p.category}</span>
                <h4 className="font-bold text-xs line-clamp-2 leading-tight">{p.name}</h4>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-black text-emerald-400">{formatPrice(p.price)}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.stock < 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {p.stock} units
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/40">
                <button
                  onClick={() => onEditProduct(p)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onDuplicateProduct(p)}
                  className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteProduct(p.id)}
                  className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <p className="text-xs">
          Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
        </p>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

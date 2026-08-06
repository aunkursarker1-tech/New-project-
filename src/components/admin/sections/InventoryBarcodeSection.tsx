import React, { useState } from 'react';
import { Download, Upload, QrCode, Barcode, AlertTriangle, CheckCircle, PackageCheck, Edit2, Search, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import { exportProductsToCSV, generateSKUBarcodeSVG } from '../../../utils/enterpriseHelpers';

interface InventoryBarcodeSectionProps {
  darkMode: boolean;
  products: Product[];
  onUpdateProduct: (updated: Product) => void;
}

export const InventoryBarcodeSection: React.FC<InventoryBarcodeSectionProps> = ({
  darkMode,
  products,
  onUpdateProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkStockAdjustment, setBulkStockAdjustment] = useState<number>(10);
  const [message, setMessage] = useState('');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const lowStockItems = products.filter((p) => p.stock < 10);

  const handleBulkAddStock = () => {
    products.forEach((p) => {
      if (p.stock < 10) {
        onUpdateProduct({ ...p, stock: p.stock + bulkStockAdjustment });
      }
    });
    setMessage(`Restocked ${lowStockItems.length} low-stock items by +${bulkStockAdjustment} units!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCSVImportSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMessage(`Successfully imported catalog from ${e.target.files[0].name}! ${products.length} items verified.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-indigo-950 text-[10px] font-black uppercase tracking-wider">
              Enterprise Stock
            </span>
            <h2 className="text-xl font-black">Inventory Analytics & Barcode Studio</h2>
          </div>
          <p className="text-xs text-indigo-100 mt-1">
            Excel CSV import/export, automated SKU barcode label generator & low-stock auto alerts
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportProductsToCSV(products)}
            className="px-4 py-2.5 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          <label className="px-4 py-2.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900 text-white border border-indigo-400/30 font-black text-xs flex items-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4" /> Import Excel
            <input type="file" accept=".csv, .xlsx" onChange={handleCSVImportSim} className="hidden" />
          </label>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid: Low Stock Alert & Barcode Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts & Quick Restock */}
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Low Stock Auto Alerts</h3>
                <p className="text-[11px] text-slate-400">{lowStockItems.length} products with under 10 units in warehouse</p>
              </div>
            </div>

            <button
              onClick={handleBulkAddStock}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all"
            >
              Restock All (+10)
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 pr-1">
            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">All inventory levels healthy (10+ units)</div>
            ) : (
              lowStockItems.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 font-extrabold text-[11px]">
                      {p.stock} units left
                    </span>
                    <button
                      onClick={() => onUpdateProduct({ ...p, stock: p.stock + 20 })}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                    >
                      +20
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Product Barcode & QR Code Label Generator */}
        {selectedProduct && (
          <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Barcode className="w-5 h-5 text-indigo-400" />
                <span>Barcode & SKU Thermal Label</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Standard EAN-13/SKU</span>
            </div>

            <div className="flex items-center gap-3">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-slate-100 truncate">{selectedProduct.name}</p>
                <p className="text-[11px] text-slate-400">Brand: {selectedProduct.brand} • Price: {formatPrice(selectedProduct.price)}</p>
              </div>
            </div>

            {/* Generated SVG Barcode Box */}
            <div
              className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center space-y-2 shadow-inner"
              dangerouslySetInnerHTML={{ __html: generateSKUBarcodeSVG(selectedProduct.sku) }}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">SKU Code: <strong className="text-white font-mono">{selectedProduct.sku}</strong></span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] transition-all"
              >
                Print Thermal Sticker
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Bulk Edit Table */}
      <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-100">
            Bulk Product Inventory List ({products.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs ${
                darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Price (BDT)</th>
                <th className="py-2.5 px-3">Stock Units</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0" />
                    <span className="font-bold text-slate-200 truncate max-w-xs">{p.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{p.sku}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{formatPrice(p.price)}</td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => onUpdateProduct({ ...p, stock: Number(e.target.value) })}
                      className={`w-20 px-2 py-1 rounded-lg border text-xs font-bold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedProductId(p.id)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 font-bold text-[11px]"
                    >
                      Barcode
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

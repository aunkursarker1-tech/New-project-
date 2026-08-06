import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingBag,
  Users,
  Tag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Truck,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Product, Order, Customer, Coupon, CategoryType, OrderStatus } from '../types';
import { formatPrice } from '../utils/helpers';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  onAddProduct: (newProd: Product) => void;
  onUpdateProduct: (updatedProd: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddCoupon: (newCoupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  darkMode,
  products,
  orders,
  customers,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddCoupon,
  onDeleteCoupon,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons'>('overview');

  // Product Add/Edit Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [pName, setPName] = useState('');
  const [pNameBn, setPNameBn] = useState('');
  const [pBrand, setPBrand] = useState('Baseus');
  const [pCategory, setPCategory] = useState<CategoryType>('Gadgets');
  const [pPrice, setPPrice] = useState(2500);
  const [pOriginalPrice, setPOriginalPrice] = useState(3000);
  const [pStock, setPStock] = useState(20);
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [pDescription, setPDescription] = useState('Official high quality Bangladeshi imported gadget.');
  const [pIsFlashSale, setPIsFlashSale] = useState(false);

  // New Coupon Form State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('fixed');
  const [cValue, setCValue] = useState(150);
  const [cMinSpend, setCMinSpend] = useState(1000);

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName) return;

    const discountPercent = Math.round(((pOriginalPrice - pPrice) / pOriginalPrice) * 100);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: pName,
        nameBn: pNameBn,
        brand: pBrand,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        discountPercent: Math.max(0, discountPercent),
        stock: Number(pStock),
        image: pImage,
        description: pDescription,
        isFlashSale: pIsFlashSale,
      };
      onUpdateProduct(updated);
    } else {
      const newP: Product = {
        id: `prod-${Date.now()}`,
        name: pName,
        nameBn: pNameBn,
        brand: pBrand,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        discountPercent: Math.max(0, discountPercent),
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(pStock),
        image: pImage,
        gallery: [pImage],
        description: pDescription,
        specs: { Warranty: '6 Months Official Warranty' },
        warrantyInfo: '6 Months Official Warranty',
        sku: `GG-${pBrand.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        availabilityDhaka: true,
        availabilityOutside: true,
        tags: [pBrand, pCategory],
        isFlashSale: pIsFlashSale,
      };
      onAddProduct(newP);
    }

    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;
    const newC: Coupon = {
      code: cCode.toUpperCase(),
      discountType: cType,
      value: Number(cValue),
      minSpend: Number(cMinSpend),
      description: `${cCode.toUpperCase()} promo discount code`,
      expiryDate: '2026-12-31',
    };
    onAddCoupon(newC);
    setShowAddCouponModal(false);
    setCCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"></div>

      <div
        className={`relative w-full max-w-6xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 ${
          darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Gadgetghor BD Admin Control Dashboard</h2>
              <p className="text-[11px] text-slate-400">Real-time inventory, orders, discount coupons & buyers</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'products' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Package className="w-4 h-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Tag className="w-4 h-4" /> Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'customers' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" /> Customers ({customers.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Store Sales</span>
                  <div className="text-2xl font-black text-emerald-400">{formatPrice(totalRevenue)}</div>
                  <p className="text-[10px] text-emerald-300">Across all bKash, Nagad & COD orders</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Orders</span>
                  <div className="text-2xl font-black text-cyan-400">{totalOrdersCount}</div>
                  <p className="text-[10px] text-cyan-300">Dispatched via Steadfast & Pathao</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-slate-900 border border-amber-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Low Stock Warning</span>
                  <div className="text-2xl font-black text-amber-400">{lowStockProducts.length} Items</div>
                  <p className="text-[10px] text-amber-300">Under 10 units remaining</p>
                </div>
              </div>

              {/* Low Stock Table */}
              {lowStockProducts.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Restock Urgently
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-bold truncate max-w-[200px]">{p.name}</span>
                        <span className="font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10">
                          {p.stock} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Catalog Inventory ({products.length})</h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setPName('');
                    setPPrice(2500);
                    setPOriginalPrice(3000);
                    setPStock(20);
                    setShowAddProductModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Brand</th>
                      <th className="py-2.5 px-3">Price (BDT)</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-3 flex items-center gap-2">
                          <img src={p.image} alt="" className="w-9 h-9 object-cover rounded-lg bg-slate-950" />
                          <span className="font-bold line-clamp-1">{p.name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-400">{p.brand}</td>
                        <td className="py-2.5 px-3 font-bold">{formatPrice(p.price)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock < 10 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setPName(p.name);
                              setPNameBn(p.nameBn || '');
                              setPBrand(p.brand);
                              setPCategory(p.category);
                              setPPrice(p.price);
                              setPOriginalPrice(p.originalPrice);
                              setPStock(p.stock);
                              setPImage(p.image);
                              setPDescription(p.description);
                              setPIsFlashSale(!!p.isFlashSale);
                              setShowAddProductModal(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold">Manage Orders & Dispatch</h3>
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <span className="font-mono font-black text-emerald-400 text-sm">#{ord.id}</span>
                        <span className="text-slate-400 ml-2">Customer: {ord.shippingAddress.fullName} ({ord.shippingAddress.phone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-bold border border-slate-700 outline-none text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Address: {ord.shippingAddress.fullAddress}, {ord.shippingAddress.division}</span>
                      <strong className="text-emerald-400">{formatPrice(ord.total)} ({ord.paymentMethod})</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Active Promo Coupons</h3>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-black text-emerald-400 text-sm">{c.code}</span>
                      <p className="text-slate-400 mt-0.5">{c.description}</p>
                    </div>
                    <button
                      onClick={() => onDeleteCoupon(c.code)}
                      className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Registered Bangladeshi Customers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customers.map((cust) => (
                  <div key={cust.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <h4 className="font-bold text-white text-sm">{cust.name}</h4>
                    <p className="text-slate-400">📞 {cust.phone} • {cust.location}</p>
                    <p className="text-emerald-400 font-bold">Total Spent: {formatPrice(cust.totalSpent)} ({cust.totalOrders} Orders)</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal Overlay */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold">{editingProduct ? 'Edit Product' : 'Add New Gadget'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bangla Title (NameBn)</label>
                <input
                  type="text"
                  value={pNameBn}
                  onChange={(e) => setPNameBn(e.target.value)}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Stock</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="flashSaleCheck"
                  checked={pIsFlashSale}
                  onChange={(e) => setPIsFlashSale(e.target.checked)}
                />
                <label htmlFor="flashSaleCheck" className="text-amber-400 font-bold">Include in Flash Sale</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-2 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Overlay */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold">Create Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EID2026"
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none uppercase font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Discount Value (৳)</label>
                <input
                  type="number"
                  required
                  value={cValue}
                  onChange={(e) => setCValue(Number(e.target.value))}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-700 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCouponModal(false)} className="px-3 py-2 rounded bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-bold">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

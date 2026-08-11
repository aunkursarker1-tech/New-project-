import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { Order, Product, OrderStatus } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface DashboardSectionProps {
  darkMode: boolean;
  orders: Order[];
  products: Product[];
  onSelectOrder: (order: Order) => void;
  onNavigateTab: (tab: string) => void;
}

const SALES_DATA_MONTHLY = [
  { name: 'Jan', sales: 450000, orders: 120, profit: 85000 },
  { name: 'Feb', sales: 520000, orders: 145, profit: 98000 },
  { name: 'Mar', sales: 610000, orders: 170, profit: 115000 },
  { name: 'Apr', sales: 580000, orders: 160, profit: 108000 },
  { name: 'May', sales: 740000, orders: 210, profit: 142000 },
  { name: 'Jun', sales: 890000, orders: 260, profit: 175000 },
  { name: 'Jul', sales: 1120000, orders: 340, profit: 220000 },
  { name: 'Aug', sales: 1280000, orders: 390, profit: 255000 },
];

const SALES_DATA_WEEKLY = [
  { name: 'Mon', sales: 85000, orders: 24, profit: 16000 },
  { name: 'Tue', sales: 112000, orders: 32, profit: 22000 },
  { name: 'Wed', sales: 94000, orders: 28, profit: 18500 },
  { name: 'Thu', sales: 145000, orders: 41, profit: 29000 },
  { name: 'Fri', sales: 198000, orders: 58, profit: 38000 },
  { name: 'Sat', sales: 210000, orders: 62, profit: 41000 },
  { name: 'Sun', sales: 175000, orders: 49, profit: 34000 },
];

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  darkMode,
  orders,
  products,
  onSelectOrder,
  onNavigateTab,
}) => {
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0) + 1280000; // Base total
  const totalOrdersCount = orders.length + 390;
  const estimatedVisitors = 48500;
  const conversionRate = 3.82;
  const netProfit = Math.round(totalSales * 0.22);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const chartData = chartTimeframe === 'monthly' ? SALES_DATA_MONTHLY : SALES_DATA_WEEKLY;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-2xl font-black">{formatPrice(totalSales)}</h4>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-2xl font-black">{totalOrdersCount}</h4>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-cyan-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.1%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">steep growth</span>
            </div>
          </div>
        </div>

        {/* Total Net Profit */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Profit</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-2xl font-black text-purple-400">{formatPrice(netProfit)}</h4>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-purple-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+22.0%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">est. 22% margin</span>
            </div>
          </div>
        </div>

        {/* Visitors */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Visitors</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-2xl font-black">{estimatedVisitors.toLocaleString()}</h4>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.8%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">Dhaka & CTG</span>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-2xl font-black">{conversionRate}%</h4>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0.4%</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">bKash checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart & Quick Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Store Sales & Profit Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time revenue stream in BDT (৳)</p>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setChartTimeframe('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartTimeframe === 'weekly' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartTimeframe === 'monthly' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    color: darkMode ? '#ffffff' : '#0f172a',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()} BDT`, 'Amount']}
                />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGradient)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#profitGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & Quick Actions */}
        <div className={`p-6 rounded-3xl border space-y-5 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-base font-extrabold flex items-center justify-between">
            <span>Order Pipeline</span>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              View All Orders →
            </button>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Pending</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{pendingCount}</div>
              <p className="text-[10px] text-amber-300">Requires bKash / Address verification</p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Processing</span>
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{processingCount}</div>
              <p className="text-[10px] text-cyan-300">Packing at Outlet</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Shipped</span>
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{shippedCount}</div>
              <p className="text-[10px] text-indigo-300">Pathao / Courier</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Delivered</span>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{deliveredCount}</div>
              <p className="text-[10px] text-emerald-300 font-semibold">Completed</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/50 space-y-2">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Quick Admin Shortcuts</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => onNavigateTab('add-product')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-left"
              >
                + Add New Gadget
              </button>
              <button
                onClick={() => onNavigateTab('coupons')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-left"
              >
                + Create Coupon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold">Recent Orders Dispatch</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest live customer orders with product pictures and customer profiles</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Manage All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Pictures</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total (BDT)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">#{ord.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {ord.shippingAddress.fullName ? ord.shippingAddress.fullName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-100 truncate">{ord.shippingAddress.fullName}</p>
                        <span className="text-[11px] text-slate-400 block truncate">📞 {ord.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex -space-x-2 overflow-hidden shrink-0">
                        {ord.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              title={`${item.product.name} (${item.quantity}x)`}
                              className="inline-block h-9 w-9 rounded-xl object-cover ring-2 ring-slate-900 bg-slate-800 border border-slate-700/50 shadow-sm"
                            />
                            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[9px] px-1 rounded-full border border-slate-900">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 text-xs truncate max-w-[140px]">
                          {ord.items[0]?.product.name || 'Product'}
                        </p>
                        {ord.items.length > 1 ? (
                          <span className="text-[10px] text-emerald-400 font-extrabold">
                            +{ord.items.length - 1} more item{ord.items.length - 1 > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatPrice(ord.items[0]?.product.price || 0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="font-semibold">{ord.shippingAddress.district}</span>
                    <span className="text-[10px] text-slate-400 block">{ord.shippingAddress.division}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-100">{formatPrice(ord.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'Shipped'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : ord.status === 'Processing'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(ord)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-1 ml-auto text-xs font-bold"
                    >
                      <FileText className="w-3.5 h-3.5" /> Invoice
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

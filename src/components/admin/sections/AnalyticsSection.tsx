import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Globe,
  DollarSign,
  Calendar,
  ShoppingBag,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import { Order, Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';

interface AnalyticsSectionProps {
  darkMode: boolean;
  orders: Order[];
  products: Product[];
}

const REGION_SALES_DATA = [
  { name: 'Dhaka Division (Metropolitan)', value: 680000, color: '#10b981' },
  { name: 'Chittagong Division', value: 340000, color: '#06b6d4' },
  { name: 'Sylhet Division', value: 180000, color: '#a855f7' },
  { name: 'Rajshahi & Khulna', value: 140000, color: '#f59e0b' },
  { name: 'Other Divisions', value: 90000, color: '#ef4444' },
];

const TOP_SELLING_PRODUCTS = [
  { name: 'Anker Soundcore Motion+', sales: 128, revenue: 1209600 },
  { name: 'Baseus 100W Powerbank', sales: 94, revenue: 587500 },
  { name: 'Haylou Solar Plus RT3', sales: 156, revenue: 600600 },
  { name: 'OnePlus Nord Buds 2r', sales: 210, revenue: 556500 },
  { name: 'Xiaomi C300 2K Camera', sales: 88, revenue: 303600 },
];

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  darkMode,
  orders,
  products,
}) => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Business Intelligence & Store Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Deep financial overview, geographic distribution & product performance</p>
        </div>

        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateRange === 'today' ? 'bg-emerald-500 text-slate-950 shadow' : ''}`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateRange === 'week' ? 'bg-emerald-500 text-slate-950 shadow' : ''}`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateRange === 'month' ? 'bg-emerald-500 text-slate-950 shadow' : ''}`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateRange === 'year' ? 'bg-emerald-500 text-slate-950 shadow' : ''}`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Top 5 Best Sellers Bar Chart */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" /> Top Revenue Generating Products (BDT ৳)
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_SELLING_PRODUCTS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
              <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
              <YAxis
                stroke={darkMode ? '#94a3b8' : '#64748b'}
                fontSize={11}
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
                formatter={(value: any) => [`৳${Number(value).toLocaleString()} BDT`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Demographics Pie Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" /> Geographic Order Distribution (Bangladesh)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGION_SALES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REGION_SALES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()} BDT`, 'Sales']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courier Performance & Payment Methods Breakdown */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Payment & Courier Fulfillment Breakdown
          </h3>

          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex justify-between font-bold text-emerald-400">
                <span>bKash & Nagad Digital Payment Ratio</span>
                <span>64% of Orders</span>
              </div>
              <p className="text-[11px] text-slate-300">Prepaid orders significantly lower COD return rates by 85%.</p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
              <div className="flex justify-between font-bold text-cyan-400">
                <span>Express Courier (Same Day / Next Day)</span>
                <span>72% Fulfillment</span>
              </div>
              <p className="text-[11px] text-slate-300">Average delivery speed in Dhaka: 14 hours.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <div className="flex justify-between font-bold text-purple-400">
                <span>Pathao Courier (Outside Dhaka)</span>
                <span>28% Fulfillment</span>
              </div>
              <p className="text-[11px] text-slate-300">Average delivery speed in CTG / Sylhet: 48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

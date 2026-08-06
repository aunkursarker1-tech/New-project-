import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  UserX,
  UserCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingDown,
  BarChart2,
  MapPin,
  Smartphone,
  Mail,
  Ban,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Info
} from 'lucide-react';
import { Order, BlacklistItem, WhitelistItem, RiskLevel, FraudStatus, BlacklistType } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import { evaluateOrderFraudRisk } from '../../../utils/fraudDetection';

interface FraudManagementSectionProps {
  darkMode: boolean;
  orders: Order[];
  blacklists: BlacklistItem[];
  whitelists: WhitelistItem[];
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onUpdateFraudStatus: (orderId: string, fraudStatus: FraudStatus, score?: number) => void;
  onAddBlacklist: (item: BlacklistItem) => void;
  onRemoveBlacklist: (id: string) => void;
  onAddWhitelist: (item: WhitelistItem) => void;
  onRemoveWhitelist: (id: string) => void;
  onSelectOrderInvoice: (order: Order) => void;
}

export const FraudManagementSection: React.FC<FraudManagementSectionProps> = ({
  darkMode,
  orders,
  blacklists,
  whitelists,
  onUpdateOrderStatus,
  onUpdateFraudStatus,
  onAddBlacklist,
  onRemoveBlacklist,
  onAddWhitelist,
  onRemoveWhitelist,
  onSelectOrderInvoice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'blacklists' | 'whitelists' | 'analytics'>('stream');

  // Filters for Suspicious Orders Stream
  const [riskFilter, setRiskFilter] = useState<'All' | 'High Risk' | 'Medium Risk' | 'Low Risk'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Review' | 'Approved' | 'Held' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Blacklist Form Modal
  const [isAddBlacklistOpen, setIsAddBlacklistOpen] = useState(false);
  const [blkType, setBlkType] = useState<BlacklistType>('phone');
  const [blkValue, setBlkValue] = useState('');
  const [blkReason, setBlkReason] = useState('');

  // Whitelist Form Modal
  const [isAddWhitelistOpen, setIsAddWhitelistOpen] = useState(false);
  const [whtType, setWhtType] = useState<'phone' | 'email'>('phone');
  const [whtValue, setWhtValue] = useState('');
  const [whtNote, setWhtNote] = useState('');

  // Quick Block Modal for an order
  const [blockingOrder, setBlockingOrder] = useState<Order | null>(null);
  const [blockTargetType, setBlockTargetType] = useState<'phone' | 'email' | 'address'>('phone');
  const [blockReasonInput, setBlockReasonInput] = useState('Repeated fake order or suspicious activity');

  // Metrics
  const totalAnalyzed = orders.length;
  const highRiskOrders = orders.filter((o) => (o.fraudScore || 0) >= 70 || o.riskLevel === 'High Risk');
  const mediumRiskOrders = orders.filter((o) => (o.fraudScore || 0) >= 30 && (o.fraudScore || 0) < 70);
  const lowRiskOrders = orders.filter((o) => (o.fraudScore || 0) < 30);
  const heldOrders = orders.filter((o) => o.fraudStatus === 'Held');

  const estimatedPreventedLoss = highRiskOrders.reduce((acc, o) => acc + o.total, 0);

  // Filtered Orders Stream
  const filteredOrders = orders.filter((ord) => {
    const score = ord.fraudScore || 0;
    const level = ord.riskLevel || (score >= 70 ? 'High Risk' : score >= 30 ? 'Medium Risk' : 'Low Risk');

    if (riskFilter !== 'All' && level !== riskFilter) return false;
    if (statusFilter !== 'All' && ord.fraudStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.shippingAddress.fullName.toLowerCase().includes(q);
      const matchPhone = ord.shippingAddress.phone.includes(q);
      const matchEmail = (ord.shippingAddress.email || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchEmail;
    }
    return true;
  });

  const handleConfirmAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blkValue.trim() || !blkReason.trim()) return;

    const newItem: BlacklistItem = {
      id: `blk-${Date.now()}`,
      type: blkType,
      value: blkValue.trim(),
      reason: blkReason.trim(),
      addedAt: new Date().toISOString(),
      addedBy: 'Admin Portal',
      matchedCount: 0,
    };

    onAddBlacklist(newItem);
    setBlkValue('');
    setBlkReason('');
    setIsAddBlacklistOpen(false);
  };

  const handleConfirmAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whtValue.trim()) return;

    const newItem: WhitelistItem = {
      id: `wht-${Date.now()}`,
      type: whtType,
      value: whtValue.trim(),
      note: whtNote.trim() || 'Trusted Customer Whitelisted by Admin',
      addedAt: new Date().toISOString(),
    };

    onAddWhitelist(newItem);
    setWhtValue('');
    setWhtNote('');
    setIsAddWhitelistOpen(false);
  };

  const handleExecuteQuickBlock = () => {
    if (!blockingOrder) return;

    let targetValue = '';
    if (blockTargetType === 'phone') targetValue = blockingOrder.shippingAddress.phone;
    if (blockTargetType === 'email') targetValue = blockingOrder.shippingAddress.email || '';
    if (blockTargetType === 'address') targetValue = blockingOrder.shippingAddress.fullAddress;

    if (!targetValue) return;

    const newItem: BlacklistItem = {
      id: `blk-${Date.now()}`,
      type: blockTargetType,
      value: targetValue,
      reason: `${blockReasonInput} (Flagged from Order #${blockingOrder.id})`,
      addedAt: new Date().toISOString(),
      addedBy: 'Admin Quick Block',
      matchedCount: 1,
    };

    onAddBlacklist(newItem);
    onUpdateFraudStatus(blockingOrder.id, 'Held', 95);
    onUpdateOrderStatus(blockingOrder.id, 'Cancelled');

    setBlockingOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                Fraud Detection & Order Risk System
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold uppercase tracking-wider">
                  Live AI Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated 0-100 score evaluation, duplicate detection, disposable email checks & blacklist enforcement
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddBlacklistOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition-all flex items-center gap-2"
          >
            <UserX className="w-4 h-4" />
            <span>Blacklist Phone/Email</span>
          </button>
          <button
            onClick={() => setIsAddWhitelistOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 font-bold text-xs transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Whitelist Trusted</span>
          </button>
        </div>
      </div>

      {/* Top Fraud Analytics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Total Analyzed</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">{totalAnalyzed}</p>
          <p className="text-[10px] text-slate-400 mt-1">100% orders scanned</p>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-400">High Risk (Held)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">{highRiskOrders.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">{heldOrders.length} currently held for review</p>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400">Medium Risk</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{mediumRiskOrders.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Requires call verification</p>
        </div>

        <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Blacklisted Rules</span>
            <Ban className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">{blacklists.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Active phone/email blocks</p>
        </div>

        <div className={`p-4 rounded-3xl border col-span-2 lg:col-span-1 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400">Loss Prevented</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400 mt-2">{formatPrice(estimatedPreventedLoss)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Saved from potential returned COD</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('stream')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'stream'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Suspicious Orders Stream ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('blacklists')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'blacklists'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Blacklist Management ({blacklists.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('whitelists')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'whitelists'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Trusted Whitelist ({whitelists.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'analytics'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Fraud Analytics & Insights</span>
        </button>
      </div>

      {/* Tab 1: Suspicious Orders Stream */}
      {activeSubTab === 'stream' && (
        <div className="space-y-4">
          {/* Search & Filter Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, phone number, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 outline-none focus:border-rose-500"
              >
                <option value="All">All Risk Levels</option>
                <option value="High Risk">🔴 High Risk (70-100)</option>
                <option value="Medium Risk">🟡 Medium Risk (30-69)</option>
                <option value="Low Risk">🟢 Low Risk (0-29)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 outline-none focus:border-rose-500"
              >
                <option value="All">All Fraud Statuses</option>
                <option value="Held">🚨 Held Orders</option>
                <option value="Pending Review">⏳ Pending Review</option>
                <option value="Approved">✅ Approved</option>
                <option value="Rejected">❌ Rejected</option>
              </select>
            </div>
          </div>

          {/* Orders Stream List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-slate-200">No suspicious orders matching criteria</h3>
                <p className="text-xs text-slate-400 mt-1">All clean orders are flowing normally without fraud alerts.</p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const score = ord.fraudScore !== undefined ? ord.fraudScore : 15;
                const riskLevel: RiskLevel = ord.riskLevel || (score >= 70 ? 'High Risk' : score >= 30 ? 'Medium Risk' : 'Low Risk');
                const reasons = ord.riskReasons || ['Automated risk validation checks passed'];

                const isHigh = riskLevel === 'High Risk';
                const isMedium = riskLevel === 'Medium Risk';

                return (
                  <div
                    key={ord.id}
                    className={`p-5 rounded-3xl border transition-all space-y-4 ${
                      isHigh
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-950/20'
                        : isMedium
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {/* Top Row: Order ID, Risk Meter, Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-sm text-emerald-400">#{ord.id}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(ord.createdAt).toLocaleString()}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Risk Gauge Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fraud Score:</span>
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs border"
                            style={{
                              backgroundColor: isHigh ? '#450a0a' : isMedium ? '#451a03' : '#022c22',
                              borderColor: isHigh ? '#f43f5e' : isMedium ? '#f59e0b' : '#10b981',
                              color: isHigh ? '#fda4af' : isMedium ? '#fde68a' : '#a7f3d0'
                            }}
                          >
                            <span className="text-sm">{score}/100</span>
                            <span className="text-[10px] uppercase font-black tracking-wide">
                              • {riskLevel}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                          ord.fraudStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          ord.fraudStatus === 'Held' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {ord.fraudStatus || 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Grid: Customer Details + Detection Reasons */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Customer Profile</span>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {ord.shippingAddress.fullName ? ord.shippingAddress.fullName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-100 text-xs">{ord.shippingAddress.fullName}</p>
                            <p className="text-[11px] text-slate-400 font-medium">📞 {ord.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/60">
                          {ord.shippingAddress.email && <p className="truncate text-slate-400">✉️ {ord.shippingAddress.email}</p>}
                          <p className="text-slate-300 truncate">📍 {ord.shippingAddress.fullAddress}</p>
                          <p className="text-emerald-400 font-semibold">{ord.shippingAddress.thana}, {ord.shippingAddress.district}</p>
                        </div>

                        {/* Customer History Stats */}
                        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/60 font-bold">
                          <span className="text-slate-400">Past Delivery Success:</span>
                          <span className="text-emerald-400 font-black">
                            {ord.previousDeliverySuccessRate || 100}% ({ord.pastOrderCount || 1} past orders)
                          </span>
                        </div>
                      </div>

                      {/* Flagged Detection Reasons */}
                      <div className="lg:col-span-2 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black text-rose-400 tracking-wider flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Risk Detection Reasons ({reasons.length})
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">IP: {ord.customerIp || '103.112.44.18'}</span>
                        </div>

                        <div className="space-y-1.5">
                          {reasons.map((r, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                              <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isHigh ? 'text-rose-400' : 'text-amber-400'}`} />
                              <span className="text-slate-200 font-medium">{r}</span>
                            </div>
                          ))}
                        </div>

                        {/* Recommended Action */}
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          isHigh ? 'bg-rose-950/50 border-rose-500/30 text-rose-200' :
                          isMedium ? 'bg-amber-950/50 border-amber-500/30 text-amber-200' :
                          'bg-emerald-950/50 border-emerald-500/30 text-emerald-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 shrink-0" />
                            <span className="font-bold">
                              Recommended Action: {
                                isHigh ? 'Hold order & require ৳200 bKash deposit before delivery dispatch' :
                                isMedium ? 'Phone verification call recommended to confirm receiver' :
                                'Safe to process automatically'
                              }
                            </span>
                          </div>
                          <span className="font-black text-white shrink-0">{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectOrderInvoice(ord)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>

                        <button
                          onClick={() => setBlockingOrder(ord)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Block Customer/Phone</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.fraudStatus !== 'Approved' && (
                          <button
                            onClick={() => {
                              onUpdateFraudStatus(ord.id, 'Approved', 10);
                              onUpdateOrderStatus(ord.id, 'Processing');
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Pass Order</span>
                          </button>
                        )}

                        {ord.fraudStatus !== 'Held' && (
                          <button
                            onClick={() => onUpdateFraudStatus(ord.id, 'Held')}
                            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Hold Order</span>
                          </button>
                        )}

                        {ord.fraudStatus !== 'Rejected' && (
                          <button
                            onClick={() => {
                              onUpdateFraudStatus(ord.id, 'Rejected', 95);
                              onUpdateOrderStatus(ord.id, 'Cancelled');
                            }}
                            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject & Cancel Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Blacklist Management */}
      {activeSubTab === 'blacklists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100">Store Blacklist Rules</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Orders matching these phones, emails, addresses, or IP ranges will automatically get 100 Risk Score and be Held.
              </p>
            </div>

            <button
              onClick={() => setIsAddBlacklistOpen(true)}
              className="px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Blacklist Rule</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Value / Pattern</th>
                  <th className="py-3.5 px-4">Reason for Blocking</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4">Added By</th>
                  <th className="py-3.5 px-4 text-center">Matches</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {blacklists.map((blk) => (
                  <tr key={blk.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        blk.type === 'phone' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        blk.type === 'email' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        blk.type === 'address' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {blk.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{blk.value}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{blk.reason}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(blk.addedAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-slate-400">{blk.addedBy || 'Admin'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold text-[11px]">
                        {blk.matchedCount || 0} times
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onRemoveBlacklist(blk.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Whitelist Management */}
      {activeSubTab === 'whitelists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100">Trusted Customer Whitelist</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                VIP buyers, corporate clients, and verified repeat customers whose orders bypass strict risk flags.
              </p>
            </div>

            <button
              onClick={() => setIsAddWhitelistOpen(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              <span>Add Whitelist Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whitelists.map((wht) => (
              <div key={wht.id} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      {wht.type}
                    </span>
                    <span className="font-mono font-bold text-slate-100 text-sm">{wht.value}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{wht.note}</p>
                  <p className="text-[10px] text-slate-400">Added: {new Date(wht.addedAt).toLocaleDateString()}</p>
                </div>

                <button
                  onClick={() => onRemoveWhitelist(wht.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Fraud Analytics & Insights */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Level Distribution */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-200">Risk Score Breakdown Distribution</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-emerald-400">Low Risk (0-29) - Safe</span>
                    <span>{lowRiskOrders.length} orders ({Math.round((lowRiskOrders.length / (totalAnalyzed || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(lowRiskOrders.length / (totalAnalyzed || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-amber-400">Medium Risk (30-69) - Review</span>
                    <span>{mediumRiskOrders.length} orders ({Math.round((mediumRiskOrders.length / (totalAnalyzed || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(mediumRiskOrders.length / (totalAnalyzed || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-rose-400">High Risk (70-100) - Held</span>
                    <span>{highRiskOrders.length} orders ({Math.round((highRiskOrders.length / (totalAnalyzed || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(highRiskOrders.length / (totalAnalyzed || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Flagged Reasons Breakdown */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-200">Top Automated Risk Triggers</h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-slate-300">1. High-Value Order (&gt; ৳15,000) from New Customer</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">28% of flags</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-slate-300">2. Duplicate Phone / Multi-Name Accounts</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">24% of flags</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-slate-300">3. Disposable / Temp Mail Address</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">18% of flags</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-slate-300">4. Address Pattern Matches Blacklist</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">15% of flags</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Blacklist Modal */}
      {isAddBlacklistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-rose-400">Add New Blacklist Rule</h3>
              <button onClick={() => setIsAddBlacklistOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAddBlacklist} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Target Rule Type</label>
                <select
                  value={blkType}
                  onChange={(e) => setBlkType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-rose-500"
                >
                  <option value="phone">Phone Number</option>
                  <option value="email">Email Address</option>
                  <option value="address">Delivery Address / Area</option>
                  <option value="ip">IP Address</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Value / Pattern</label>
                <input
                  type="text"
                  required
                  value={blkValue}
                  onChange={(e) => setBlkValue(e.target.value)}
                  placeholder={blkType === 'phone' ? '01911223344' : blkType === 'email' ? 'spammer@tempmail.com' : 'Full address or area keyword'}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Reason for Blacklisting</label>
                <textarea
                  required
                  rows={2}
                  value={blkReason}
                  onChange={(e) => setBlkReason(e.target.value)}
                  placeholder="e.g. Returned 4 consecutive COD parcels"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBlacklistOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-black hover:bg-rose-600"
                >
                  Block Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Whitelist Modal */}
      {isAddWhitelistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-emerald-400">Add Trusted Whitelist Member</h3>
              <button onClick={() => setIsAddWhitelistOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAddWhitelist} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Whitelist Type</label>
                <select
                  value={whtType}
                  onChange={(e) => setWhtType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500"
                >
                  <option value="phone">Phone Number</option>
                  <option value="email">Email Address</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Value</label>
                <input
                  type="text"
                  required
                  value={whtValue}
                  onChange={(e) => setWhtValue(e.target.value)}
                  placeholder="01712345678"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Notes / VIP Details</label>
                <input
                  type="text"
                  value={whtNote}
                  onChange={(e) => setWhtNote(e.target.value)}
                  placeholder="VIP Loyal Customer - Over ৳50,000 lifetime sales"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWhitelistOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400"
                >
                  Add Whitelist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Block Modal for an Order */}
      {blockingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-rose-400">Block Customer from Order #{blockingOrder.id}</h3>
              <button onClick={() => setBlockingOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Select which attribute to add to the permanent store blacklist:
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="blockType"
                    checked={blockTargetType === 'phone'}
                    onChange={() => setBlockTargetType('phone')}
                    className="accent-rose-500"
                  />
                  <div>
                    <span className="font-bold text-white block">Phone Number</span>
                    <span className="text-slate-400 font-mono">{blockingOrder.shippingAddress.phone}</span>
                  </div>
                </label>

                {blockingOrder.shippingAddress.email && (
                  <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="blockType"
                      checked={blockTargetType === 'email'}
                      onChange={() => setBlockTargetType('email')}
                      className="accent-rose-500"
                    />
                    <div>
                      <span className="font-bold text-white block">Email Address</span>
                      <span className="text-slate-400">{blockingOrder.shippingAddress.email}</span>
                    </div>
                  </label>
                )}

                <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="blockType"
                    checked={blockTargetType === 'address'}
                    onChange={() => setBlockTargetType('address')}
                    className="accent-rose-500"
                  />
                  <div>
                    <span className="font-bold text-white block">Full Delivery Address</span>
                    <span className="text-slate-400 truncate max-w-xs block">{blockingOrder.shippingAddress.fullAddress}</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Reason for Block</label>
                <input
                  type="text"
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteQuickBlock}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-black hover:bg-rose-600"
                >
                  Confirm Block & Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

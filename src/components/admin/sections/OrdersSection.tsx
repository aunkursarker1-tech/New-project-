import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  Send,
  Printer,
  ShieldAlert,
  Barcode,
  XCircle,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus, CourierName } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import {
  dispatchOrderToCourier,
  fetchLiveTracking,
  cancelShipmentApi,
  generateConsignmentApi,
  printLabelApi
} from '../../../services/courierClient';

interface OrdersSectionProps {
  darkMode: boolean;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateCourierInfo?: (orderId: string, courierName: any, trackingNumber: string) => void;
  onSelectOrderInvoice: (order: Order) => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  darkMode,
  orders,
  onUpdateOrderStatus,
  onUpdateCourierInfo,
  onSelectOrderInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [tempTrackingNum, setTempTrackingNum] = useState('');
  const [tempCourierName, setTempCourierName] = useState<CourierName>('Pathao Courier');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal states for Tracking, Consignment, Label
  const [activeModalData, setActiveModalData] = useState<{ title: string; content: string; type: 'tracking' | 'label' | 'consignment' } | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');
  const [errorToast, setErrorToast] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.phone.includes(searchTerm) ||
      (o.bkashTrxId && o.bkashTrxId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleSaveCourier = (orderId: string) => {
    if (onUpdateCourierInfo) {
      onUpdateCourierInfo(orderId, tempCourierName, tempTrackingNum);
    }
    setEditingTrackingId(null);
    setSuccessToast(`Courier tracking updated for order #${orderId}`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleCreateShipment = async (order: Order) => {
    setActionLoadingId(order.id);
    try {
      const res = await dispatchOrderToCourier(order, order.courierName || 'Pathao Courier');
      if (res.success && onUpdateCourierInfo) {
        onUpdateCourierInfo(order.id, res.courierName, res.trackingNumber);
        onUpdateOrderStatus(order.id, 'Shipped');
        setSuccessToast(`✅ Shipment created successfully! Tracking #: ${res.trackingNumber}`);
      } else {
        throw new Error(res.message || 'Failed to create shipment');
      }
    } catch (e: any) {
      setErrorToast(`❌ Create Shipment Error: ${e?.message}`);
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSuccessToast(''), 4000);
      setTimeout(() => setErrorToast(''), 4000);
    }
  };

  const handleTrackShipment = async (order: Order) => {
    setActionLoadingId(order.id);
    try {
      const trackingNum = order.courierTrackingNumber || order.id;
      const res = await fetchLiveTracking(trackingNum, order.courierName);
      if (res.success) {
        setActiveModalData({
          title: `Live Tracking: ${trackingNum} (${res.courierName})`,
          type: 'tracking',
          content: JSON.stringify(res, null, 2),
        });
      } else {
        throw new Error('Could not fetch tracking details');
      }
    } catch (e: any) {
      setErrorToast(`Tracking Error: ${e?.message}`);
      setTimeout(() => setErrorToast(''), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelShipment = async (order: Order) => {
    if (!order.courierTrackingNumber) {
      setErrorToast('No tracking number assigned to cancel shipment.');
      setTimeout(() => setErrorToast(''), 4000);
      return;
    }
    setActionLoadingId(order.id);
    try {
      const res = await cancelShipmentApi(order.courierTrackingNumber, order.courierName);
      if (res.success) {
        setSuccessToast(`✅ Shipment ${order.courierTrackingNumber} cancelled successfully.`);
        onUpdateOrderStatus(order.id, 'Cancelled');
      }
    } catch (e: any) {
      setErrorToast(`Cancel Error: ${e?.message}`);
      setTimeout(() => setErrorToast(''), 4000);
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const handleGenerateConsignment = async (order: Order) => {
    setActionLoadingId(order.id);
    try {
      const res = await generateConsignmentApi(order.id, order.courierTrackingNumber || 'ST-9921', order.courierName);
      if (res.success) {
        setActiveModalData({
          title: `Consignment Barcode (Order #${order.id})`,
          type: 'consignment',
          content: `Consignment ID: ${res.consignmentId}\nBarcode URL: ${res.barcodeUrl}`,
        });
      }
    } catch (e: any) {
      setErrorToast(`Consignment Error: ${e?.message}`);
      setTimeout(() => setErrorToast(''), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePrintLabel = async (order: Order) => {
    setActionLoadingId(order.id);
    try {
      const tracking = order.courierTrackingNumber || 'ST-981240';
      const res = await printLabelApi(tracking);
      if (res.success) {
        setActiveModalData({
          title: `Shipping Label for Order #${order.id}`,
          type: 'label',
          content: res.labelHtml,
        });
      }
    } catch (e: any) {
      setErrorToast(`Print Label Error: ${e?.message}`);
      setTimeout(() => setErrorToast(''), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Order Management & Logistics Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage couriers, track live parcels, cancel orders, and print shipping labels</p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID, Phone, Customer Name, or bKash TrxID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border transition-all ${
                darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="All">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="COD">Cash on Delivery (COD)</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className={`p-6 rounded-3xl border space-y-4 transition-all ${
              darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800/40">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-emerald-400 text-base">#{ord.id}</span>
                <span className="text-xs text-slate-400">Placed on {new Date(ord.createdAt).toLocaleString()}</span>
                {ord.fraudScore !== undefined && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                    (ord.fraudScore || 0) >= 70
                      ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                      : (ord.fraudScore || 0) >= 30
                      ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  }`}>
                    <ShieldAlert className="w-3 h-3 shrink-0" />
                    <span>Risk: {ord.fraudScore}/100</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={ord.status}
                  onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border outline-none ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : ord.status === 'Shipped'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => onSelectOrderInvoice(ord)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <FileText className="w-4 h-4" /> Invoice
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Items Summary */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Purchased Items</span>
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/60">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700/50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-100 text-xs truncate">{item.product.name}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>Qty: <strong className="text-emerald-400">{item.quantity}</strong></span>
                          <span className="font-black text-slate-200">{formatPrice(item.product.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Profile */}
              <div className="space-y-2 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Customer Details</span>
                <p className="font-extrabold text-slate-100 text-sm">{ord.shippingAddress.fullName}</p>
                <p className="text-xs text-slate-400 font-medium">📞 {ord.shippingAddress.phone}</p>
                <p className="text-slate-300">{ord.shippingAddress.fullAddress}</p>
                <p className="text-emerald-400 font-bold">{ord.shippingAddress.thana}, {ord.shippingAddress.district}</p>
              </div>

              {/* Payment & Logistics Control Panel */}
              <div className="space-y-3 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/60">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Payment: <strong className="text-emerald-400">{ord.paymentMethod}</strong></span>
                  <span className="font-black text-sm text-white">{formatPrice(ord.total)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Courier: <strong>{ord.courierName || 'Pathao'}</strong></span>
                    <button
                      onClick={() => {
                        setEditingTrackingId(ord.id);
                        setTempCourierName(ord.courierName);
                        setTempTrackingNum(ord.courierTrackingNumber);
                      }}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {editingTrackingId === ord.id ? (
                    <div className="flex gap-1.5 pt-1">
                      <select
                        value={tempCourierName}
                        onChange={(e: any) => setTempCourierName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1 text-white font-bold"
                      >
                        <option value="Pathao Courier">Pathao</option>
                        <option value="RedX">RedX</option>
                        <option value="Paperfly">Paperfly</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tracking ID..."
                        value={tempTrackingNum}
                        onChange={(e) => setTempTrackingNum(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-[10px] rounded p-1 text-white font-mono"
                      />
                      <button
                        onClick={() => handleSaveCourier(ord.id)}
                        className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="font-mono text-slate-400 text-[11px]">
                      Tracking #: <strong className="text-slate-200">{ord.courierTrackingNumber || 'Unassigned'}</strong>
                    </p>
                  )}
                </div>

                {/* 5 Required Order Logistics Actions */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800">
                  <button
                    disabled={actionLoadingId === ord.id}
                    onClick={() => handleCreateShipment(ord)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Truck className="w-3 h-3" /> Create Shipment
                  </button>

                  <button
                    disabled={actionLoadingId === ord.id}
                    onClick={() => handleTrackShipment(ord)}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Activity className="w-3 h-3" /> Track Status
                  </button>

                  <button
                    disabled={actionLoadingId === ord.id}
                    onClick={() => handleCancelShipment(ord)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-[10px] flex items-center justify-center gap-1 transition-all border border-slate-700"
                  >
                    <XCircle className="w-3 h-3" /> Cancel Parcel
                  </button>

                  <button
                    disabled={actionLoadingId === ord.id}
                    onClick={() => handleGenerateConsignment(ord)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[10px] flex items-center justify-center gap-1 transition-all border border-slate-700"
                  >
                    <Barcode className="w-3 h-3" /> Consignment
                  </button>

                  <button
                    disabled={actionLoadingId === ord.id}
                    onClick={() => handlePrintLabel(ord)}
                    className="col-span-2 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 transition-all shadow"
                  >
                    <Printer className="w-3 h-3" /> Print Shipping Label
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Tracking / Consignment / Label */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm">{activeModalData.title}</h3>
              <button
                onClick={() => setActiveModalData(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {activeModalData.type === 'label' ? (
              <div dangerouslySetInnerHTML={{ __html: activeModalData.content }} className="bg-white text-slate-900 p-4 rounded-2xl" />
            ) : (
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto max-h-64">
                {activeModalData.content}
              </pre>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalData(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Product, Order, SavedAddress, WishlistCollection, BackInStockRequest, AuditLogEntry, CourierApiConfig, AbandonedCart, LoyaltyAccount } from '../types';

// ==================== CSV / EXCEL IMPORT & EXPORT ====================

export function exportProductsToCSV(products: Product[]): void {
  const headers = ['ID', 'Name', 'Brand', 'Category', 'Price', 'Original Price', 'Stock', 'SKU', 'Discount %'];
  const rows = products.map((p) => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.brand}"`,
    `"${p.category}"`,
    p.price,
    p.originalPrice,
    p.stock,
    p.sku,
    p.discountPercent,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `gadgetghor_products_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportOrdersToCSV(orders: Order[]): void {
  const headers = ['Order ID', 'Customer Name', 'Phone', 'Division', 'District', 'Items Count', 'Total BDT', 'Status', 'Courier', 'Tracking No', 'Date'];
  const rows = orders.map((o) => [
    o.id,
    `"${o.shippingAddress.fullName.replace(/"/g, '""')}"`,
    `"${o.shippingAddress.phone}"`,
    `"${o.shippingAddress.division}"`,
    `"${o.shippingAddress.district}"`,
    o.items.reduce((acc, i) => acc + i.quantity, 0),
    o.total,
    o.status,
    o.courierName,
    o.courierTrackingNumber,
    o.createdAt.slice(0, 10),
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `gadgetghor_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== BARCODE & QR CODE GENERATOR ====================

export function generateSKUBarcodeSVG(sku: string): string {
  // Simple clean SVG barcode renderer for SKU visualization
  const bars = sku.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    const width = (code % 3) + 1;
    return { width, space: (index % 2) + 1 };
  });

  let currentX = 10;
  const rects = bars.map((b, idx) => {
    const rect = `<rect x="${currentX}" y="10" width="${b.width * 2}" height="40" fill="#0f172a" />`;
    currentX += b.width * 2 + b.space * 2;
    return rect;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${currentX + 10} 70" class="w-full h-auto">
    <rect width="100%" height="100%" fill="#ffffff" rx="8" />
    ${rects.join('')}
    <text x="${(currentX + 10) / 2}" y="62" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#0f172a">${sku}</text>
  </svg>`;
}

// ==================== RECENTLY VIEWED PRODUCTS ====================

const RECENTLY_VIEWED_KEY = 'gadgetghor_recently_viewed';

export function getRecentlyViewedProductIds(): string[] {
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewedProduct(productId: string): void {
  try {
    const existing = getRecentlyViewedProductIds().filter((id) => id !== productId);
    const updated = [productId, ...existing].slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update recently viewed:', e);
  }
}

// ==================== SAVED ADDRESSES MANAGER ====================

const SAVED_ADDRESSES_KEY = 'gadgetghor_saved_addresses';

export function getSavedAddresses(): SavedAddress[] {
  try {
    const saved = localStorage.getItem(SAVED_ADDRESSES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Default initial saved addresses for BD user
  return [
    {
      id: 'addr-1',
      label: 'Home',
      fullName: 'Ankur Sarker',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      union: 'Central Dhanmondi',
      fullAddress: 'House 24, Road 8/A, Dhanmondi R/A',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      fullName: 'Ankur Sarker',
      phone: '01899887766',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      union: 'Gulshan 2',
      fullAddress: 'Level 12, Crystal Palace, Road 140, Gulshan 2',
      isDefault: false,
    },
  ];
}

export function saveAddress(address: SavedAddress): SavedAddress[] {
  const current = getSavedAddresses();
  const existingIdx = current.findIndex((a) => a.id === address.id);
  let updated: SavedAddress[];
  if (existingIdx >= 0) {
    updated = current.map((a) => (a.id === address.id ? address : a));
  } else {
    updated = [address, ...current];
  }
  if (address.isDefault) {
    updated = updated.map((a) => ({ ...a, isDefault: a.id === address.id }));
  }
  localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
  return updated;
}

// ==================== MULTIPLE WISHLIST COLLECTIONS ====================

const WISHLIST_COLLECTIONS_KEY = 'gadgetghor_wishlist_collections';

export function getWishlistCollections(): WishlistCollection[] {
  try {
    const saved = localStorage.getItem(WISHLIST_COLLECTIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  return [
    { id: 'col-1', name: 'My Favorites', description: 'Default primary collection', productIds: ['prod-1', 'prod-2'], createdAt: new Date().toISOString() },
    { id: 'col-2', name: 'Workplace Setup', description: 'Monitors, mechanical keyboards & audio', productIds: ['prod-3'], createdAt: new Date().toISOString() },
    { id: 'col-3', name: 'Gift Wishlist', description: 'Items to buy for friends and family', productIds: ['prod-4'], createdAt: new Date().toISOString() },
  ];
}

export function saveWishlistCollection(col: WishlistCollection): WishlistCollection[] {
  const current = getWishlistCollections();
  const idx = current.findIndex((c) => c.id === col.id);
  let updated: WishlistCollection[];
  if (idx >= 0) {
    updated = current.map((c) => (c.id === col.id ? col : c));
  } else {
    updated = [...current, col];
  }
  localStorage.setItem(WISHLIST_COLLECTIONS_KEY, JSON.stringify(updated));
  return updated;
}

// ==================== AUDIT TRAIL LOGS ====================

const AUDIT_LOGS_KEY = 'gadgetghor_audit_logs';

export function getAuditLogs(): AuditLogEntry[] {
  try {
    const saved = localStorage.getItem(AUDIT_LOGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  return [
    { id: 'log-1', action: '2FA Session Verification', performedBy: 'Admin (aunkur@gadgetghor.bd)', timestamp: new Date(Date.now() - 3600000).toISOString(), ipAddress: '103.112.44.18', details: 'Successful OTP Login with SMS 2FA', category: 'Security' },
    { id: 'log-2', action: 'Courier Webhook Sync', performedBy: 'Steadfast Courier API', timestamp: new Date(Date.now() - 7200000).toISOString(), ipAddress: '180.211.230.12', details: 'Status updated to Out for Delivery for GG-BD-9021', category: 'Order' },
    { id: 'log-3', action: 'Product Price Updated', performedBy: 'Inventory Manager', timestamp: new Date(Date.now() - 14400000).toISOString(), ipAddress: '103.112.44.18', details: 'Baseus Power Bank 20000mAh price updated from 2800 to 2450 BDT', category: 'Product' },
    { id: 'log-4', action: 'High Risk Order Flagged', performedBy: 'AI Fraud Detection Engine', timestamp: new Date(Date.now() - 28800000).toISOString(), ipAddress: '103.112.44.18', details: 'Order GG-BD-8812 marked as High Risk (Score 88)', category: 'Security' },
  ];
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry[] {
  const current = getAuditLogs();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...current].slice(0, 50);
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  return updated;
}

// ==================== LOYALTY & REFERRALS ====================

export function getLoyaltyInfo(phone: string): LoyaltyAccount {
  const cleanPhone = phone || '01712345678';
  return {
    phone: cleanPhone,
    customerName: 'Valued Customer',
    pointsBalance: 420,
    tier: 'Gold',
    totalEarned: 1250,
    referralCode: `GG-${cleanPhone.slice(-4)}`,
    referralsCount: 6,
  };
}

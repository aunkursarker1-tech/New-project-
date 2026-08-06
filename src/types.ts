export type CategoryType =
  | 'Gadgets'
  | 'Mobile Accessories'
  | 'Smart Home Devices'
  | 'Desk Setup Accessories'
  | 'Gift Boxes'
  | 'Audio Devices';

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  brand: string;
  category: CategoryType;
  subcategory?: string;
  price: number; // in BDT ৳
  originalPrice: number;
  costPrice?: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  status?: 'Draft' | 'Published';
  flashSaleEndTime?: string; // ISO string
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  warrantyInfo: string;
  sku: string;
  colors?: string[];
  availabilityDhaka: boolean; // e.g. Same Day or Next Day
  availabilityOutside: boolean; // 2-3 days
  tags: string[];
}

export interface Category {
  id: string;
  name: CategoryType;
  nameBn: string;
  iconName: string;
  image: string;
  itemCount: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface CompareItem {
  product: Product;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  location: string; // e.g. "Dhaka, Mirpur", "Chittagong"
  likes: number;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'bKash' | 'Nagad' | 'COD' | 'Card';

export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type FraudStatus = 'Pending Review' | 'Approved' | 'Rejected' | 'Whitelisted' | 'Held';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  thana: string;
  fullAddress: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCodeApplied?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  bkashTrxId?: string;
  bkashNumber?: string;
  nagadTrxId?: string;
  nagadNumber?: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  courierTrackingNumber: string;
  courierName: 'Steadfast Courier' | 'Pathao Courier' | 'Paperfly';
  // Advanced Fraud Detection & Order Risk Management fields
  fraudScore?: number; // 0 - 100
  riskLevel?: RiskLevel; // Low Risk, Medium Risk, High Risk
  riskReasons?: string[];
  fraudStatus?: FraudStatus;
  customerIp?: string;
  isVpnProxy?: boolean;
  previousDeliverySuccessRate?: number; // e.g. 92 (%)
  pastOrderCount?: number;
}

export type BlacklistType = 'phone' | 'email' | 'address' | 'ip';
export type WhitelistType = 'phone' | 'email' | 'customer';

export interface BlacklistItem {
  id: string;
  type: BlacklistType;
  value: string;
  reason: string;
  addedAt: string;
  addedBy?: string;
  matchedCount?: number;
}

export interface WhitelistItem {
  id: string;
  type: WhitelistType;
  value: string;
  note: string;
  addedAt: string;
}

export interface FraudAnalytics {
  totalAnalyzed: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  blockedAttempts: number;
  fraudSavingsBdt: number;
  topRiskReasons: { reason: string; count: number }[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10 for 10%) or fixed BDT (e.g. 200 for ৳200)
  minSpend: number;
  description: string;
  expiryDate: string;
  usedCount?: number;
  active?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  location: string;
  avatar?: string;
  status?: 'Active' | 'Blocked';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: 'slider' | 'promo';
  linkUrl?: string;
  active: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  shippingFeeDhaka: number;
  shippingFeeOutside: number;
  freeShippingMinAmount: number;
  facebook: string;
  instagram: string;
  youtube: string;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
}

export interface WishlistCollection {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Office' | 'Family' | 'Other';
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  union?: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  phone: string;
  email?: string;
  requestedAt: string;
  status: 'Pending' | 'Notified';
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  category: 'Security' | 'Product' | 'Order' | 'System';
}

export interface CourierApiConfig {
  steadfastApiKey: string;
  steadfastSecret: string;
  pathaoClientId: string;
  pathaoSecret: string;
  redxApiKey: string;
  autoSyncOrders: boolean;
  activeDefaultCourier: 'Steadfast Courier' | 'Pathao Courier' | 'RedX';
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  totalValue: number;
  abandonedAt: string;
  recoveryStatus: 'Pending' | 'SMS Sent' | 'Recovered' | 'Ignored';
}

export interface LoyaltyAccount {
  phone: string;
  customerName: string;
  pointsBalance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalEarned: number;
  referralCode: string;
  referralsCount: number;
}


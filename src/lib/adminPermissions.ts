import { AdminTab } from '../components/admin/AdminSidebar';

export type AdminRole =
  | 'Super Admin'
  | 'Admin'
  | 'Moderator'
  | 'Customer Support'
  | 'Inventory Manager'
  | 'Order Manager'
  | 'Marketing Manager'
  | 'Delivery Manager';

export type AdminUserStatus = 'Active' | 'Suspended' | 'Disabled' | 'Pending';

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
  status: 'Success' | 'Failed';
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  details: string;
  category: 'User Management' | 'Product' | 'Order' | 'Security' | 'System';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: AdminUserStatus;
  avatar: string;
  lastLogin: string;
  createdAt: string;
  loginHistory: LoginHistoryEntry[];
  activityLogs: ActivityLogEntry[];
}

export const ALL_ROLES: AdminRole[] = [
  'Super Admin',
  'Admin',
  'Moderator',
  'Customer Support',
  'Inventory Manager',
  'Order Manager',
  'Marketing Manager',
  'Delivery Manager',
];

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  'Super Admin': 'Full unrestricted access to system, security, staff management & database settings.',
  'Admin': 'Access to catalog, order dispatch, customers, analytics and standard store operations.',
  'Moderator': 'Manage product approvals, reviews, customer ratings and moderate user comments.',
  'Customer Support': 'View and manage customer accounts, order histories, and support ticket reviews.',
  'Inventory Manager': 'Manage catalog, barcode scanning, stock counts, image manager and warehouse updates.',
  'Order Manager': 'Manage order processing, courier dispatch, fraud risk reviews and returns.',
  'Marketing Manager': 'Create and manage coupons, promotional hero banners, and cart recovery campaigns.',
  'Delivery Manager': 'Courier API integration, shipping tracking numbers and dispatch status updates.',
};

export const ROLE_PERMISSIONS: Record<AdminRole, AdminTab[]> = {
  'Super Admin': [
    'dashboard',
    'admin-users',
    'products',
    'add-product',
    'inventory-barcode',
    'image-manager',
    'orders',
    'couriers',
    'fraud',
    'security-audit',
    'customers',
    'categories',
    'coupons',
    'reviews',
    'banners',
    'marketing-recovery',
    'analytics',
    'settings',
  ],
  'Admin': [
    'dashboard',
    'products',
    'add-product',
    'orders',
    'customers',
    'categories',
    'coupons',
    'reviews',
    'banners',
    'analytics',
    'security-audit',
  ],
  'Moderator': [
    'dashboard',
    'reviews',
    'products',
    'customers',
  ],
  'Customer Support': [
    'dashboard',
    'customers',
    'orders',
    'reviews',
  ],
  'Inventory Manager': [
    'dashboard',
    'products',
    'add-product',
    'inventory-barcode',
    'image-manager',
  ],
  'Order Manager': [
    'dashboard',
    'orders',
    'couriers',
    'fraud',
  ],
  'Marketing Manager': [
    'dashboard',
    'coupons',
    'banners',
    'marketing-recovery',
  ],
  'Delivery Manager': [
    'dashboard',
    'orders',
    'couriers',
  ],
};

export function hasPermission(role: AdminRole, tab: AdminTab): boolean {
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Super Admin'];
  return allowed.includes(tab);
}

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-001',
    name: 'Super Admin',
    email: 'admin@gadgetghor.bd',
    phone: '+880 1711-000000',
    role: 'Super Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-06 10:45 AM',
    createdAt: '2026-01-01',
    loginHistory: [
      { id: 'lh-1', timestamp: '2026-08-06 10:45 AM', ip: '103.230.104.12', device: 'Chrome on macOS', location: 'Dhaka, Bangladesh', status: 'Success' },
      { id: 'lh-2', timestamp: '2026-08-05 04:12 PM', ip: '103.230.104.12', device: 'Chrome on macOS', location: 'Dhaka, Bangladesh', status: 'Success' },
      { id: 'lh-3', timestamp: '2026-08-04 09:30 AM', ip: '103.230.104.15', device: 'Safari on iPhone', location: 'Dhaka, Bangladesh', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-1', action: 'Created Admin Account', timestamp: '2026-08-06 10:48 AM', ip: '103.230.104.12', details: 'Added new Order Manager user tanvir.orders@gadgetghor.bd', category: 'User Management' },
      { id: 'al-2', action: 'Updated Store Settings', timestamp: '2026-08-05 05:00 PM', ip: '103.230.104.12', details: 'Updated free shipping threshold to ৳5000', category: 'System' },
    ],
  },
  {
    id: 'adm-002',
    name: 'Anik Rahman',
    email: 'anik.admin@gadgetghor.bd',
    phone: '+880 1812-345678',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-06 09:15 AM',
    createdAt: '2026-01-15',
    loginHistory: [
      { id: 'lh-10', timestamp: '2026-08-06 09:15 AM', ip: '203.112.220.5', device: 'Firefox on Windows', location: 'Chittagong, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-10', action: 'Approved Order #ORD-8821', timestamp: '2026-08-06 09:20 AM', ip: '203.112.220.5', details: 'Status changed to Shipped via Steadfast', category: 'Order' },
    ],
  },
  {
    id: 'adm-003',
    name: 'Sumaiya Akter',
    email: 'sumaiya.mod@gadgetghor.bd',
    phone: '+880 1913-987654',
    role: 'Moderator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-05 06:30 PM',
    createdAt: '2026-02-01',
    loginHistory: [
      { id: 'lh-20', timestamp: '2026-08-05 06:30 PM', ip: '103.145.2.11', device: 'Edge on Windows', location: 'Sylhet, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-20', action: 'Approved Product Review', timestamp: '2026-08-05 06:45 PM', ip: '103.145.2.11', details: 'Approved 5-star review on Anker PowerBank', category: 'Product' },
    ],
  },
  {
    id: 'adm-004',
    name: 'Kamrul Hasan',
    email: 'kamrul.inv@gadgetghor.bd',
    phone: '+880 1614-112233',
    role: 'Inventory Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-06 08:00 AM',
    createdAt: '2026-02-10',
    loginHistory: [
      { id: 'lh-30', timestamp: '2026-08-06 08:00 AM', ip: '103.200.40.8', device: 'Chrome on Windows', location: 'Dhaka, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-30', action: 'Stock Level Restocked', timestamp: '2026-08-06 08:30 AM', ip: '103.200.40.8', details: 'Added +50 stock to Wireless Earbuds', category: 'Product' },
    ],
  },
  {
    id: 'adm-005',
    name: 'Tanvir Ahmed',
    email: 'tanvir.orders@gadgetghor.bd',
    phone: '+880 1715-445566',
    role: 'Order Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-05 11:20 AM',
    createdAt: '2026-03-01',
    loginHistory: [
      { id: 'lh-40', timestamp: '2026-08-05 11:20 AM', ip: '103.230.104.99', device: 'Safari on Mac', location: 'Dhaka, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-40', action: 'Flagged High-Risk Order', timestamp: '2026-08-05 11:45 AM', ip: '103.230.104.99', details: 'Set ORD-9012 to Fraud Pending Review', category: 'Order' },
    ],
  },
  {
    id: 'adm-006',
    name: 'Nusrat Jahan',
    email: 'nusrat.mkt@gadgetghor.bd',
    phone: '+880 1816-778899',
    role: 'Marketing Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-04 02:15 PM',
    createdAt: '2026-03-15',
    loginHistory: [
      { id: 'lh-50', timestamp: '2026-08-04 02:15 PM', ip: '118.179.20.4', device: 'Chrome on Android', location: 'Rajshahi, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-50', action: 'Created Coupon Code', timestamp: '2026-08-04 02:40 PM', ip: '118.179.20.4', details: 'Created coupon MONSOON20 for 20% discount', category: 'System' },
    ],
  },
  {
    id: 'adm-007',
    name: 'Raju Hossain',
    email: 'raju.delivery@gadgetghor.bd',
    phone: '+880 1917-223344',
    role: 'Delivery Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-06 07:45 AM',
    createdAt: '2026-04-01',
    loginHistory: [
      { id: 'lh-60', timestamp: '2026-08-06 07:45 AM', ip: '103.120.2.80', device: 'Chrome on Windows', location: 'Dhaka, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-60', action: 'Synced Courier API', timestamp: '2026-08-06 08:10 AM', ip: '103.120.2.80', details: 'Synced 14 parcels with Steadfast API', category: 'Order' },
    ],
  },
  {
    id: 'adm-008',
    name: 'Farhana Yeasmin',
    email: 'farhana.support@gadgetghor.bd',
    phone: '+880 1518-990011',
    role: 'Customer Support',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-08-05 03:00 PM',
    createdAt: '2026-04-10',
    loginHistory: [
      { id: 'lh-70', timestamp: '2026-08-05 03:00 PM', ip: '202.84.44.1', device: 'Chrome on macOS', location: 'Dhaka, BD', status: 'Success' },
    ],
    activityLogs: [
      { id: 'al-70', action: 'Updated Customer Profile', timestamp: '2026-08-05 03:25 PM', ip: '202.84.44.1', details: 'Updated phone number for customer #CUST-102', category: 'Security' },
    ],
  },
];

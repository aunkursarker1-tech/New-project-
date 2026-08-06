import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product, Order, Customer, Coupon, Category, Review, Banner, StoreSettings, OrderStatus, BlacklistItem, WhitelistItem, FraudStatus } from '../../types';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import {
  AdminUser,
  AdminRole,
  AdminUserStatus,
  INITIAL_ADMIN_USERS,
  hasPermission,
} from '../../lib/adminPermissions';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

// Import Section Components
import { DashboardSection } from './sections/DashboardSection';
import { AdminUsersSection } from './sections/AdminUsersSection';
import { ProductsSection } from './sections/ProductsSection';
import { AddProductSection } from './sections/AddProductSection';
import { ImageManagerSection } from './sections/ImageManagerSection';
import { OrdersSection } from './sections/OrdersSection';
import { FraudManagementSection } from './sections/FraudManagementSection';
import { CustomersSection } from './sections/CustomersSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { CouponsSection } from './sections/CouponsSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { BannerManagerSection } from './sections/BannerManagerSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { SettingsSection } from './sections/SettingsSection';
import { CourierIntegrationSection } from './sections/CourierIntegrationSection';
import { InventoryBarcodeSection } from './sections/InventoryBarcodeSection';
import { SecurityAuditSection } from './sections/SecurityAuditSection';
import { MarketingRecoverySection } from './sections/MarketingRecoverySection';

import { InvoiceModal } from './InvoiceModal';

interface AdminLayoutProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  categories: Category[];
  reviews: Review[];
  banners: Banner[];
  settings: StoreSettings;
  blacklists: BlacklistItem[];
  whitelists: WhitelistItem[];
  onAddProduct: (newProd: Product) => void;
  onUpdateProduct: (updatedProd: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateCourierInfo?: (orderId: string, courierName: any, trackingNumber: string) => void;
  onUpdateFraudStatus: (orderId: string, fraudStatus: FraudStatus, score?: number) => void;
  onAddBlacklist: (item: BlacklistItem) => void;
  onRemoveBlacklist: (id: string) => void;
  onAddWhitelist: (item: WhitelistItem) => void;
  onRemoveWhitelist: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (catId: string) => void;
  onAddBanner: (banner: Banner) => void;
  onUpdateBanner: (banner: Banner) => void;
  onDeleteBanner: (bannerId: string) => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onExitAdmin: () => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  darkMode,
  onToggleDarkMode,
  products,
  orders,
  customers,
  coupons,
  categories,
  reviews,
  banners,
  settings,
  blacklists,
  whitelists,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateCourierInfo,
  onUpdateFraudStatus,
  onAddBlacklist,
  onRemoveBlacklist,
  onAddWhitelist,
  onRemoveWhitelist,
  onAddCoupon,
  onDeleteCoupon,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onSaveSettings,
  onExitAdmin,
  userEmail,
  onSignOut,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (): AdminTab => {
    const subpath = location.pathname.replace(/^\/admin\/?/, '').split('/')[0].trim();
    if (!subpath || subpath === 'dashboard') return 'dashboard';
    
    const validTabs: AdminTab[] = [
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
    ];

    return validTabs.includes(subpath as AdminTab) ? (subpath as AdminTab) : 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<AdminTab>(getTabFromPath());

  useEffect(() => {
    const currentTab = getTabFromPath();
    if (currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [location.pathname]);

  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    const targetPath = `/admin/${tab}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Admin Users & RBAC State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [currentAdminRole, setCurrentAdminRole] = useState<AdminRole>('Super Admin');

  // Sync role with logged-in email if matched
  useEffect(() => {
    if (userEmail) {
      const matched = adminUsers.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
      if (matched) {
        setCurrentAdminRole(matched.role);
      }
    }
  }, [userEmail]);

  // Admin Users Handlers
  const handleAddUser = (newUser: Omit<AdminUser, 'id' | 'createdAt' | 'loginHistory' | 'activityLogs'>) => {
    const created: AdminUser = {
      ...newUser,
      id: `adm-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      loginHistory: [
        {
          id: `lh-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          ip: '103.230.104.12',
          device: 'Chrome on macOS',
          location: 'Dhaka, Bangladesh',
          status: 'Success',
        },
      ],
      activityLogs: [
        {
          id: `al-${Date.now()}`,
          action: 'Account Provisioned',
          timestamp: new Date().toLocaleString(),
          ip: '103.230.104.12',
          details: `Provisioned ${newUser.role} account for ${newUser.name}`,
          category: 'User Management',
        },
      ],
    };
    setAdminUsers((prev) => [created, ...prev]);
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleDeleteUser = (userId: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleBulkUpdateStatus = (userIds: string[], status: AdminUserStatus) => {
    setAdminUsers((prev) =>
      prev.map((u) => (userIds.includes(u.id) ? { ...u, status } : u))
    );
  };

  const handleBulkDelete = (userIds: string[]) => {
    setAdminUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
  };

  const handleResetPassword = (userId: string): string => {
    const tempCode = `RESET-${Math.floor(100000 + Math.random() * 900000)}`;
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              activityLogs: [
                {
                  id: `al-${Date.now()}`,
                  action: 'Password Reset Issued',
                  timestamp: new Date().toLocaleString(),
                  ip: '103.230.104.12',
                  details: `Temporary security reset token ${tempCode} issued`,
                  category: 'Security',
                },
                ...u.activityLogs,
              ],
            }
          : u
      )
    );
    return tempCode;
  };

  // Editing Product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Stats for Badges
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;
  const highRiskCount = orders.filter((o) => (o.fraudScore || 0) >= 70 || o.riskLevel === 'High Risk').length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setActiveTab('add-product');
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`,
      reviewsCount: 0,
      rating: 5.0,
    };
    onAddProduct(duplicated);
  };

  const handleSaveProductFromForm = (savedProd: Product) => {
    if (editingProduct) {
      onUpdateProduct(savedProd);
    } else {
      onAddProduct(savedProd);
    }
    setEditingProduct(null);
    setActiveTab('products');
  };

  // Permission Check for current active tab
  const canAccessTab = hasPermission(currentAdminRole, activeTab);

  return (
    <div className={`min-h-screen flex font-sans ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Sidebar Navigation */}
      <AdminSidebar
        darkMode={darkMode}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'add-product' && activeTab !== 'add-product') {
            setEditingProduct(null);
          }
          setActiveTab(tab);
        }}
        pendingOrdersCount={pendingOrdersCount}
        pendingReviewsCount={pendingReviewsCount}
        highRiskCount={highRiskCount}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        onExitAdmin={onExitAdmin}
        userRole={currentAdminRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <AdminHeader
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          lowStockCount={lowStockCount}
          pendingOrdersCount={pendingOrdersCount}
          onNavigateTab={(tab) => setActiveTab(tab)}
          userEmail={userEmail}
          userRole={currentAdminRole}
          onChangeRolePreview={(role) => setCurrentAdminRole(role)}
          onSignOut={onSignOut}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {!canAccessTab ? (
            <div className={`p-8 rounded-3xl border text-center space-y-4 max-w-xl mx-auto my-12 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black">Restricted Module Access</h2>
                <p className="text-xs text-slate-400">
                  Your current role <span className="font-bold text-amber-400">({currentAdminRole})</span> does not have granted authorization to access the <span className="font-bold text-emerald-400">/admin/{activeTab}</span> module.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Main Dashboard
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardSection
                  darkMode={darkMode}
                  orders={orders}
                  products={products}
                  onSelectOrder={(ord) => setSelectedInvoiceOrder(ord)}
                  onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
                />
              )}

              {activeTab === 'admin-users' && (
                <AdminUsersSection
                  darkMode={darkMode}
                  adminUsers={adminUsers}
                  currentAdminRole={currentAdminRole}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onBulkUpdateStatus={handleBulkUpdateStatus}
                  onBulkDelete={handleBulkDelete}
                  onResetPassword={handleResetPassword}
                />
              )}

          {activeTab === 'products' && (
            <ProductsSection
              darkMode={darkMode}
              products={products}
              onAddProductClick={() => {
                setEditingProduct(null);
                setActiveTab('add-product');
              }}
              onEditProduct={handleEditProductClick}
              onDeleteProduct={onDeleteProduct}
              onDuplicateProduct={handleDuplicateProduct}
            />
          )}

          {activeTab === 'add-product' && (
            <AddProductSection
              darkMode={darkMode}
              editingProduct={editingProduct}
              onSaveProduct={handleSaveProductFromForm}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'image-manager' && (
            <ImageManagerSection darkMode={darkMode} />
          )}

          {activeTab === 'inventory-barcode' && (
            <InventoryBarcodeSection
              darkMode={darkMode}
              products={products}
              onUpdateProduct={onUpdateProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersSection
              darkMode={darkMode}
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdateCourierInfo={onUpdateCourierInfo}
              onSelectOrderInvoice={(ord) => setSelectedInvoiceOrder(ord)}
            />
          )}

          {activeTab === 'couriers' && (
            <CourierIntegrationSection
              darkMode={darkMode}
              orders={orders}
              onUpdateCourierInfo={onUpdateCourierInfo}
            />
          )}

          {activeTab === 'fraud' && (
            <FraudManagementSection
              darkMode={darkMode}
              orders={orders}
              blacklists={blacklists}
              whitelists={whitelists}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdateFraudStatus={onUpdateFraudStatus}
              onAddBlacklist={onAddBlacklist}
              onRemoveBlacklist={onRemoveBlacklist}
              onAddWhitelist={onAddWhitelist}
              onRemoveWhitelist={onRemoveWhitelist}
              onSelectOrderInvoice={(ord) => setSelectedInvoiceOrder(ord)}
            />
          )}

          {activeTab === 'security-audit' && (
            <SecurityAuditSection darkMode={darkMode} />
          )}

          {activeTab === 'customers' && (
            <CustomersSection
              darkMode={darkMode}
              customers={customers}
              orders={orders}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesSection
              darkMode={darkMode}
              categories={categories}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponsSection
              darkMode={darkMode}
              coupons={coupons}
              onAddCoupon={onAddCoupon}
              onDeleteCoupon={onDeleteCoupon}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection
              darkMode={darkMode}
              reviews={reviews}
              products={products}
            />
          )}

          {activeTab === 'banners' && (
            <BannerManagerSection
              darkMode={darkMode}
              banners={banners}
              onAddBanner={onAddBanner}
              onUpdateBanner={onUpdateBanner}
              onDeleteBanner={onDeleteBanner}
            />
          )}

          {activeTab === 'marketing-recovery' && (
            <MarketingRecoverySection darkMode={darkMode} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSection
              darkMode={darkMode}
              orders={orders}
              products={products}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSection
              darkMode={darkMode}
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}
            </>
          )}
        </main>
      </div>

      {/* Invoice Modal Overlay */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product, Order, Customer, Coupon, Category, Review, Banner, StoreSettings, OrderStatus, BlacklistItem, WhitelistItem, FraudStatus } from '../../types';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

// Import Section Components
import { DashboardSection } from './sections/DashboardSection';
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
          onSignOut={onSignOut}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardSection
              darkMode={darkMode}
              orders={orders}
              products={products}
              onSelectOrder={(ord) => setSelectedInvoiceOrder(ord)}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
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

import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Image,
  ShoppingBag,
  Users,
  FolderTree,
  Tag,
  Star,
  Sliders,
  BarChart3,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Truck,
  Barcode,
  Lock,
  Target
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'inventory-barcode'
  | 'image-manager'
  | 'orders'
  | 'couriers'
  | 'fraud'
  | 'security-audit'
  | 'customers'
  | 'categories'
  | 'coupons'
  | 'reviews'
  | 'banners'
  | 'marketing-recovery'
  | 'analytics'
  | 'settings';

interface AdminSidebarProps {
  darkMode: boolean;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  pendingReviewsCount: number;
  highRiskCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  darkMode,
  activeTab,
  onSelectTab,
  pendingOrdersCount,
  pendingReviewsCount,
  highRiskCount = 0,
  isOpenMobile,
  onCloseMobile,
  onExitAdmin,
}) => {
  const menuItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'add-product', label: 'Add New Product', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'inventory-barcode', label: 'Barcode & Inventory', icon: <Barcode className="w-4 h-4" /> },
    { id: 'image-manager', label: 'Image Manager', icon: <Image className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Orders & Dispatch',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    { id: 'couriers', label: 'Courier API Sync', icon: <Truck className="w-4 h-4" /> },
    {
      id: 'fraud',
      label: 'Fraud & Order Risk',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: highRiskCount > 0 ? highRiskCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'security-audit', label: 'Security & 2FA Logs', icon: <Lock className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons & Vouchers', icon: <Tag className="w-4 h-4" /> },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star className="w-4 h-4" />,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-purple-500 text-white',
    },
    { id: 'banners', label: 'Banner Manager', icon: <Sliders className="w-4 h-4" /> },
    { id: 'marketing-recovery', label: 'Marketing & Recovery', icon: <Target className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Sales', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 p-4 border-r flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}
      >
        {/* Top Branding Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none text-white">Gadgetghor BD</h1>
                <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-widest">Admin Portal</p>
              </div>
            </div>

            <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-xs font-bold">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-emerald-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${item.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950 opacity-80" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Exit Button */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={onExitAdmin}
            className="w-full p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-black flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Return to E-Commerce Store
          </button>
        </div>
      </aside>
    </>
  );
};

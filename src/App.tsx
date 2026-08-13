import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { supabase } from './lib/supabase';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { BrandShowcase } from './components/BrandShowcase';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { RecentlyViewedAndRecommendations } from './components/RecentlyViewedAndRecommendations';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ToastContainer, ToastMessage } from './components/Toast';

// Redesigned Pages Imports
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { WishlistView } from './components/WishlistView';
import { CompareView } from './components/CompareView';
import { TrackOrderView } from './components/TrackOrderView';
import { CustomerLoginView } from './components/CustomerLoginView';
import { AccountView } from './components/AccountView';
import { OnePageCheckout } from './components/checkout/OnePageCheckout';

import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_BANNERS,
  INITIAL_STORE_SETTINGS,
} from './data/mockData';
import { Product, CartItem, Coupon, Order, OrderStatus, Category, Review, Banner, StoreSettings, BlacklistItem, WhitelistItem, FraudStatus } from './types';
import { INITIAL_BLACKLISTS, INITIAL_WHITELISTS, populateOrdersWithFraudRisk } from './utils/fraudDetection';
import { Sparkles, Zap, Tag, Gift, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Theme & Intro State
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // Data Collections (Persistent in LocalStorage)
  const [blacklists, setBlacklists] = useState<BlacklistItem[]>(() => {
    const saved = localStorage.getItem('gadgetghor_blacklists');
    return saved ? JSON.parse(saved) : INITIAL_BLACKLISTS;
  });

  const [whitelists, setWhitelists] = useState<WhitelistItem[]>(() => {
    const saved = localStorage.getItem('gadgetghor_whitelists');
    return saved ? JSON.parse(saved) : INITIAL_WHITELISTS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gadgetghor_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gadgetghor_orders');
    let baseOrders = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    if (!baseOrders.some((o: Order) => o.id === 'GDB-21444')) {
      const gdbOrder = INITIAL_ORDERS.find(o => o.id === 'GDB-21444');
      if (gdbOrder) baseOrders = [gdbOrder, ...baseOrders];
    }
    return populateOrdersWithFraudRisk(baseOrders, INITIAL_BLACKLISTS, INITIAL_WHITELISTS);
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('gadgetghor_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('gadgetghor_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gadgetghor_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gadgetghor_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('gadgetghor_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('gadgetghor_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  // Shopping Cart & User Lists
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gadgetghor_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gadgetghor_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gadgetghor_compare');
    return saved ? JSON.parse(saved) : [];
  });

  // Customer authentication states
  const [customerName, setCustomerName] = useState<string | null>(() => {
    return localStorage.getItem('gadget_customer_name');
  });
  const [customerPhone, setCustomerPhone] = useState<string | null>(() => {
    return localStorage.getItem('gadget_customer_phone');
  });

  const handleCustomerLogin = (name: string, phone: string) => {
    setCustomerName(name);
    setCustomerPhone(phone);
    localStorage.setItem('gadget_customer_name', name);
    localStorage.setItem('gadget_customer_phone', phone);
    addToast('success', 'Logged In Successfully!', `Welcome back, ${name}.`);
    navigate('/account');
  };

  const handleCustomerLogout = () => {
    setCustomerName(null);
    setCustomerPhone(null);
    localStorage.removeItem('gadget_customer_name');
    localStorage.removeItem('gadget_customer_phone');
    addToast('info', 'Logged Out', 'You have been safely logged out of your workspace.');
    navigate('/');
  };

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Filters & Views
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [deliveryDivision, setDeliveryDivision] = useState<string>('Dhaka');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  // Admin Auth & Route State
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return sessionStorage.getItem('admin_email') || '';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  useEffect(() => {
    // Check Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAdminAuthenticated(true);
        setAdminEmail(session.user.email || '');
        sessionStorage.setItem('admin_auth', 'true');
        if (session.user.email) sessionStorage.setItem('admin_email', session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAdminAuthenticated(true);
        setAdminEmail(session.user.email || '');
        sessionStorage.setItem('admin_auth', 'true');
        if (session.user.email) sessionStorage.setItem('admin_email', session.user.email);
      } else {
        setIsAdminAuthenticated(false);
        setAdminEmail('');
        sessionStorage.removeItem('admin_auth');
        sessionStorage.removeItem('admin_email');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOutAdmin = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const handleExitAdmin = () => {
    navigate('/');
  };

  // Selected Detail Views
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [trackingTargetOrderId, setTrackingTargetOrderId] = useState<string>('');

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gadgetghor_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_compare', JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_blacklists', JSON.stringify(blacklists));
  }, [blacklists]);

  useEffect(() => {
    localStorage.setItem('gadgetghor_whitelists', JSON.stringify(whitelists));
  }, [whitelists]);

  // Fraud Management Handlers
  const handleUpdateFraudStatus = (orderId: string, fraudStatus: FraudStatus, score?: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fraudStatus,
            fraudScore: score !== undefined ? score : o.fraudScore,
          };
        }
        return o;
      })
    );
    addToast('info', 'Fraud Status Updated', `Order #${orderId} marked as ${fraudStatus}`);
  };

  const handleAddBlacklist = (item: BlacklistItem) => {
    setBlacklists((prev) => [item, ...prev]);
    addToast('error', 'Blacklist Rule Added', `Added ${item.type}: ${item.value} to Store Blacklist`);
  };

  const handleRemoveBlacklist = (id: string) => {
    setBlacklists((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Blacklist Rule Removed', 'Entry removed from blacklist');
  };

  const handleAddWhitelist = (item: WhitelistItem) => {
    setWhitelists((prev) => [item, ...prev]);
    addToast('success', 'Whitelist Member Added', `Added ${item.value} to Trusted Whitelist`);
  };

  const handleRemoveWhitelist = (id: string) => {
    setWhitelists((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Whitelist Removed', 'Entry removed from whitelist');
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color || (product.colors ? product.colors[0] : undefined) }];
      }
    });

    addToast(
      'success',
      'Added to Cart!',
      `${product.name} (Qty: ${quantity}) has been added to your shopping cart.`
    );
  };

  const handleBuyNow = (product: Product, quantity = 1, color?: string) => {
    handleAddToCart(product, quantity, color);
    setSelectedProductDetail(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    addToast('info', 'Item Removed', 'Product removed from shopping cart.');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      addToast('info', 'Removed from Wishlist', `${product.name} removed.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      addToast('success', 'Saved to Wishlist!', `${product.name} saved.`);
    }
  };

  // Compare Handlers
  const handleToggleCompare = (product: Product) => {
    if (compareIds.includes(product.id)) {
      setCompareIds((prev) => prev.filter((id) => id !== product.id));
      addToast('info', 'Removed from Compare', `${product.name} removed.`);
    } else {
      if (compareIds.length >= 4) {
        addToast('error', 'Compare Limit', 'You can compare up to 4 gadgets at a time.');
        return;
      }
      setCompareIds((prev) => [...prev, product.id]);
      addToast('success', 'Added to Compare List', `Comparing ${product.name}.`);
    }
  };

  // Coupon Handlers
  const handleApplyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      addToast('success', 'Coupon Applied!', `${found.description}`);
    } else {
      addToast('error', 'Invalid Coupon', 'The promo code entered is invalid or expired.');
    }
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setLatestPlacedOrder(newOrder);

    addToast('success', 'Order Confirmed!', `Order ID #${newOrder.id} successfully created.`);
  };

  // Admin Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', 'Product Added', `${newProduct.name} added to inventory.`);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('success', 'Product Updated', `${updated.name} updated.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('info', 'Product Deleted', 'Product removed from store catalog.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast('success', 'Order Status Updated', `Order #${orderId} marked as ${status}.`);
  };

  const handleUpdateCourierInfo = (orderId: string, courierName: any, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, courierName, courierTrackingNumber: trackingNumber } : o))
    );
    addToast('success', 'Courier Info Updated', `Order #${orderId} tracking number saved.`);
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast('success', 'Coupon Created', `Code ${newCoupon.code} is now active.`);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addToast('info', 'Coupon Deleted', `Code ${code} removed.`);
  };

  const handleAddCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
    addToast('success', 'Category Created', `Category ${category.name} added.`);
  };

  const handleUpdateCategory = (category: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
    addToast('success', 'Category Updated', `${category.name} updated.`);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    addToast('info', 'Category Deleted', 'Category removed.');
  };

  const handleAddBanner = (banner: Banner) => {
    setBanners((prev) => [...prev, banner]);
    addToast('success', 'Banner Created', `${banner.title} created.`);
  };

  const handleUpdateBanner = (banner: Banner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    addToast('success', 'Banner Updated', `${banner.title} updated.`);
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    addToast('info', 'Banner Deleted', 'Banner removed.');
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    addToast('success', 'Settings Saved', 'Store configuration updated successfully.');
  };

  const renderAdminLayout = () => (
    <AdminLayout
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      products={products}
      orders={orders}
      customers={customers}
      coupons={coupons}
      categories={categories}
      reviews={reviews}
      banners={banners}
      settings={settings}
      blacklists={blacklists}
      whitelists={whitelists}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      onUpdateCourierInfo={handleUpdateCourierInfo}
      onUpdateFraudStatus={handleUpdateFraudStatus}
      onAddBlacklist={handleAddBlacklist}
      onRemoveBlacklist={handleRemoveBlacklist}
      onAddWhitelist={handleAddWhitelist}
      onRemoveWhitelist={handleRemoveWhitelist}
      onAddCoupon={handleAddCoupon}
      onDeleteCoupon={handleDeleteCoupon}
      onAddCategory={handleAddCategory}
      onUpdateCategory={handleUpdateCategory}
      onDeleteCategory={handleDeleteCategory}
      onAddBanner={handleAddBanner}
      onUpdateBanner={handleUpdateBanner}
      onDeleteBanner={handleDeleteBanner}
      onSaveSettings={handleSaveSettings}
      onExitAdmin={handleExitAdmin}
      userEmail={adminEmail}
      onSignOut={handleSignOutAdmin}
    />
  );

  const renderAdminLogin = () => (
    <AdminLogin
      darkMode={darkMode}
      onLoginSuccess={(email) => {
        setIsAdminAuthenticated(true);
        setAdminEmail(email);
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_email', email);
        navigate('/admin/dashboard');
      }}
    />
  );

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    // Category Filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    // Tag Filter
    if (tagFilter === 'flash-sale' && !product.isFlashSale) return false;
    if (tagFilter === 'best-sellers' && !product.isBestSeller) return false;
    if (tagFilter === 'new-arrivals' && !product.isNewArrival) return false;
    if (tagFilter === 'gift-boxes' && product.category !== 'Gift Boxes') return false;

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchBn = product.nameBn && product.nameBn.includes(searchQuery);
      return matchName || matchBrand || matchCategory || matchBn;
    }

    return true;
  });

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <Routes>
      {/* Admin Login Route */}
      <Route
        path="/admin/login"
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            renderAdminLogin()
          )
        }
      />

      {/* Admin Root Route */}
      <Route
        path="/admin"
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      {/* Registered Admin Sub-Routes (/admin/dashboard, /admin/products, /admin/orders, /admin/customers, /admin/analytics, /admin/coupons, /admin/settings, /admin/fraud, etc.) */}
      <Route
        path="/admin/*"
        element={
          isAdminAuthenticated ? (
            renderAdminLayout()
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      {/* Public Storefront Route */}
      <Route
        path="/*"
        element={
          <div className={`min-h-screen pb-16 lg:pb-0 transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
            {/* Premium Welcome Screen Overlay on Load/Refresh */}
            {showWelcomeScreen && (
              <WelcomeScreen onComplete={() => setShowWelcomeScreen(false)} />
            )}

            {/* Toast Notification Layer */}
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Main Reactive Header */}
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              cartCount={cartCount}
              cartTotal={cartTotal}
              wishlistCount={wishlistIds.length}
              compareCount={compareIds.length}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setTagFilter('');
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              logoUrl={settings.logoUrl}
              allProducts={products}
              onSelectProduct={(p) => setSelectedProductDetail(p)}
              onNavigateHome={() => {
                setSelectedCategory('All');
                setTagFilter('');
                setSearchQuery('');
              }}
              onNavigateProducts={(tag) => {
                if (tag) setTagFilter(tag);
                setSelectedCategory('All');
              }}
              customerName={customerName}
              onLogout={handleCustomerLogout}
            />

            {/* Subpages routes */}
            <main className="pb-12 min-h-[calc(100vh-450px)]">
              <Routes>
                {/* Default Homepage Route */}
                <Route
                  path="/"
                  element={
                    <>
                      {selectedCategory === 'All' && !tagFilter && !searchQuery && (
                        <HeroBanner
                          darkMode={darkMode}
                          onNavigateProducts={(tag) => setTagFilter(tag || 'flash-sale')}
                          onOpenGiftBoxes={() => setSelectedCategory('Gift Boxes')}
                          onQuickView={(p) => setSelectedProductDetail(p)}
                          onAddToCart={handleAddToCart}
                          onSelectCategory={(cat) => setSelectedCategory(cat)}
                          banners={banners}
                        />
                      )}

                      {selectedCategory === 'All' && !tagFilter && !searchQuery && (
                        <CategoryGrid
                          categories={categories}
                          selectedCategory={selectedCategory}
                          onSelectCategory={setSelectedCategory}
                          darkMode={darkMode}
                        />
                      )}

                      {selectedCategory === 'All' && !tagFilter && !searchQuery && (
                        <FlashSaleSection
                          products={products}
                          darkMode={darkMode}
                          onAddToCart={handleAddToCart}
                          onAddToWishlist={handleToggleWishlist}
                          onAddToCompare={handleToggleCompare}
                          onQuickView={(p) => setSelectedProductDetail(p)}
                          wishlistIds={wishlistIds}
                          compareIds={compareIds}
                        />
                      )}

                      {/* Active Filter Bar Header */}
                      <div className="pt-4 px-3 sm:px-4 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#007A58]">
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>
                              {selectedCategory !== 'All'
                                ? selectedCategory
                                : tagFilter
                                ? tagFilter.toUpperCase().replace('-', ' ')
                                : 'CURATED CATALOG'}
                            </span>
                          </div>
                          <h2 className={`text-base sm:text-lg font-black mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {searchQuery
                              ? `Search Results for "${searchQuery}"`
                              : selectedCategory !== 'All'
                              ? `${selectedCategory} Collection`
                              : tagFilter === 'flash-sale'
                              ? '⚡ 24 Hours Flash Deals'
                              : tagFilter === 'best-sellers'
                              ? '🏆 Best Selling Gadgets in BD'
                              : tagFilter === 'new-arrivals'
                              ? '✨ New Arrival Tech'
                              : 'Featured Authentic Products'}
                          </h2>
                        </div>

                        {/* Quick Tag Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                          <button
                            onClick={() => {
                              setSelectedCategory('All');
                              setTagFilter('');
                              setSearchQuery('');
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              selectedCategory === 'All' && !tagFilter && !searchQuery
                                ? 'bg-[#007A58] text-white border-[#007A58]'
                                : 'bg-slate-800/20 border-slate-700/30 text-slate-700 dark:text-slate-300 hover:text-emerald-600'
                            }`}
                          >
                            All Items
                          </button>
                          <button
                            onClick={() => {
                              setTagFilter('flash-sale');
                              setSelectedCategory('All');
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                              tagFilter === 'flash-sale'
                                ? 'bg-rose-600 text-white border-rose-500'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                            }`}
                          >
                            <Zap className="w-3 h-3" /> Flash Deals
                          </button>
                          <button
                            onClick={() => {
                              setTagFilter('best-sellers');
                              setSelectedCategory('All');
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                              tagFilter === 'best-sellers'
                                ? 'bg-[#007A58] text-white border-[#006246]'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                            }`}
                          >
                            <Tag className="w-3 h-3" /> Best Sellers
                          </button>
                        </div>
                      </div>

                      {/* Main Product Catalog Grid */}
                      <div className="py-3 px-3 sm:px-4 max-w-7xl mx-auto">
                        {filteredProducts.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
                            {filteredProducts.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                darkMode={darkMode}
                                onAddToCart={handleAddToCart}
                                onAddToWishlist={handleToggleWishlist}
                                onAddToCompare={handleToggleCompare}
                                onQuickView={(p) => setSelectedProductDetail(p)}
                                onBuyNow={(p) => handleBuyNow(p)}
                                isWishlisted={wishlistIds.includes(product.id)}
                                isCompared={compareIds.includes(product.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-16 p-8 rounded-3xl border space-y-3 ${
                            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-[#F8F9FA] border-[#E5E7EB]'
                          }`}>
                            <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>No products found</h3>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#6B7280]'}`}>
                              Try clearing your search query or selecting a different category.
                            </p>
                            <button
                              onClick={() => {
                                setSelectedCategory('All');
                                setTagFilter('');
                                setSearchQuery('');
                              }}
                              className="px-4 py-2 rounded-xl bg-[#007A58] text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                            >
                              Reset Catalog Filters
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Smart Recommendations & Recently Viewed */}
                      <RecentlyViewedAndRecommendations
                        darkMode={darkMode}
                        products={products}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleToggleWishlist}
                        onAddToCompare={handleToggleCompare}
                        onQuickView={(p) => setSelectedProductDetail(p)}
                        onBuyNow={(p) => handleBuyNow(p)}
                        wishlistIds={wishlistIds}
                        compareIds={compareIds}
                      />

                      {/* Customer Reviews Showcase */}
                      <CustomerReviewsSection reviews={reviews} darkMode={darkMode} />

                      {/* Authorized Brand Showcase */}
                      <BrandShowcase
                        darkMode={darkMode}
                        onSelectBrand={(b) => {
                          setSearchQuery(b);
                          setSelectedCategory('All');
                        }}
                      />

                      {/* Newsletter Promo Banner */}
                      <Newsletter darkMode={darkMode} />
                    </>
                  }
                />

                {/* Redesigned Dedicated Pages */}
                <Route
                  path="/shop"
                  element={
                    <ShopView
                      products={products}
                      darkMode={darkMode}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleToggleWishlist}
                      onAddToCompare={handleToggleCompare}
                      onQuickView={(p) => setSelectedProductDetail(p)}
                      onBuyNow={(p) => handleBuyNow(p)}
                      wishlistIds={wishlistIds}
                      compareIds={compareIds}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      initialTagFilter={tagFilter}
                    />
                  }
                />

                <Route
                  path="/product/:id"
                  element={
                    <ProductDetailView
                      products={products}
                      darkMode={darkMode}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onAddToWishlist={handleToggleWishlist}
                      onAddToCompare={handleToggleCompare}
                      wishlistIds={wishlistIds}
                      compareIds={compareIds}
                    />
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <CartView
                      cartItems={cartItems}
                      darkMode={darkMode}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveCartItem}
                      onApplyCoupon={async (code) => {
                        const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
                        if (found) {
                          setAppliedCoupon(found);
                          return true;
                        }
                        return false;
                      }}
                      appliedCoupon={appliedCoupon}
                      onProceedToCheckout={() => navigate('/checkout')}
                    />
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <WishlistView
                      wishlistProducts={wishlistProducts}
                      darkMode={darkMode}
                      onAddToCart={handleAddToCart}
                      onRemoveFromWishlist={handleToggleWishlist}
                      onQuickView={(p) => setSelectedProductDetail(p)}
                    />
                  }
                />

                <Route
                  path="/compare"
                  element={
                    <CompareView
                      compareProducts={compareProducts}
                      darkMode={darkMode}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCompare={(p) => setCompareIds((prev) => prev.filter((id) => id !== p.id))}
                    />
                  }
                />

                <Route
                  path="/track-order"
                  element={
                    <TrackOrderView
                      orders={orders}
                      darkMode={darkMode}
                      initialOrderId={trackingTargetOrderId}
                    />
                  }
                />

                <Route
                  path="/login"
                  element={
                    customerName ? (
                      <Navigate to="/account" replace />
                    ) : (
                      <CustomerLoginView
                        darkMode={darkMode}
                        onLoginSuccess={handleCustomerLogin}
                      />
                    )
                  }
                />

                <Route
                  path="/account"
                  element={
                    customerName ? (
                      <AccountView
                        orders={orders}
                        darkMode={darkMode}
                        customerName={customerName}
                        customerPhone={customerPhone || ''}
                        onLogout={handleCustomerLogout}
                        onTrackOrder={(orderId) => {
                          setTrackingTargetOrderId(orderId);
                          navigate('/track-order');
                        }}
                      />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <div className="py-6 max-w-7xl mx-auto px-4">
                      <OnePageCheckout
                        cartItems={cartItems}
                        darkMode={darkMode}
                        appliedCoupon={appliedCoupon}
                        onOrderPlaced={(order) => {
                          handleOrderPlaced(order);
                          navigate('/account');
                        }}
                        onUpdateCartQuantity={handleUpdateQuantity}
                        onClose={() => navigate('/cart')}
                        initialDivision={deliveryDivision}
                      />
                    </div>
                  }
                />
              </Routes>
            </main>

            {/* Footer Section */}
            <Footer
              darkMode={darkMode}
              onNavigateCategory={(cat) => setSelectedCategory(cat)}
              onOpenOrderTracking={() => {
                setTrackingTargetOrderId('');
                navigate('/track-order');
              }}
              onOpenAdmin={() => navigate('/admin/dashboard')}
            />

            {/* Floating Support Chat Widget */}
            <LiveChatWidget darkMode={darkMode} />

            {/* Modals & Drawers */}
            <ProductDetailModal
              product={selectedProductDetail}
              onClose={() => setSelectedProductDetail(null)}
              darkMode={darkMode}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onAddToWishlist={handleToggleWishlist}
              onAddToCompare={handleToggleCompare}
              isWishlisted={selectedProductDetail ? wishlistIds.includes(selectedProductDetail.id) : false}
              isCompared={selectedProductDetail ? compareIds.includes(selectedProductDetail.id) : false}
              allReviews={reviews}
              relatedProducts={
                selectedProductDetail
                  ? products.filter(
                      (p) => p.category === selectedProductDetail.category && p.id !== selectedProductDetail.id
                    )
                  : []
              }
              onSelectProduct={(p) => setSelectedProductDetail(p)}
            />

            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              darkMode={darkMode}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveCartItem}
              coupons={coupons}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => setAppliedCoupon(null)}
              onProceedToCheckout={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              deliveryDivision={deliveryDivision}
              setDeliveryDivision={setDeliveryDivision}
            />

            <CheckoutModal
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
              cartItems={cartItems}
              darkMode={darkMode}
              appliedCoupon={appliedCoupon}
              onOrderPlaced={(order) => {
                handleOrderPlaced(order);
                navigate('/account');
              }}
              initialDivision={deliveryDivision}
              onUpdateCartQuantity={handleUpdateQuantity}
            />

            <OrderSuccessModal
              order={latestPlacedOrder}
              onClose={() => setLatestPlacedOrder(null)}
              darkMode={darkMode}
              onTrackOrder={(orderId) => {
                setTrackingTargetOrderId(orderId);
                navigate('/track-order');
              }}
            />

            <OrderTrackingModal
              isOpen={isOrderTrackingOpen}
              onClose={() => setIsOrderTrackingOpen(false)}
              orders={orders}
              darkMode={darkMode}
              initialOrderId={trackingTargetOrderId}
            />

            <ProductComparisonModal
              isOpen={isCompareOpen}
              onClose={() => setIsCompareOpen(false)}
              compareProducts={compareProducts}
              darkMode={darkMode}
              onRemoveCompare={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
              onAddToCart={handleAddToCart}
            />

            <WishlistDrawer
              isOpen={isWishlistOpen}
              onClose={() => setIsWishlistOpen(false)}
              wishlistProducts={wishlistProducts}
              darkMode={darkMode}
              onRemoveWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
              onAddToCart={handleAddToCart}
            />
          </div>
        }
      />
    </Routes>
  );
}


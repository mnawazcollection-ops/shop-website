"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminBanner,
  AdminReview,
  AdminSettings,
} from "@/types/admin";
import {
  initialAdminProducts,
  initialAdminCategories,
  initialAdminOrders,
  initialAdminCustomers,
  initialAdminCoupons,
  initialAdminBanners,
  initialAdminReviews,
  initialAdminSettings,
} from "@/data/adminMockData";

interface AdminDataContextType {
  products: AdminProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  coupons: AdminCoupon[];
  banners: AdminBanner[];
  reviews: AdminReview[];
  settings: AdminSettings;
  isLoading: boolean;

  // Product Operations
  addProduct: (product: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">) => AdminProduct;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  bulkUpdateProductStatus: (ids: string[], status: "active" | "draft" | "archived") => void;
  duplicateProduct: (id: string) => AdminProduct | null;

  // Category Operations
  addCategory: (category: Omit<AdminCategory, "id" | "createdAt" | "productCount">) => AdminCategory;
  updateCategory: (id: string, updates: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  // Order Operations
  updateOrderStatus: (orderId: string, status: AdminOrder["orderStatus"]) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: AdminOrder["paymentStatus"]) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;

  // Customer Operations
  updateCustomer: (id: string, updates: Partial<AdminCustomer>) => void;
  toggleCustomerStatus: (id: string) => void;

  // Inventory Operations
  updateStock: (productId: string, newStock: number) => void;
  quickStockAdjust: (productId: string, delta: number) => void;

  // Coupon Operations
  addCoupon: (coupon: Omit<AdminCoupon, "id" | "createdAt" | "usedCount">) => AdminCoupon;
  updateCoupon: (id: string, updates: Partial<AdminCoupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;

  // Content/Banner Operations
  addBanner: (banner: Omit<AdminBanner, "id">) => AdminBanner;
  updateBanner: (id: string, updates: Partial<AdminBanner>) => void;
  deleteBanner: (id: string) => void;

  // Review Operations
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  toggleFeatureReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<AdminSettings>) => void;
  resetToDefaults: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const PREFIX = "sir_ihsan_admin_";

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);
  const [categories, setCategories] = useState<AdminCategory[]>(initialAdminCategories);
  const [orders, setOrders] = useState<AdminOrder[]>(initialAdminOrders);
  const [customers, setCustomers] = useState<AdminCustomer[]>(initialAdminCustomers);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialAdminCoupons);
  const [banners, setBanners] = useState<AdminBanner[]>(initialAdminBanners);
  const [reviews, setReviews] = useState<AdminReview[]>(initialAdminReviews);
  const [settings, setSettings] = useState<AdminSettings>(initialAdminSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage or seed with mock data
  useEffect(() => {
    try {
      const p = localStorage.getItem(`${PREFIX}products`);
      if (p) setProducts(JSON.parse(p));

      const c = localStorage.getItem(`${PREFIX}categories`);
      if (c) setCategories(JSON.parse(c));

      const o = localStorage.getItem(`${PREFIX}orders`);
      if (o) setOrders(JSON.parse(o));

      const cu = localStorage.getItem(`${PREFIX}customers`);
      if (cu) setCustomers(JSON.parse(cu));

      const cp = localStorage.getItem(`${PREFIX}coupons`);
      if (cp) setCoupons(JSON.parse(cp));

      const b = localStorage.getItem(`${PREFIX}banners`);
      if (b) setBanners(JSON.parse(b));

      const r = localStorage.getItem(`${PREFIX}reviews`);
      if (r) setReviews(JSON.parse(r));

      const s = localStorage.getItem(`${PREFIX}settings`);
      if (s) setSettings(JSON.parse(s));
    } catch (e) {
      console.warn("Failed to load admin data from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes helpers
  const saveProducts = (updated: AdminProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(`${PREFIX}products`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCategories = (updated: AdminCategory[]) => {
    setCategories(updated);
    try {
      localStorage.setItem(`${PREFIX}categories`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrders = (updated: AdminOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(`${PREFIX}orders`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCustomers = (updated: AdminCustomer[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem(`${PREFIX}customers`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCoupons = (updated: AdminCoupon[]) => {
    setCoupons(updated);
    try {
      localStorage.setItem(`${PREFIX}coupons`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveBanners = (updated: AdminBanner[]) => {
    setBanners(updated);
    try {
      localStorage.setItem(`${PREFIX}banners`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveReviews = (updated: AdminReview[]) => {
    setReviews(updated);
    try {
      localStorage.setItem(`${PREFIX}reviews`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = (updated: AdminSettings) => {
    setSettings(updated);
    try {
      localStorage.setItem(`${PREFIX}settings`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // --- Product Actions ---
  const addProduct = (data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: AdminProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const bulkDeleteProducts = (ids: string[]) => {
    const set = new Set(ids);
    const updated = products.filter((p) => !set.has(p.id));
    saveProducts(updated);
  };

  const bulkUpdateProductStatus = (ids: string[], status: "active" | "draft" | "archived") => {
    const set = new Set(ids);
    const updated = products.map((p) =>
      set.has(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const duplicateProduct = (id: string) => {
    const orig = products.find((p) => p.id === id);
    if (!orig) return null;
    const duplicated: AdminProduct = {
      ...orig,
      id: `prod-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      slug: `${orig.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${orig.sku}-CP`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...products];
    saveProducts(updated);
    return duplicated;
  };

  // --- Category Actions ---
  const addCategory = (data: Omit<AdminCategory, "id" | "createdAt" | "productCount">) => {
    const newCat: AdminCategory = {
      ...data,
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...categories, newCat];
    saveCategories(updated);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<AdminCategory>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveCategories(updated);
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
  };

  // --- Order Actions ---
  const updateOrderStatus = (orderId: string, status: AdminOrder["orderStatus"]) => {
    const statusLabels: Record<AdminOrder["orderStatus"], string> = {
      pending: "Order Placed",
      processing: "Workshop Processing",
      shipped: "Armored Transit",
      delivered: "Delivered",
      cancelled: "Order Cancelled",
    };

    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;

      const updatedTimeline = o.timeline.map((evt) => {
        if (evt.title.toLowerCase().includes(status.toLowerCase())) {
          return { ...evt, completed: true, current: true, date: new Date().toLocaleString() };
        }
        return evt;
      });

      return {
        ...o,
        orderStatus: status,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString(),
      };
    });
    saveOrders(updated);
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: AdminOrder["paymentStatus"]) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o
    );
    saveOrders(updated);
  };

  const updateOrderNotes = (orderId: string, notes: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, notes, updatedAt: new Date().toISOString() } : o
    );
    saveOrders(updated);
  };

  // --- Customer Actions ---
  const updateCustomer = (id: string, updates: Partial<AdminCustomer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveCustomers(updated);
  };

  const toggleCustomerStatus = (id: string) => {
    const updated = customers.map((c) =>
      c.id === id ? { ...c, status: (c.status === "active" ? "disabled" : "active") as "active" | "disabled" } : c
    );
    saveCustomers(updated);
  };

  // --- Inventory Actions ---
  const updateStock = (productId: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    const updated = products.map((p) =>
      p.id === productId ? { ...p, stock: safeStock, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const quickStockAdjust = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    updateStock(productId, prod.stock + delta);
  };

  // --- Coupon Actions ---
  const addCoupon = (data: Omit<AdminCoupon, "id" | "createdAt" | "usedCount">) => {
    const newCoupon: AdminCoupon = {
      ...data,
      id: `cpn-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCoupon, ...coupons];
    saveCoupons(updated);
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<AdminCoupon>) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveCoupons(updated);
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    saveCoupons(updated);
  };

  const toggleCouponStatus = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
  };

  // --- Banner Actions ---
  const addBanner = (data: Omit<AdminBanner, "id">) => {
    const newBanner: AdminBanner = {
      ...data,
      id: `ban-${Date.now()}`,
    };
    const updated = [...banners, newBanner];
    saveBanners(updated);
    return newBanner;
  };

  const updateBanner = (id: string, updates: Partial<AdminBanner>) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, ...updates } : b));
    saveBanners(updated);
  };

  const deleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    saveBanners(updated);
  };

  // --- Review Actions ---
  const approveReview = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    saveReviews(updated);
  };

  const rejectReview = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    saveReviews(updated);
  };

  const toggleFeatureReview = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, featured: !r.featured } : r
    );
    saveReviews(updated);
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
  };

  // --- Settings ---
  const updateSettings = (updates: Partial<AdminSettings>) => {
    const updated = { ...settings, ...updates };
    saveSettings(updated);
  };

  const resetToDefaults = () => {
    saveProducts(initialAdminProducts);
    saveCategories(initialAdminCategories);
    saveOrders(initialAdminOrders);
    saveCustomers(initialAdminCustomers);
    saveCoupons(initialAdminCoupons);
    saveBanners(initialAdminBanners);
    saveReviews(initialAdminReviews);
    saveSettings(initialAdminSettings);
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        coupons,
        banners,
        reviews,
        settings,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        bulkUpdateProductStatus,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderNotes,
        updateCustomer,
        toggleCustomerStatus,
        updateStock,
        quickStockAdjust,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        addBanner,
        updateBanner,
        deleteBanner,
        approveReview,
        rejectReview,
        toggleFeatureReview,
        deleteReview,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}

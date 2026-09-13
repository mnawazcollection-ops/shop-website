"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { saveDocument, removeDocument, fetchCollection } from "@/lib/firebase/firestoreService";
import { uploadBase64OrUrl } from "@/lib/uploadClient";
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
  cleanOperationalData: () => void;
  syncCatalogToCloud: () => Promise<{ success: boolean; count: number; error?: string }>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const PREFIX = "mnawaz_admin_";
const CLEANUP_KEY = "mnawaz_pkr_currency_v1";

function getInitialData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    // Clean mock orders, clients, reviews, and sync products/settings to PKR
    if (localStorage.getItem(CLEANUP_KEY) !== "true") {
      try {
        const storedProductsRaw =
          localStorage.getItem(`${PREFIX}products`) || localStorage.getItem(`sir_ihsan_admin_products`);
        if (storedProductsRaw) {
          const storedProducts: AdminProduct[] = JSON.parse(storedProductsRaw);
          const customProducts = storedProducts.filter(
            (p) => !initialAdminProducts.some((ip) => ip.id === p.id)
          );
          const updatedProducts = [...initialAdminProducts, ...customProducts];
          localStorage.setItem(`${PREFIX}products`, JSON.stringify(updatedProducts));
        } else {
          localStorage.setItem(`${PREFIX}products`, JSON.stringify(initialAdminProducts));
        }
      } catch {
        localStorage.removeItem(`${PREFIX}products`);
      }

      localStorage.removeItem(`${PREFIX}settings`);
      localStorage.removeItem(`sir_ihsan_admin_settings`);
      localStorage.removeItem(`${PREFIX}orders`);
      localStorage.removeItem(`sir_ihsan_admin_orders`);
      localStorage.removeItem(`sir-ihsan-orders`);
      localStorage.removeItem(`sir-ihsan-latest-order`);
      localStorage.removeItem(`${PREFIX}customers`);
      localStorage.removeItem(`sir_ihsan_admin_customers`);
      localStorage.removeItem(`${PREFIX}reviews`);
      localStorage.removeItem(`sir_ihsan_admin_reviews`);
      localStorage.removeItem(`${PREFIX}coupons`);
      localStorage.removeItem(`sir_ihsan_admin_coupons`);
      localStorage.removeItem("mnawaz-cart");
      localStorage.removeItem("sir-ihsan-cart");
      localStorage.removeItem("mnawaz-wishlist");
      localStorage.removeItem("sir-ihsan-wishlist");
      localStorage.removeItem("sir-ihsan-recently-viewed");
      localStorage.setItem(CLEANUP_KEY, "true");
    }

    const item = localStorage.getItem(`${PREFIX}${key}`) || localStorage.getItem(`sir_ihsan_admin_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(() => getInitialData("products", initialAdminProducts));
  const [categories, setCategories] = useState<AdminCategory[]>(() => getInitialData("categories", initialAdminCategories));
  const [orders, setOrders] = useState<AdminOrder[]>(() => getInitialData("orders", initialAdminOrders));
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => getInitialData("customers", initialAdminCustomers));
  const [coupons, setCoupons] = useState<AdminCoupon[]>(() => getInitialData("coupons", initialAdminCoupons));
  const [banners, setBanners] = useState<AdminBanner[]>(() => getInitialData("banners", initialAdminBanners));
  const [reviews, setReviews] = useState<AdminReview[]>(() => getInitialData("reviews", initialAdminReviews));
  const [settings, setSettings] = useState<AdminSettings>(() => getInitialData("settings", initialAdminSettings));
  const [isLoading] = useState(false);

  // Re-sync with cloud if Firebase Firestore is connected
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    fetchCollection<AdminProduct>("products")
      .then((cloudProducts) => {
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts((prev) => {
            const map = new Map<string, AdminProduct>();
            prev.forEach((p) => map.set(p.id, p));
            cloudProducts.forEach((p) => map.set(p.id, { ...map.get(p.id), ...p }));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem(`${PREFIX}products`, JSON.stringify(merged));
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("mnawaz_products_updated"));
              }
            } catch {
              /* ignore */
            }
            return merged;
          });
        }
      })
      .catch((err) => console.warn("Admin Firestore sync skipped:", err));
  }, []);

  // Listen for orders and products updates across tabs and storefront checkout
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDataSync = () => {
      setOrders(getInitialData("orders", initialAdminOrders));
      setCustomers(getInitialData("customers", initialAdminCustomers));
      setProducts(getInitialData("products", initialAdminProducts));
    };

    window.addEventListener("storage", handleDataSync);
    window.addEventListener("mnawaz_orders_updated", handleDataSync);
    window.addEventListener("mnawaz_products_updated", handleDataSync);

    return () => {
      window.removeEventListener("storage", handleDataSync);
      window.removeEventListener("mnawaz_orders_updated", handleDataSync);
      window.removeEventListener("mnawaz_products_updated", handleDataSync);
    };
  }, []);

  // Save changes helpers
  const saveProducts = (updated: AdminProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(`${PREFIX}products`, JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("mnawaz_products_updated"));
      }
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

    // Asynchronously ensure base64 images migrate to Cloudinary and document saves to Firestore
    (async () => {
      let finalProduct = { ...newProduct };
      let imageUpdated = false;

      if (finalProduct.image && finalProduct.image.startsWith("data:image")) {
        try {
          const cloudRes = await uploadBase64OrUrl(
            finalProduct.image,
            "sir-ihsan/products",
            finalProduct.slug || finalProduct.name
          );
          if (cloudRes.url && !cloudRes.isFallback) {
            finalProduct.image = cloudRes.url;
            imageUpdated = true;
          }
        } catch (err) {
          console.warn("Base64 Cloudinary upload on addProduct:", err);
        }
      }

      if (imageUpdated) {
        setProducts((prev) => {
          const mapped = prev.map((p) => (p.id === finalProduct.id ? finalProduct : p));
          try {
            localStorage.setItem(`${PREFIX}products`, JSON.stringify(mapped));
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("mnawaz_products_updated"));
            }
          } catch {
            /* ignore */
          }
          return mapped;
        });
      }

      if (isFirebaseConfigured) {
        saveDocument("products", finalProduct).catch((err) =>
          console.warn("Firestore product save warning:", err)
        );
      }
    })();

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);

    (async () => {
      let target = updated.find((p) => p.id === id);
      if (!target) return;

      let imageUpdated = false;
      if (target.image && target.image.startsWith("data:image")) {
        try {
          const cloudRes = await uploadBase64OrUrl(
            target.image,
            "sir-ihsan/products",
            target.slug || target.name
          );
          if (cloudRes.url && !cloudRes.isFallback) {
            target = { ...target, image: cloudRes.url };
            imageUpdated = true;
          }
        } catch (err) {
          console.warn("Base64 Cloudinary upload on updateProduct:", err);
        }
      }

      if (imageUpdated) {
        setProducts((prev) => {
          const mapped = prev.map((p) => (p.id === id ? (target as AdminProduct) : p));
          try {
            localStorage.setItem(`${PREFIX}products`, JSON.stringify(mapped));
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("mnawaz_products_updated"));
            }
          } catch {
            /* ignore */
          }
          return mapped;
        });
      }

      if (isFirebaseConfigured) {
        saveDocument("products", target).catch((err) =>
          console.warn("Firestore product update warning:", err)
        );
      }
    })();
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);

    if (isFirebaseConfigured) {
      removeDocument("products", id).catch((err) =>
        console.warn("Firestore product deletion warning:", err)
      );
    }
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
      processing: "Packing & Preparing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    const label = statusLabels[status] || status;
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;

      const updatedTimeline = o.timeline.map((evt) => {
        if (evt.title.toLowerCase().includes(status.toLowerCase()) || evt.title === label) {
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

  const cleanOperationalData = () => {
    saveOrders([]);
    saveCustomers([]);
    saveCoupons([]);
    saveReviews([]);
    try {
      localStorage.removeItem(`${PREFIX}orders`);
      localStorage.removeItem(`sir_ihsan_admin_orders`);
      localStorage.removeItem(`sir-ihsan-orders`);
      localStorage.removeItem(`sir-ihsan-latest-order`);
      localStorage.removeItem(`${PREFIX}customers`);
      localStorage.removeItem(`sir_ihsan_admin_customers`);
      localStorage.removeItem(`${PREFIX}reviews`);
      localStorage.removeItem(`sir_ihsan_admin_reviews`);
      localStorage.removeItem(`${PREFIX}coupons`);
      localStorage.removeItem(`sir_ihsan_admin_coupons`);
      localStorage.removeItem("mnawaz-cart");
      localStorage.removeItem("sir-ihsan-cart");
      localStorage.removeItem("mnawaz-wishlist");
      localStorage.removeItem("sir-ihsan-wishlist");
      localStorage.removeItem("sir-ihsan-recently-viewed");
    } catch {
      /* ignore */
    }
  };

  // Full Catalog Sync to Cloudinary & Firebase Firestore
  const syncCatalogToCloud = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const currentProducts = [...products];
      let hasChanges = false;
      let syncedCount = 0;

      for (let i = 0; i < currentProducts.length; i++) {
        let p = { ...currentProducts[i] };
        let prodChanged = false;

        // 1. Upload base64 main image if needed
        if (p.image && p.image.startsWith("data:image")) {
          try {
            const cloudRes = await uploadBase64OrUrl(
              p.image,
              "sir-ihsan/products",
              p.slug || p.name
            );
            if (cloudRes.url && !cloudRes.isFallback) {
              p.image = cloudRes.url;
              prodChanged = true;
            }
          } catch (e) {
            console.warn(`Could not upload base64 image for ${p.name} to Cloudinary:`, e);
          }
        }

        // 2. Upload any base64 gallery images
        if (p.gallery && Array.isArray(p.gallery)) {
          const newGallery = [...p.gallery];
          for (let g = 0; g < newGallery.length; g++) {
            if (newGallery[g].startsWith("data:image")) {
              try {
                const cloudRes = await uploadBase64OrUrl(
                  newGallery[g],
                  "sir-ihsan/products",
                  `${p.slug || p.name}-gallery-${g}`
                );
                if (cloudRes.url && !cloudRes.isFallback) {
                  newGallery[g] = cloudRes.url;
                  prodChanged = true;
                }
              } catch (e) {
                console.warn("Could not upload gallery base64:", e);
              }
            }
          }
          if (prodChanged) {
            p.gallery = newGallery;
          }
        }

        if (prodChanged) {
          currentProducts[i] = p;
          hasChanges = true;
        }

        // 3. Save document to Firebase Firestore
        if (isFirebaseConfigured) {
          await saveDocument("products", p);
        }
        syncedCount++;
      }

      if (hasChanges) {
        saveProducts(currentProducts);
      }

      return { success: true, count: syncedCount };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cloud sync failed";
      console.error("syncCatalogToCloud error:", err);
      return { success: false, count: 0, error: msg };
    }
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
        cleanOperationalData,
        syncCatalogToCloud,
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

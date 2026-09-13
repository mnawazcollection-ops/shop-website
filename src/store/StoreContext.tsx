"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/types";
import { getCombinedProducts, syncProductsFromFirebase } from "./productsBridge";

/* ─────────────── Cart ─────────────── */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/* ─────────────── Combined Store ─────────────── */
interface StoreContextType {
  // Products Catalog
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  // Wishlist
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  // Search
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Live Products Catalog (combines static products with admin-added products like "tatheer")
  const [products, setProducts] = useState<Product[]>(() => getCombinedProducts());

  // Re-sync products on mount, storage events, and custom update triggers
  useEffect(() => {
    // Initial sync
    setProducts(getCombinedProducts());

    const handleSync = () => {
      setProducts(getCombinedProducts());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("mnawaz_products_updated", handleSync);

    // Also pull any cloud products from Firebase Firestore
    syncProductsFromFirebase((updated) => {
      setProducts(updated);
    });

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("mnawaz_products_updated", handleSync);
    };
  }, []);

  const getProductBySlug = useCallback(
    (slug: string) => {
      const cleanSlug = decodeURIComponent(slug).toLowerCase();
      return products.find(
        (p) => p.slug.toLowerCase() === cleanSlug || p.id === slug || p.id === cleanSlug
      );
    },
    [products]
  );

  // Lazy state initialization from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("mnawaz-cart") || localStorage.getItem("sir-ihsan-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);

  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedWishlist = localStorage.getItem("mnawaz-wishlist") || localStorage.getItem("sir-ihsan-wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });
  const [isSearchOpen, setSearchOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("mnawaz-cart", JSON.stringify(cartItems));
    } catch {
      /* ignore */
    }
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem("mnawaz-wishlist", JSON.stringify(wishlistItems));
    } catch {
      /* ignore */
    }
  }, [wishlistItems]);

  /* ── Cart ── */
  const addToCart = useCallback(
    (product: Product, quantity = 1, variants?: Record<string, string>) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity, selectedVariants: variants || i.selectedVariants }
              : i
          );
        }
        return [...prev, { product, quantity, selectedVariants: variants }];
      });
      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  /* ── Wishlist ── */
  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (wishlistItems.some((p) => p.id === product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const wishlistCount = wishlistItems.length;

  return (
    <StoreContext.Provider
      value={{
        products,
        getProductBySlug,
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
        cartCount, cartSubtotal, isCartOpen, setCartOpen,
        wishlistItems, addToWishlist, removeFromWishlist, isInWishlist,
        toggleWishlist, clearWishlist, wishlistCount,
        isSearchOpen, setSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useProducts() {
  const s = useStore();
  return { products: s.products, getProductBySlug: s.getProductBySlug };
}

export function useCart() {
  const s = useStore();
  return {
    items: s.cartItems, addToCart: s.addToCart, removeFromCart: s.removeFromCart,
    updateQuantity: s.updateQuantity, clearCart: s.clearCart,
    cartCount: s.cartCount, cartSubtotal: s.cartSubtotal,
    isCartOpen: s.isCartOpen, setCartOpen: s.setCartOpen,
  };
}

export function useWishlist() {
  const s = useStore();
  return {
    items: s.wishlistItems, addToWishlist: s.addToWishlist,
    removeFromWishlist: s.removeFromWishlist, isInWishlist: s.isInWishlist,
    toggleWishlist: s.toggleWishlist, clearWishlist: s.clearWishlist, wishlistCount: s.wishlistCount,
  };
}

export function useSearch() {
  const s = useStore();
  return { isSearchOpen: s.isSearchOpen, setSearchOpen: s.setSearchOpen };
}

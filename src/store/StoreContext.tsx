"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/types";

/* ─────────────── Cart ─────────────── */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/* ─────────────── Combined Store ─────────────── */
interface StoreContextType {
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
  wishlistCount: number;
  // Search
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sir-ihsan-cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("sir-ihsan-wishlist");
      if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem("sir-ihsan-cart", JSON.stringify(cartItems)); } catch { /* ignore */ }
    }
  }, [cartItems, hydrated]);

  // Persist wishlist
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem("sir-ihsan-wishlist", JSON.stringify(wishlistItems)); } catch { /* ignore */ }
    }
  }, [wishlistItems, hydrated]);

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

  const wishlistCount = wishlistItems.length;

  return (
    <StoreContext.Provider
      value={{
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
        cartCount, cartSubtotal, isCartOpen, setCartOpen,
        wishlistItems, addToWishlist, removeFromWishlist, isInWishlist,
        toggleWishlist, wishlistCount,
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
    toggleWishlist: s.toggleWishlist, wishlistCount: s.wishlistCount,
  };
}

export function useSearch() {
  const s = useStore();
  return { isSearchOpen: s.isSearchOpen, setSearchOpen: s.setSearchOpen };
}

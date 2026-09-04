"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/StoreContext";

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    isCartOpen,
    setCartOpen,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC and lock body scroll
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCartOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isCartOpen, setCartOpen]);

  if (!isCartOpen) return null;

  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A]">
              Shopping Cart
            </h2>
            <span className="text-[12px] bg-[#FAF7F4] text-[#C8A165] font-semibold px-2 py-0.5 rounded-full border border-[#eee]">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-[#999] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close cart"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-6 py-3.5 bg-[#FAF7F4] border-b border-[#eee]">
          <p className="text-[12px] text-[#555] text-center mb-2">
            {remainingForFreeShipping > 0 ? (
              <>
                Add <span className="font-semibold text-[#C8A165]">${remainingForFreeShipping.toFixed(2)}</span> more to enjoy <span className="font-semibold">Free Express Shipping</span>!
              </>
            ) : (
              <span className="font-semibold text-green-700 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Congratulations! You qualified for Free Express Shipping!
              </span>
            )}
          </p>
          <div className="w-full bg-[#E5DFD7] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C8A165] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-[#f0f0f0]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F4] flex items-center justify-center mb-4 text-[#C8A165]">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="font-cormorant text-2xl font-bold text-[#1A1A1A] mb-1">
                Your cart is empty
              </p>
              <p className="text-[13px] text-[#888] mb-6 max-w-[240px]">
                Discover our timeless jewelry collections and artisan fine pieces.
              </p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-7 py-3 text-[12px] font-semibold uppercase tracking-[2px] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map(({ product, quantity, selectedVariants }) => (
              <div key={product.id} className="py-4 flex gap-4 items-center">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => setCartOpen(false)}
                  className="relative w-20 h-20 bg-[#F8F6F3] shrink-0 border border-[#f0f0f0] overflow-hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="font-medium text-[14px] text-[#1A1A1A] hover:text-[#C8A165] transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  {selectedVariants && Object.keys(selectedVariants).length > 0 && (
                    <p className="text-[11px] text-[#888] capitalize mt-0.5">
                      {Object.entries(selectedVariants)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" / ")}
                    </p>
                  )}
                  <p className="text-[13px] font-semibold text-[#C8A165] mt-1">
                    ${product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#ddd]">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#666] hover:bg-[#FAF7F4]"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[12px] font-semibold text-[#1A1A1A]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#666] hover:bg-[#FAF7F4]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-[11px] text-[#999] hover:text-red-500 uppercase tracking-wider underline ml-auto transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#eee] bg-[#FAF7F4] space-y-4">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-[#666] uppercase tracking-wider text-[12px] font-semibold">
                Subtotal
              </span>
              <span className="font-bold text-[18px] text-[#1A1A1A]">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] text-[#888]">
              Taxes and shipping calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="w-full text-center py-3.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white uppercase text-[11px] tracking-[2px] font-bold transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="w-full text-center py-3.5 bg-[#C8A165] hover:bg-[#b8914f] text-white uppercase text-[11px] tracking-[2px] font-bold transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

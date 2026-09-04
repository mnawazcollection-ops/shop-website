"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/StoreContext";
import { categories } from "@/data";

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
  } = useCart();

  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent?: number;
    amount?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Discount calculation
  const discountAmount = appliedDiscount
    ? appliedDiscount.percent
      ? (cartSubtotal * appliedDiscount.percent) / 100
      : (appliedDiscount.amount || 0)
    : 0;

  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const shipping =
    cartSubtotal === 0 || cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 35;
  const estimatedTotal = discountedSubtotal + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "LUXURY10" || code === "WELCOME10") {
      setAppliedDiscount({ code, percent: 10 });
      setCouponSuccess("10% luxury discount applied!");
    } else if (code === "GOLD50") {
      setAppliedDiscount({ code, amount: 50 });
      setCouponSuccess("$50 artisan discount applied!");
    } else {
      setCouponError("Invalid promo code. Try 'LUXURY10' or 'GOLD50'");
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 1500);
  };

  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartSubtotal
  );

  return (
    <div className="bg-[#FCFAF8] min-h-[80vh] py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[12px] text-[#888] uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-[#C8A165] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Shopping Bag</span>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-[3px] text-[#C8A165] font-semibold mb-2">
            Your Selection
          </p>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-[#1A1A1A]">
            Shopping Bag
          </h1>
        </div>

        {checkoutSuccess ? (
          <div className="max-w-2xl mx-auto bg-white p-12 text-center border border-[#eee] shadow-sm">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-3">
              Thank You For Your Order
            </h2>
            <p className="text-[14px] text-[#666] leading-relaxed mb-6">
              Your bespoke luxury order has been received. Our master jewellers are preparing your pieces with complimentary insured packaging. A confirmation email has been sent.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/shop"
                className="bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-8 py-3.5 text-[12px] uppercase tracking-[2px] font-bold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-3xl mx-auto bg-white p-12 text-center border border-[#eee] shadow-sm">
            <div className="w-20 h-20 bg-[#FAF7F4] text-[#C8A165] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="font-cormorant text-3xl font-bold text-[#1A1A1A] mb-3">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-[14px] text-[#777] mb-8 max-w-md mx-auto">
              Before you can checkout, you must select items to purchase. Explore our signature artisan collections below.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#1A1A1A] hover:bg-[#C8A165] text-white px-10 py-4 text-[12px] uppercase tracking-[2px] font-bold transition-colors mb-12"
            >
              Start Shopping
            </Link>

            {/* Featured Categories in Empty State */}
            <div className="pt-10 border-t border-[#eee]">
              <p className="text-[12px] uppercase tracking-[2px] text-[#999] font-semibold mb-6">
                Featured Categories
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="p-4 bg-[#FAF7F4] hover:bg-[#f3ede3] transition-colors border border-[#eee] text-center group"
                  >
                    <p className="font-cormorant text-lg font-bold text-[#1A1A1A] group-hover:text-[#C8A165] transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[#888] mt-1">{cat.productCount} Items</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Items & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free Shipping Notification Card */}
              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#555] font-medium">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <strong className="text-[#C8A165]">${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>Free Express Insured Shipping</strong>
                      </>
                    ) : (
                      <span className="text-green-700 font-semibold flex items-center gap-1.5">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        You have unlocked Complimentary Insured Express Shipping!
                      </span>
                    )}
                  </span>
                  <span className="text-[12px] text-[#888]">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-[#f0ede8] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C8A165] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="bg-white border border-[#eee] shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-[#FAF7F4] border-b border-[#eee] text-[11px] uppercase tracking-[1.5px] font-semibold text-[#888]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-[#eee]">
                  {items.map(({ product, quantity, selectedVariants }) => (
                    <div
                      key={product.id}
                      className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product details */}
                      <div className="col-span-6 flex items-center gap-4">
                        <Link
                          href={`/product/${product.slug}`}
                          className="relative w-20 h-20 bg-[#F8F6F3] shrink-0 border border-[#eee] overflow-hidden"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wider text-[#999]">
                            {product.category}
                          </p>
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-cormorant text-lg font-bold text-[#1A1A1A] hover:text-[#C8A165] transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          {selectedVariants && Object.keys(selectedVariants).length > 0 && (
                            <p className="text-[11px] text-[#888] capitalize mt-0.5">
                              {Object.entries(selectedVariants)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </p>
                          )}
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-[11px] text-[#999] hover:text-red-500 uppercase tracking-wider underline mt-2 block transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-left md:text-center text-[14px] text-[#555] font-medium">
                        <span className="md:hidden text-[12px] text-[#888] mr-2">Price:</span>
                        ${product.price.toFixed(2)}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex items-center md:justify-center">
                        <div className="flex items-center border border-[#ddd]">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#555] hover:bg-[#FAF7F4] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              updateQuantity(
                                product.id,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="w-10 h-8 text-center text-[13px] font-semibold text-[#1A1A1A] border-x border-[#ddd] outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#555] hover:bg-[#FAF7F4] transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-left md:text-right font-semibold text-[15px] text-[#1A1A1A]">
                        <span className="md:hidden text-[12px] text-[#888] mr-2">Subtotal:</span>
                        ${(product.price * quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Bottom Actions */}
                <div className="p-6 bg-[#FAF7F4] border-t border-[#eee] flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[1.5px] font-semibold text-[#1A1A1A] hover:text-[#C8A165] transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-[12px] uppercase tracking-[1.5px] font-semibold text-[#999] hover:text-red-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Notes Field */}
              <div className="bg-white p-6 border border-[#eee] shadow-sm">
                <label className="block text-[12px] uppercase tracking-[1.5px] font-semibold text-[#1A1A1A] mb-2">
                  Special Instructions / Gift Message
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add custom ring sizing, bespoke engraving requests, or luxury gift card messages..."
                  rows={3}
                  className="w-full p-3 text-[13px] border border-[#ddd] outline-none focus:border-[#C8A165] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white p-8 border border-[#eee] shadow-sm">
                <h2 className="font-cormorant text-2xl font-bold text-[#1A1A1A] pb-4 border-b border-[#eee] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-[14px] text-[#555] mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span className="font-semibold">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Insured Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-700">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax & Duties</span>
                    <span className="font-semibold text-[#1A1A1A]">Included</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-[#eee]">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#777] mb-2">
                    Promo / Gift Card
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. LUXURY10"
                      className="flex-1 px-3 py-2.5 text-[13px] border border-[#ddd] outline-none focus:border-[#C8A165] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#C8A165] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-[11px] mt-1.5">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-600 text-[11px] mt-1.5">{couponSuccess}</p>
                  )}
                </form>

                {/* Total */}
                <div className="pt-4 border-t border-[#eee] mb-8">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-[#1A1A1A] text-lg">Estimated Total</span>
                    <span className="font-cormorant text-3xl font-bold text-[#C8A165]">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#999]">
                    Including insured delivery & certificate of authenticity
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#C8A165] hover:bg-[#b8914f] disabled:bg-[#ddd] text-white py-4 uppercase text-[12px] tracking-[2px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Securing Order...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-[#eee] space-y-2 text-[11px] text-[#888] text-center">
                  <p className="flex items-center justify-center gap-1.5">
                    <span>🔒</span> 256-Bit SSL Encrypted Checkout
                  </p>
                  <p>Complimentary Insured Shipping & 30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
